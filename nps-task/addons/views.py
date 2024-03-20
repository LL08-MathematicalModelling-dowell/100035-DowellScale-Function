import json

from django.http import HttpRequest
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ScaleSerializer, ScaleResponseSerializer
from nps.dowellconnection import dowellconnection
from api.views import nps_response_view_submit
from dowellnps_scale_function.settings import public_url

class ScaleCreateAPIView(APIView):
    def db_operations(self, command, payload=None):
        if payload is not None:
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE", command, payload, "nil")
            return response_data

    def generate_urls(self,payload, id):
        urls_dict = {}
        for i in range(1,int(payload['total_no_of_items']) + 1):
            main_url = f"Item number {i} links:"
            instances = [f"{public_url}/{payload['scale_name']}/{id}/{j + 1}" for j in range(payload['no_of_scales'])]
            urls_dict[main_url] = instances
        return urls_dict
    def post(self, request, format=None):
        serializer = ScaleSerializer(data=request.data)
        if serializer.is_valid():
            scale_name = serializer.validated_data['scale_name']
            scale_type = serializer.validated_data['scale_type']
            total_no_of_items = serializer.validated_data['total_no_of_items']
            no_of_instances = serializer.validated_data['no_of_instances']

            payload = {"settings":{"scale_name": scale_name, "total_no_of_items": total_no_of_items, "scale_category": scale_type,
                         "no_of_scales": no_of_instances, "allow_resp":True}}
            # save data to db
            try:
                response = self.db_operations(command="insert", payload=payload)
                response = json.loads(response)
                response_id = response['inserted_id']

                urls = self.generate_urls(payload['settings'],response_id)
                response_data = {
                    "scale_name": scale_name,
                    "scale_category": "nps scale",
                    "total_no_of_items": total_no_of_items,
                    "no_of_instances": no_of_instances,
                    "response_id": response_id,
                    "urls": urls
                }


                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(e)
                return Response("Unexpected Error Occurred!", status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        id = request.query_params.get('id')
        try:
            # Query the database to retrieve data based on the provided ID
            response_data = self.db_operations(command="find", payload={"_id": id})
            response = json.loads(response_data)['data']
            if response:
                # Extract the relevant information from the response
                scale_name = response.get('scale_name')
                scale_type = response.get('scale_category')
                total_no_of_items = response.get('total_no_of_items')
                no_of_instances = response.get('no_of_scales')

                # Generate URLs based on the retrieved data
                urls = self.generate_urls(response['settings'], id)

                # Prepare the response data
                response_data = {
                    "scale_name": scale_name,
                    "scale_type": scale_type,
                    "total_no_of_items": total_no_of_items,
                    "no_of_instances": no_of_instances,
                    "response_id": id,
                    "urls": urls
                }

                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response("Scale not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response("Unexpected Error Occurred!", status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['POST', 'GET', 'PUT'])
def error_response(request, message, status):
    return Response(message, status=status)

def post_scale_response(request):
    scale_id = request.GET.get('scale_id')

    try:
        if scale_id is not None and request.method == "GET":
            responses = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                         "1094", "ABCDE", "fetch", {"scale_data.scale_id": scale_id.strip()}, "nil")
            return error_response(request, {"success": True, "data": json.loads(responses)['data']},
                                  status.HTTP_200_OK)
        if request.method == "POST":
            print(request)
            return nps_response_view_submit(request)


    except Exception as e:
        print("response", e)
        return Response({"Unexpected error occurred!": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            instances = [f"{public_url}/{payload['scale_name']}/{id}/{j + 1}" for j in range(payload['no_of_instances'])]
            urls_dict[main_url] = instances
        return urls_dict
    def post(self, request, format=None):
        serializer = ScaleSerializer(data=request.data)
        if serializer.is_valid():
            scale_name = serializer.validated_data['scale_name']
            scale_type = serializer.validated_data['scale_type']
            total_no_of_items = serializer.validated_data['total_no_of_items']
            no_of_instances = serializer.validated_data['no_of_instances']

            payload = {"scale_name": scale_name, "total_no_of_items": total_no_of_items, "scale_type": scale_type,
                         "no_of_instances": no_of_instances}
            # save data to db
            try:
                response = self.db_operations(command="insert", payload=payload)
                response = json.loads(response)
                response_id = response['inserted_id']
                urls = self.generate_urls(payload,response_id)
                response_data = {
                    "scale_name": scale_name,
                    "scale_type": scale_type,
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
                scale_type = response.get('scale_type')
                total_no_of_items = response.get('total_no_of_items')
                no_of_instances = response.get('no_of_instances')

                # Generate URLs based on the retrieved data
                urls = self.generate_urls(response, id)

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


# @api_view(['GET', 'POST'])
# def scale_response_view(request, id=None):
#     if request.method == 'GET' and id is not None:
#         # Handle GET request with id parameter
#         return get_scale_response(request, id)
#     elif request.method == 'POST':
#         # Handle POST request
#         return post_scale_response(request)
#     else:
#         return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
#
# def get_scale_response(request, id):
#     # Your logic for handling GET request with id parameter
#     pass
#
# def post_scale_response(request):
#     serializer = ScaleResponseSerializer(data=request.data)
#     if serializer.is_valid():
#         scale_id = serializer.validated_data['scale_id']
#         score = serializer.validated_data['score']
#         instance_id = serializer.validated_data['instance_id']
#         payload = {
#             "scale_id": scale_id,
#             "instance_id": instance_id,
#             "scale_type": "nps_scale",
#             "score": score
#         }
#         # Accessing Django HttpRequest object from rest_framework.request.Request
#         django_request = request._request  # Get the Django HttpRequest object
#         try:
#             # Create a new HttpRequest object with POST method
#             post_request = HttpRequest()
#             post_request.method = 'POST'
#             # Pass the post_request object along with the original request to nps_response_view_submit
#             response = nps_response_view_submit(post_request, payload)
#         except Exception as e:
#             print("response", e)
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         return Response(response, status=status.HTTP_200_OK)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
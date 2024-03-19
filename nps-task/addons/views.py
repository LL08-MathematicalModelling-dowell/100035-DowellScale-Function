from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ScaleSerializer
from nps.dowellconnection import dowellconnection

class ScaleCreateAPIView(APIView):
    def post(self, request, format=None):
        serializer = ScaleSerializer(data=request.data)
        if serializer.is_valid():
            scale_name = serializer.validated_data['scale_name']
            scale_type = serializer.validated_data['scale_type']
            total_no_of_items = serializer.validated_data['total_no_of_items']
            no_of_instances = serializer.validated_data['no_of_instances']


            # Process the data here, for example:
            # Save to the database, perform calculations, etc.
            field_add = {"scale_name": scale_name, "total_no_of_items": total_no_of_items, "scale_type": scale_type,"no_of_instances": no_of_instances}
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE", "insert", field_add, "nil")
            print(response_data)
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# def generate_urls(scale_name, scale_type, total_no_of_items, no_of_instances):
#     urls_dict = {}
#     for i in range(total_no_of_items):
#         main_url = f"/{scale_name}/{scale_type}/{i + 1}/"
#         instances = [f"instance{j + 1}" for j in range(no_of_instances)]
#         urls_dict[main_url] = instances
#     return urls_dict
#
# print(generate_urls("scale_name", "scale_type", 3, 8))
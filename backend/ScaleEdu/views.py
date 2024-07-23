from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from addons.datacube import datacube_data_retrieval, api_key
from addons._serializers import ReportsSerializer
import json
import time


class LearningIndexReport(APIView):
    def get(self,request):
        serializer = ReportsSerializer(data = request.GET)
        if serializer.is_valid():
            scale_id = serializer.validated_data['scale_id']
            time_period = serializer.validated_data['time_period']
            channel_names_string = serializer.validated_data.get('channel_names', '')
            instance_names_string = serializer.validated_data.get('instance_names','')
            
            channel_names = channel_names_string[0].split(',') if channel_names_string else []
            instance_names = instance_names_string[0].split(',') if instance_names_string else []
        
            print(channel_names)
            filters = {'scale_id':scale_id}
            response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scale_response", "collection_1", filters, 10000, 0, False))

            if response_data['data']:
                response_details = response_data['data']
                days_map = {"7":7,"30":30,"90":90}
                end_timestamp = time.time()
                start_timestamp = end_timestamp - (days_map[time_period]*24*60*60)

                filtered_response_details = [
                response for response in response_details
                if start_timestamp <= time.mktime(time.strptime(response['dowell_time']['current_time'], '%Y-%m-%d %H:%M:%S')) <= end_timestamp
                and ((not channel_names or response['channel_name'] in channel_names ) and (not instance_names or response['instance_name'] in instance_names))
            ]
                print(filtered_response_details)
                if not filtered_response_details:
                    return Response({"success": "false", "message": "No responses found within the given time period."}, status=status.HTTP_404_NOT_FOUND)


                return Response({"success":"true","message":"successfully fetched the responses","total_reponses":len(filtered_response_details), "data":filtered_response_details}, status= status.HTTP_200_OK)
            else:
                return Response({"success":"false",
                                "message":"No responses found for the given scale id. Check if the scale exists"},
                                status=status.HTTP_404_NOT_FOUND)
            
        else:
            return Response({"success": "false",
                             "message":serializer.errors},
                              status=status.HTTP_400_BAD_REQUEST )
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from addons.datacube import datacube_data_retrieval, api_key
from addons._serializers import ReportsSerializer
import json
import time
from .utils.helper import *
from .serializers import *


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
        
class LearningIndexReports(APIView):
    def post(self, request):
        scale_id = request.data.get("scale_id")
        workspace_id = request.data.get("workspace_id")
        channel_names = request.data.get("channel_names")
        instance_names = request.data.get("instance_names")
        period = request.data.get("period")

        serializer = ScaleReportRequestSerializer(data={
            "scale_id": scale_id,
            "workspace_id": workspace_id,
            "channel_names": channel_names,
            "instance_names": instance_names,
            "period": period,
        })

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data in payload",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            start_date, end_date = get_date_range(period)

            filters = {
                "scale_id": scale_id,
                "workspace_id": workspace_id,
                "dowell_time.current_time": {"$gte": start_date, "$lte": end_date}
            }
            if "all" not in channel_names:
                filters["channel_name"] = {"$in": channel_names}
            if "all" not in instance_names:
                filters["instance_name"] = {"$in": instance_names}


            response_text = datacube_data_retrieval(
                api_key,
                "livinglab_scale_response",
                "collection_1",
                filters,
                0,
                0,
                False
            )
            response = json.loads(response_text)


            if "data" not in response:
                raise ValueError("Data key not found in response")

            response_data = response["data"]
            report_data = {}
            total_count = len(response_data)

            for item in response_data:
                channel = item.get("channel_name", "")
                instance = item.get("instance_name", "")

                if channel not in report_data:
                    report_data[channel] = []

                report_data[channel].append({
                    "instance_name": instance,
                    "score": item.get("score", 0),
                    "category": item.get("category", ""),
                    "date": item.get("dowell_time", {}).get("current_time", ""),
                    "channel_display_name": item.get("channel_display_name", ""),
                    "instance_display_name": item.get("instance_display_name", ""),
                    "learning_index_data": item.get("learning_index_data", {})
                })

            return Response({
                "success": "true",
                "message": "Successfully fetched the learning index reports",
                "response": {
                    "workspace_id": workspace_id,
                    "scale_id": scale_id,
                    "total_count": total_count,
                    "report_data": report_data
                }
            })

        except ValueError as ve:
            return Response({
                "success": "false",
                "message": str(ve)
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "success": "false",
                "message": "An error occurred while processing the request: " + str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        workspace_id = request.query_params.get("workspace_id")
        scale_id = request.query_params.get("scale_id")

        if not workspace_id or not scale_id:
            return Response({
                "success": False,
                "message": "Both workspace_id and scale_id are required."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            response_text = datacube_data_retrieval(
                api_key,
                "livinglab_scale_response",
                "collection_1",
                {
                    "scale_id": scale_id,
                    "workspace_id": workspace_id
                },
                0,
                0,
                False
            )
            response = json.loads(response_text)

            if "data" not in response:
                raise ValueError("Data key not found in response")

            response_data = response["data"]

            channels = {}
            for item in response_data:
                channel_name = item.get("channel_name")
                instance_name = item.get("instance_name")
                instance_display_name = item.get("instance_display_name", "")
                if channel_name and instance_name:
                    if channel_name not in channels:
                        channels[channel_name] = {
                            "channel_name": channel_name,
                            "channel_display_name": item.get("channel_display_name", ""),
                            "instances": set() 
                        }
                    channels[channel_name]["instances"].add((
                        instance_name,
                        instance_display_name
                    ))

            for channel in channels.values():
                channel["instances"] = [
                    {
                        "instance_name": inst_name,
                        "instance_display_name": inst_display_name
                    }
                    for inst_name, inst_display_name in channel["instances"]
                ]
                channel["instances"].sort(key=lambda x: x["instance_name"])
            
            result = {
                "channels": sorted(channels.values(), key=lambda x: x["channel_name"])
            }

            return Response({
                "success": True,
                "channels": result["channels"]
            })

        except ValueError as ve:
            return Response({
                "success": False,
                "message": str(ve)
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "success": False,
                "message": "An error occurred while processing the request: " + str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
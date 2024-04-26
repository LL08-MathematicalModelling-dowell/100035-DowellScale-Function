from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from addons.datacube import datacube_data_insertion, datacube_data_retrieval, datacube_data_update, api_key
from addons.v3_serializers import ChannelInstanceSerializer, InstanceDetailsSerializer
from .serializer import ScaleSerializer, ScaleSettingsSerializer, ScaleResponseSerializer
from api.utils import dowell_time
from nps.eventID import get_event_id
import json

class CreateNPSLiteScale(APIView):
    def post(self, request):
        scale_serializer = ScaleSerializer(data=request.data)
        try:
            if scale_serializer.is_valid():
                workspace_id = scale_serializer.validated_data['workspace_id']
                username = scale_serializer.validated_data['username']
                scale_name = scale_serializer.validated_data['scale_name']
                user_type = scale_serializer.validated_data['user_type']
                no_of_responses = scale_serializer.validated_data['no_of_responses']
                scale_type = "nps_lite"
                
                scale_customizations = scale_serializer.validated_data['customizations']
                scale_settings_serializer = ScaleSettingsSerializer(data=scale_customizations)
                if scale_settings_serializer.is_valid():
                    orientation = scale_settings_serializer.validated_data['orientation']
                    scalecolor = scale_settings_serializer.validated_data['scalecolor']
                    fontcolor = scale_settings_serializer.validated_data['fontcolor']
                    fontstyle = scale_settings_serializer.validated_data['fontstyle']

                channel_instance_list = scale_serializer.validated_data['channel_instance_list']
        
                channel_serializer = ChannelInstanceSerializer(data=channel_instance_list, many=True)
                if channel_serializer.is_valid():
                    validated_channel_instance_list = channel_serializer.validated_data
            
                    for channel_instance in validated_channel_instance_list:
                        instance_serializer = InstanceDetailsSerializer(data=channel_instance['instances_details'], many=True)
                        if instance_serializer.is_valid():
                            validated_instance_details = instance_serializer.validated_data

                event_id = get_event_id()
                date_created = dowell_time("Asia/Calcutta")
                configurations = {
                        "scale_name":scale_name,
                        "workspace_id":workspace_id,
                        "username":username,
                        "no_of_channels": len(channel_instance_list),
                        "channel_instance_list":channel_instance_list,
                        "no_of_responses":no_of_responses,
                        "scale_type":scale_type,
                        "user_type":user_type
                    }
                
                customizations = {
                        "orientation":orientation,
                        "scalecolor":scalecolor,
                        "fontcolor":fontcolor,
                        "fontstyle":fontstyle,
                }
                settings = {
                            "customizations":customizations,
                            "configs":configurations,
                            "event_id":event_id,
                            "date_created":date_created["current_time"]     
                        }
                
                insert_settings = json.loads(datacube_data_insertion(api_key, "livinglab_scales", "collection_3", settings))
               
                scale_id = insert_settings['data'].get("inserted_id")

                return Response({"success":"true",
                                "message":"NPS Lite scale created successfully",
                                "scale_id":scale_id,
                                "scale_settings":settings
                            },status=status.HTTP_201_CREATED)
            else:
                return Response(scale_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
       
        except Exception as e:
            print("Exception: ", e)
            return Response({
                                "success":"false",
                                "message":"Could not create the scale. Contact admin."
                                }, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request):
        try:
            id = request.GET.get('scale_id')

            # response_data = datacube_db(api_key=api_key, operation="fetch", id=id)
            response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scales", "collection_3", {"_id":id}, 10000, 0, False))
            response = response_data['data'][0]
            
           
            if response:
                # Extract the relevant information from the response
                customizations = response["customizations"]
                configurations = response["configs"]
                

                api_response_data = {
                    "scale_customizations": customizations,
                    "scale_configs": configurations
                }

                return Response(
                    {"success": True, "message": "settings fetched successfully", "settings": api_response_data},
                    status=status.HTTP_200_OK)
            else:
                return Response("Scale not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response(f"Unexpected error occured while fetching your data", status=status.HTTP_400_BAD_REQUEST)

class CreateNPSLiteResponse(APIView):
    def post(self, request):
        response_serializer = ScaleResponseSerializer(data = request.data)
        try:
            if response_serializer.is_valid():
                scale_id = response_serializer.validated_data['scale_id']
                score = response_serializer.validated_data['score']
                workspace_id = response_serializer.validated_data['workspace_id']
                username = response_serializer.validated_data['username']
                user_type = response_serializer.validated_data['user_type']
                scale_type = response_serializer.validated_data['scale_type']
                channel_name = response_serializer.validated_data['channel']
                instance_name = response_serializer.validated_data['instance']
                user_info = dict(request.headers)

                scale_settings = json.loads(datacube_data_retrieval(api_key, "livinglab_scales", "collection_3", {"_id":scale_id}, 10000, 0, False))

                if not scale_settings['data']:
                    return Response({"success":"false",
                                     "message":"Scale does not exist"
                                     },status=status.HTTP_404_NOT_FOUND)
                else:
                    existing_responses = json.loads(datacube_data_retrieval(api_key, "livinglab_scale_response", "collection_1", {"scale_id":scale_id}, 10000, 0, False))
                    matching_channel_instances = []
                    for data in  existing_responses['data']:
                        if data['response_info']['channel']==channel_name and data['response_info']['instance']==instance_name:
                            matching_channel_instances.append(data)
                            existing_response_count = len(matching_channel_instances)
                        else: 
                            existing_response_count = 0
                    current_response_count = existing_response_count+1

                    if score == 0:
                        category = "detractor"

                    elif score == 1:
                        category = "neutral"
                    
                    elif score == 2:
                        category = "promoter"

                    else: 
                        return Response({"success":"false",
                                        "message":"Invalid value for score"},
                                        status=status.HTTP_400_BAD_REQUEST)
                    
                    scale_response_data = {
                        "scale_id":scale_id,
                        "owner_info":{
                                        "workspace_id":workspace_id,
                                        "username":username,
                                        "user_type":user_type
                                    },
                        "response_info":{
                                        "channel":channel_name,
                                        "instance":instance_name,
                                        "score":score,
                                        "category":category,
                                        "response_no":current_response_count
                                    },
                        "user_info":user_info
                    }

                    inserted_response = json.loads(datacube_data_insertion(api_key, "livinglab_scale_response", "collection_1", scale_response_data))
                    response_id = inserted_response['data']['inserted_id']

                    if user_type == True:
                        product_url = "https://www.uxlive.me/dowellscale/npslitescale"
                        redirect_url = f"{product_url}/?workspace_id={workspace_id}&scale_type={scale_type}&score={score}&channel={channel_name}&instance={instance_name}"
                        
                        return Response({
                                        "success":"true",
                                        "message":"Response submission successful",
                                        "response_id":response_id,
                                        "response_details":scale_response_data['response_info'],
                                        "redirect_url":redirect_url
                        },status = status.HTTP_200_OK)
                    else:
                        return Response({
                                        "success":"true",
                                        "message":"Response submission successful",
                                        "response_id":response_id,
                                        "response_details":scale_response_data['response_info']
                        },status = status.HTTP_200_OK)
                
            else:
                return Response(response_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("EXCEPTION:",e)
            return Response({
                             "success":"false",
                             "message":"Unexpected error occuered while processing your request. Contact the admin."
                             }, status=status.HTTP_400_BAD_REQUEST)

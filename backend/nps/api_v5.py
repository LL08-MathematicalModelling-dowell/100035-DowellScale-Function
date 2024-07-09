from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from addons.datacube import datacube_data_insertion, datacube_data_retrieval, datacube_data_update, api_key
from addons._serializers import ChannelInstanceSerializer, InstanceDetailsSerializer
from .serializer import ScaleSerializer, ScaleSettingsSerializer, ScaleResponseSerializer
from api.utils import dowell_time
from nps.eventID import get_event_id
import json


class CreatedNPSScale(APIView):
    def build_url(self, payload):
        for channel_instance in payload['channel_instance_list']:
            first_channel = payload['channel_instance_list'][0]
            channel_name = first_channel.get('channel_name')
            if channel_name is not None:
                url = f"http://127.0.0.1:8000/nps/api/v5/nps-create-scale/?user={payload['user_type']}&scale_type={payload['scale_category']}&workspace_id={payload['workspace_id']}&username={payload['username']}&scale_id={payload['scale_id']}&channel_name={channel_name}"
                return url  # Return the first valid URL
        return None  

    def generate_url(self, payload):
        return self.build_url(payload)
    
    def post(self, request):
        scale_serializer = ScaleSerializer(data=request.data)
        try:
            if scale_serializer.is_valid():
                workspace_id = scale_serializer.validated_data['workspace_id']
                username = scale_serializer.validated_data['username']
                scale_name = scale_serializer.validated_data['scale_name']
                user_type = scale_serializer.validated_data['user_type']
                no_of_responses = scale_serializer.validated_data['no_of_responses']
                scale_type = "nps"
                
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
                
                payload = {
                        "scale_type": scale_type,
                        "channel_instance_list": channel_instance_list
                    }
                

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
                

                for channel_instance in channel_instance_list:
                    channel_name = channel_instance.get('channel_name')
                    
                    instances_details = channel_instance.get('instances_details', [])
                    for instance_detail in instances_details:
                        instance_name = instance_detail.get('instance_name')
                        user_info = instance_detail.get('user_info')
                        
                        # Append instance details to payload if long and lat exist
                        if instance_name is not None:
                            payload['channel_instance_list'].append({
                                "channel_name": channel_name,
                                "instance_name": instance_name,
                                "user_info": user_info
                            })

                
                insert_settings = json.loads(datacube_data_insertion(api_key, "livinglab_scales", "collection_3", settings))
               
                scale_id = insert_settings['data'].get("inserted_id")

                payload = {"settings": {
                            "scale_id": scale_id,
                            "scale_category": scale_type,
                            "no_of_channels": len(channel_instance_list),
                            "channel_instance_list":channel_instance_list,
                            "no_of_responses": no_of_responses,
                            "user_type": user_type,
                            "scale_type": scale_type,
                            "allow_resp": True,
                            "workspace_id": workspace_id,
                            "username": username,
                            "event_id": event_id,
                    }
                }


                payload['settings'].update({"scale_id":scale_id})
                # generate the button urls
                url = self.generate_url(payload['settings'])
                datacube_data_update(api_key, "livinglab_scales", "collection_3", {"_id": scale_id}, {"urls":url})

                return Response({"success":"true",
                                "message":"NPS scale created successfully",
                                "scale_id":scale_id,
                                "scale_settings":settings,
                                "master_link": url
                            },status=status.HTTP_201_CREATED)
            else:
                return Response(scale_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
       
        except Exception as e:
            print("Exception: ", e)
            return Response({
                                "success":"false",
                                "message":"Could not create the scale. Contact admin."
                                }, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        try:
            scale_id = request.GET.get('scale_id')
            if not scale_id:
                return Response({"success": "false", "message": "scale_id parameter is missing"}, status=status.HTTP_400_BAD_REQUEST)

            response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scales", "collection_3", {"_id": scale_id}, 10000, 0, False))
            if not response_data['data']:
                return Response({"success": "false", "message": "Scale not found"}, status=status.HTTP_404_NOT_FOUND)

            response = response_data['data'][0]
            workspace_id = response['configs'].get('workspace_id')
            channel_instance_list = response['configs']['channel_instance_list']
            channel_name = response['configs']['channel_instance_list'][0]['channel_name']
            instance_name = request.GET.get('instance_name')
            instance_id = request.GET.get('instance_id')
            

            instance_details = None

            for channel in channel_instance_list:
                if channel['channel_name'] == channel_name:
                    instances = channel.get('instances_details', [])

                    if isinstance(instances, list):
                        for instance in instances:
                            if instance['instance_name'] == instance_name:
                                instance_details = {
                                    'channel_name': channel['channel_name'],
                                    'instance_name': instance.get('instance_name'),
                                    'instance_display_name': instance.get('instance_display_name'),
                                }
                                break
                if instance_details:
                    break       

        
            product_url = "https://ll08-mathematicalmodelling-dowell.github.io/100035-DowellScale-Function/home/master-link"
            
            if instance_id:
                redirect_url=f'{product_url}/npsscale?workspace_id={workspace_id}&scale_id={scale_id}&channel_name={channel_name}&instance_name=instance_{instance_id}'
            else:
                redirect_url = f"{product_url}/?workspace_id={workspace_id}&scale_id={scale_id}&channel_name={channel_name}"

            
            return redirect(redirect_url)
        except Exception as e:
            print("EXCEPTION:", e)
            return Response({"success": "false", "message": "Unexpected error occurred while fetching your data"}, status=status.HTTP_400_BAD_REQUEST)
        

class CreatedNPSResponse(APIView):
    def post(self, request):
        response_serializer = ScaleResponseSerializer(data=request.data)
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

                scale_settings = json.loads(datacube_data_retrieval(api_key, "livinglab_scales", "collection_3", {"_id": scale_id}, 10000, 0, False))
                
                if not scale_settings['data']:
                    return Response({"success": "false", "message": "Scale does not exist"}, status=status.HTTP_404_NOT_FOUND)
                
            
                existing_responses = json.loads(datacube_data_retrieval(api_key, "livinglab_scale_response", "collection_1", {"scale_id": scale_id}, 10000, 0, False))
                if existing_responses['data']:
                    matching_channel_instances = [data for data in existing_responses['data'] if data['response_info']['channel'] == channel_name and data['response_info']['instance'] == instance_name]
                    # for data in matching_channel_instances:
                    #     print(data)
                    #     if data["user_info"]['X-Real-Ip'] == user_info['X-Real-Ip']:
                    #         return Response({"success": "false", "message": "You have already submitted a rating for this scale."}, status=status.HTTP_403_FORBIDDEN)
                    existing_response_count = len(matching_channel_instances)
                else:
                    existing_response_count = 0
                current_response_count = existing_response_count + 1

                if 0 <= score <= 6:
                    category = "detractor"
                elif 7 <= score <= 8:
                    category = "passive"
                elif 9 <= score <= 10:
                    category = "promoter"
                else:
                    return Response({"success": "false", "message": "Invalid value for score"}, status=status.HTTP_400_BAD_REQUEST)

                scale_response_data = {
                    "scale_id": scale_id,
                    "owner_info": {
                        "workspace_id": workspace_id,
                        "username": username,
                        "user_type": user_type
                    },
                    "response_info": {
                        "channel": channel_name,
                        "instance": instance_name,
                        "score": score,
                        "category": category,
                        "response_no": current_response_count
                    },
                    "user_info": user_info
                }

                inserted_response = json.loads(datacube_data_insertion(api_key, "livinglab_scale_response", "collection_1", scale_response_data))
                response_id = inserted_response['data']['inserted_id']
            

                if user_type == True:
                    product_url = "https://www.uxlive.me/dowellscale/npslitescale"
                    redirect_url = f"{product_url}/?workspace_id={workspace_id}&scale_type={scale_type}&score={score}&channel={channel_name}&instance={instance_name}"
                    
                    return Response({
                        "success": "true",
                        "message": "Response submission successful",
                        "response_id": response_id,
                        "response_details": scale_response_data['response_info'],
                        "redirect_url": redirect_url
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        "success": "true",
                        "message": "Response submission successful",
                        "response_id": response_id,
                        "response_details": scale_response_data['response_info']
                    }, status=status.HTTP_200_OK)

            else:
                return Response(response_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("EXCEPTION:", e)
            return Response({
                "success": "false",
                "message": "Unexpected error occurred while processing your request. Contact the admin."
            }, status=status.HTTP_400_BAD_REQUEST)
        
    



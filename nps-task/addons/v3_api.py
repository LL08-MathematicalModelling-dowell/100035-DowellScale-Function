from itertools import chain
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .v3_serializers import ScaleSerializer, InstanceDetailsSerializer, ChannelInstanceSerializer
from dowellnps_scale_function.settings import public_url
from .datacube import datacube_data_insertion, datacube_data_retrieval, datacube_data_update, api_key
from api.utils import dowell_time
from nps.eventID import get_event_id
import json


class ScaleCreateAPI(APIView):

    def build_urls(self, channel_instance,payload,instance_idx):
        urls = []
        scale_range = payload["scale_range"]
        for idx in scale_range:
            url = f"{public_url}/addons/create-response/v3/?user={payload['user_type']}&scale_type={payload['scale_category']}&channel={channel_instance['channel_name']}&instance={channel_instance['instances_details'][instance_idx]['instance_name']}&workspace_id={payload['workspace_id']}&username={payload['username']}&scale_id={payload['scale_id']}&item={idx}"
            # url = f"http://127.0.0.1:8000/addons/create-response/v3/?user={payload['user_type']}&scale_type={payload['scale_category']}&channel={channel_instance['channel_name']}&instance={channel_instance['instances_details'][instance_idx]['instance_name']}&workspace_id={payload['workspace_id']}&username={payload['username']}&scale_id={payload['scale_id']}&item={idx}"
            urls.append(url)
        return urls

    def generate_urls(self, payload):
        response = []
        for channel_instance in payload["channel_instance_list"]:
            channel_response = {
                "channel_name": channel_instance["channel_name"],
                "channel_display_name": channel_instance["channel_display_name"],
                "urls": []
            }
            for instance_detail in channel_instance["instances_details"]:
                instance_idx = channel_instance["instances_details"].index(instance_detail)
                instance_response = {
                    "instance_name": instance_detail["instance_name"],
                    "instance_display_name": instance_detail["instance_display_name"],
                    "instance_urls": self.build_urls(channel_instance, payload,instance_idx)
                }
                channel_response["urls"].append(instance_response)
            response.append(channel_response)
        
        return response


    def adjust_scale_range(self, payload):
        print("Inside adjust_scale_range function")
        scale_type = payload['scale_type']
        total_no_of_items = int(payload['total_no_of_items'])
        if "pointers" in payload:
            pointers = payload['pointers']
        if "axis_limit" in payload:
            axis_limit = payload['axis_limit']
        print(f"Scale type: {scale_type}, Total number of items: {total_no_of_items}")

        if scale_type == 'nps':
            scale_range = range(0, 11)
            print(scale_range)
            return scale_range

        elif scale_type == 'nps_lite':
            return range(0, 3)
        elif scale_type == 'stapel':
            if 'axis_limit' in payload:
                pointers = int(payload['axis_limit'])
                return chain(range(-axis_limit, 0), range(1, axis_limit + 1))
        elif scale_type == 'likert':
            if 'pointers' in payload:
                pointers = int(payload['pointers'])
                return range(1, pointers + 1)
            else:
                raise ValueError("Number of pointers not specified for Likert scale")
        else:
            raise ValueError("Unsupported scale type")

    def scale_type(self, scale_type, payload):
        if scale_type == "nps":
            no_of_items = 11
        elif scale_type == "nps lite":
            no_of_items = 3
        elif scale_type == "likert":
            pointers = payload['pointers']
            no_of_items = pointers
        elif scale_type == "stapel":
            axis_limit = payload["axis_limit"]
            no_of_items = 2 * axis_limit
            print(no_of_items)
        else:
            no_of_items = 11
        return no_of_items

    def post(self, request, format=None):
        scale_serializer = ScaleSerializer(data=request.data)
        if scale_serializer.is_valid():
            workspace_id = scale_serializer.validated_data['workspace_id']
            username = scale_serializer.validated_data['username']
            scale_name = scale_serializer.validated_data['scale_name']
            scale_type = scale_serializer.validated_data['scale_type']
            user_type = scale_serializer.validated_data['user_type']
            no_of_responses = scale_serializer.validated_data['no_of_responses']
            
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
           
            if scale_type == "likert":
                pointers = scale_serializer.validated_data.get('pointers')
                if pointers is not None:
                    payload['pointers'] = pointers
                else:
                    return Response("Missing field for likert", status=status.HTTP_400_BAD_REQUEST)

            if scale_type == "stapel":
                axis_limit = scale_serializer.validated_data.get('axis_limit')
                if axis_limit is not None:
                    payload['axis_limit'] = axis_limit
                else:
                    return Response("Missing field for stapel", status=status.HTTP_400_BAD_REQUEST)

            total_no_of_items = self.scale_type(scale_type, payload)
            payload["total_no_of_items"] = total_no_of_items
           
            scale_range = self.adjust_scale_range(payload)
            payload["scale_range"] = scale_range

            event_id = get_event_id()

            payload = {"settings": {
                            "api_key": api_key,
                            "scale_name": scale_name,
                            "total_no_of_items": total_no_of_items,
                            "scale_category": scale_type,
                            "no_of_channels": len(channel_instance_list),
                            "channel_instance_list":channel_instance_list,
                            "no_of_responses": no_of_responses,
                            "user_type": user_type,
                            "allow_resp": True,
                            "workspace_id": workspace_id,
                            "username": username,
                            "event_id": event_id,
                            "scale_range": list(scale_range),
                            "pointers": pointers if scale_type == "likert" else None,
                            "axis_limit": axis_limit if scale_type == "stapel" else None
                }
            }
            
            try:
                # response = datacube_db(payload=payload, api_key=api_key, operation="insert")
                response = json.loads(datacube_data_insertion(api_key, "livinglab_scales", "collection_3", payload))
                scale_id = response['data'].get("inserted_id")
                payload['settings'].update({"scale_id":scale_id})

                # generate the button urls
                urls = self.generate_urls(payload['settings'])
               
                # insert urls into the db
                # datacube_db(payload=payload, api_key=api_key, operation="update", id=scale_id, update_data={"urls": urls})
                datacube_data_update(api_key, "livinglab_scales", "collection_3", {"_id": scale_id}, {"urls":urls})
                
                response_data = {
                    "workspace_id": workspace_id,
                    "username": username,
                    "scale_name": scale_name,
                    "scale_category": scale_type,
                    "scale_id": scale_id,
                    "user_type": user_type,
                    "total_no_of_buttons": total_no_of_items,
                    "no_of_responses": no_of_responses,
                    "no_of_channels":len(channel_instance_list),
                    "urls": urls
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(e)
                return Response({"message": "Could not process your request. Contact the admin."},status=status.HTTP_400_BAD_REQUEST)
        return Response(scale_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, format=None):
        try:
            id = request.query_params.get('scale_id')

            # response_data = datacube_db(api_key=api_key, operation="fetch", id=id)
            response_data = datacube_data_retrieval(api_key, "livinglab_scales", "collection_3", {"_id":id}, 10000, 0, False)
            response = response_data['data'][0]
            settings = response["settings"]
           
            if response:
                # Extract the relevant information from the response
                scale_name = settings.get('scale_name')
                scale_type = settings.get('scale_category')
                scale_type = settings.get('scale_category')
                total_no_of_items = settings.get('total_no_of_items')
                no_of_instances = settings.get('no_of_scales')
                no_of_instances = settings.get('no_of_scales')
                urls = response.get('urls')

                api_response_data = {
                    "scale_id": id,
                    "scale_name": scale_name,
                    "scale_type": scale_type,
                    "total_no_of_buttons": total_no_of_items,
                    "no_of_instances": no_of_instances,
                    "urls": urls
                }

                return Response(
                    {"success": True, "message": "settings fetched successfully", "settings": api_response_data},
                    status=status.HTTP_200_OK)
            else:
                return Response("Scale not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response(f"Unexpected error occured while fetching your data", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'GET', 'PUT'])
def error_response(request, message, status):
    return Response(message, status=status)


@api_view(['GET'])
def create_scale_response(request):
   
    scale_id = request.GET.get('scale_id')
    item = int(request.GET.get('item'))
    workspace_id = request.GET.get('workspace_id')
    username = request.GET.get('username')
    user_type = request.GET.get('user')
    scale_type = request.GET.get('scale_type')
    channel_name = request.GET.get('channel')
    instance_name = request.GET.get('instance')
    header = dict(request.headers)
   
    
    if request.method == "GET":
        try:
            
            existing_data = {
                "workspace_id":workspace_id,
                "username":username,
                "scale_id":scale_id,
                "score": item,
                "user_type":user_type,
                "user_info":header
            }

            #fetch the relevant settings meta data 
            # settings_meta_data = datacube_db(api_key=api_key, operation="fetch", id=scale_id)
            settings_meta_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scales", "collection_3",{"_id":scale_id}, 10000, 0, False))
            data = settings_meta_data['data'][0]['settings']
            
            no_of_responses = data["no_of_responses"]
            
            #response submission logic
            # response_data = datacube_db_response(api_key=api_key, scale_id=scale_id,channel_name=channel_name,instance_name=instance_name, operation="fetch")
           
            fields = {"scale_id":scale_id,"channel_name":channel_name,"instance_name":instance_name}
            response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scale_response", "collection_1", fields, 10000, 0, False))
            
            current_response_count = len(response_data['data']) + 1 if response_data['data'] else 1

            if current_response_count <= no_of_responses:
                event_id = get_event_id()
                created_time = dowell_time("Asia/Calcutta")

                existing_data.update({
                    "event_id":event_id,
                    "dowell_time":created_time,
                    "current_response_count": current_response_count,
                    "channel_name":channel_name,
                    "instance_name":instance_name
                })
                
                # responses =datacube_db_response(api_key=api_key, payload=existing_data, operation="insert")
                responses = json.loads(datacube_data_insertion(api_key, "livinglab_scale_response", "collection_1", existing_data))
                response_id = responses['data']['inserted_id']
                
                if user_type == "True":
                    product_url = "https://www.uxlive.me/dowellscale/npslitescale"
                    generated_url = f"{product_url}/?workspace_id={workspace_id}&scale_type={scale_type}&score={item}&channel={channel_name}&instance={instance_name}"
                    return redirect(generated_url)
                else:
                    return Response({
                        "success": responses['success'],
                        "message": "Response recorded successfully",
                        "response_id": response_id,
                        "score": item,
                        "channel":channel_name,
                        "current_response_no": current_response_count,
                        "no_of_available_responses": no_of_responses - current_response_count,
                        "time_stamp": created_time["current_time"]
                    })
            else:
                return Response({"success": False,
                                "message": "All instances for this scale have been consumed. Create a new scale to continue"},
                                status=status.HTTP_200_OK)

        except Exception as e:
            print("response", e)
            return Response({"Resource not found! Contact the admin"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response("Method not allowed")
from itertools import chain
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ScaleSerializer, ScaleResponseSerializer
from dowellnps_scale_function.settings import public_url
from .db_operations import datacube_db, datacube_db_response, api_key
from api.utils import dowell_time
from nps.eventID import get_event_id
import json


class ScaleCreateAPIView(APIView):
    def generate_urls(self, payload, id):
        urls_dict = []
        # channel_urls={}
        workspace_id = payload['workspace_id']
        username = payload['username']
        scale_range = payload['scale_range']
        user_type = payload['user_type']
        scale_type = payload['scale_category']
        channel_list = payload['channel_list']
        no_of_instances = payload['no_of_instances']
        
    
        # for i in range(len(channel_list)) :
        #     for j in scale_range :
        #         channel = channel_list[i]
        #         print(f"current",i,j, "and channel", channel)
        #         main_url = f"Button {j} link:"
        #         # instances = [f"{public_url}/addons/create-response/?user={user_type}&channel={channel}&workspace_id={workspace_id}&username={username}&scale_id={id}&item={i}"]
        #         instances = [f"http://127.0.0.1:8000/addons/create-response/?user={user_type}&scale_type={scale_type}&channel={channel}&workspace_id={workspace_id}&username={username}&scale_id={id}&item={j}" ]
        #         channel_urls[main_url]=instances
        #         urls_dict[channel]=channel_urls
        
        # return urls_dict
        for i in range(len(channel_list)) :
            for k in range(1,no_of_instances[i]+1):
                for j in scale_range :
                    # channel = channel_list[i]
                    # print(f"current",i,j, "and channel", channel)
                    # main_url = f"Button {j} link:"
                    # instances = [f"{public_url}/addons/create-response/?channel={channel}&workspace_id={workspace_id}&username={username}&scale_id={id}&item={i}"]
                    instances = [f"http://127.0.0.1:8000/addons/create-response/?user={user_type}&scale_type={scale_type}&channel={i+1}&instance={k}&workspace_id={workspace_id}&username={username}&scale_id={id}&item={j}" ]
                    urls_dict.append(instances)
                    
        return urls_dict


    def adjust_scale_range(self, payload):
        scale_type = payload['scale_type']
        total_no_of_items = int(payload['total_no_of_items'])
        if "pointers" in payload:
            pointers = payload['pointers']
        if "axis_limit" in payload:
            axis_limit = payload['axis_limit']

        if scale_type == 'nps scale':
            scale_range = range(0, 11)
            return scale_range

        elif scale_type == 'nps_lite':
            return range(0, 3)
        elif scale_type == 'stapel scale':
            if 'axis_limit' in payload:
                pointers = int(payload['axis_limit'])
                return chain(range(-axis_limit, 0), range(1, axis_limit + 1))
        elif scale_type == 'likert scale':
            if 'pointers' in payload:
                pointers = int(payload['pointers'])
                return range(1, pointers + 1)
            else:
                raise ValueError("Number of pointers not specified for Likert scale")
        else:
            raise ValueError("Unsupported scale type")

    def scale_type(self, scale_type, payload):
        if scale_type == "nps scale":
            no_of_items = 11
        elif scale_type == "npslite scale":
            no_of_items = 3
        elif scale_type == "likert scale":
            pointers = payload['pointers']
            no_of_items = pointers
        elif scale_type == "stapel scale":
            axis_limit = payload["axis_limit"]
            no_of_items = 2 * axis_limit
        else:
            no_of_items = 11
        return no_of_items

    # CREATE URLS API VIEW
    def post(self, request, format=None):
        serializer = ScaleSerializer(data=request.data)
    
        if serializer.is_valid():
            workspace_id = serializer.validated_data['workspace_id']
            username = serializer.validated_data['username']
            scale_name = serializer.validated_data['scale_name']
            scale_type = serializer.validated_data['scale_type']
            user_type = serializer.validated_data['user_type']
            channel_list = serializer.validated_data['channel_list']
            no_of_responses = serializer.validated_data['no_of_responses']
            no_of_instances = serializer.validated_data['no_of_instances']
        
            payload = {"scale_type": scale_type,
                       "no_of_instances":no_of_instances}

            if scale_type == "likert scale":
                try:
                    request.data['pointers']
                    pointers = serializer.validated_data['pointers']
                    payload['pointers'] = pointers
                except Exception as e:
                    print(e)
                    return Response(f"missing field for likert {e}", status=status.HTTP_400_BAD_REQUEST)

            if scale_type == "stapel scale":
                try:
                    request.data['axis_limit']
                    axis_limit = serializer.validated_data['axis_limit']
                    payload['axis_limit'] = axis_limit
                except Exception as e:
                    print(e)
                    return Response(f"missing field for stapel {e}", status=status.HTTP_400_BAD_REQUEST)


            total_no_of_items = self.scale_type(scale_type, payload)
            payload["total_no_of_items"] = total_no_of_items

            scale_range = self.adjust_scale_range(payload)

            event_id = get_event_id()

            payload = {"settings": {
                "api_key": api_key,
                "scale_name": scale_name,
                "total_no_of_items": total_no_of_items,
                "scale_category": scale_type,
                "no_of_instances": no_of_instances,
                "no_of_responses":no_of_responses,
                "user_type":user_type,
                "channel_list":channel_list,
                "allow_resp": True,
                "workspace_id": workspace_id,
                "username": username,
                "event_id": event_id,
                "scale_range": list(scale_range),
                "pointers": pointers if scale_type == "likert scale" else "",
                "axis_limit": axis_limit if scale_type == "stapel scale" else ""
            }
            }
            # save data to db
            try:
                response = datacube_db(payload=payload, api_key=api_key, operation="insert", )

                scale_id = response['data'].get("inserted_id")

                # generate the button urls
                urls = self.generate_urls(payload['settings'], scale_id)

                # insert urls into the db
                datacube_db(payload=payload, api_key=api_key, operation="update", id=scale_id,
                            update_data={"urls": urls})

                response_data = {
                    "workspace_id": workspace_id,
                    "username": username,
                    "scale_name": scale_name,
                    "scale_category": scale_type,
                    "user_type":user_type,
                    "total_no_of_buttons": total_no_of_items,
                    "no_of_responses":no_of_responses,
                    "no_of_instances": no_of_instances,
                    "scale_id": scale_id,
                    "total_no_of_links":len(urls),
                    "urls": urls
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(e)
                return Response({"message": "Unexpected Error Occurred!", "error": e},
                                status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        try:
            id = request.query_params.get('scale_id')

            # if not id or not api_key:
            #     return Response(f"Error: api_key or scale_id missing!", status=status.HTTP_400_BAD_REQUEST)

            # Query the database to retrieve data based on the provided ID
            response_data = datacube_db(api_key=api_key, operation="fetch", id=id)
            response = response_data['data'][0]
            settings = response["settings"]

            if response:
                # Extract the relevant information from the response
                scale_name = settings.get('scale_name')
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
            return Response(f"Error: {e}", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'GET', 'PUT'])
def error_response(request, message, status):
    return Response(message, status=status)


@api_view(['GET'])
def post_scale_response(request):
    scale_id = request.GET.get('scale_id')
    item = int(request.GET.get('item'))
    workspace_id = request.GET.get('workspace_id')
    username = request.GET.get('username')
    user_type = request.GET.get('user')
    channel_no = int(request.GET.get('channel'))
    scale_type = request.GET.get('scale_type')
    # real_ip = request.headers["X-Real-IP"]
    # print(">>>>>>>>>>>>",real_ip)
    

    if request.method == "GET":
        try:
            
            existing_data = {
                "workspace_id":workspace_id,
                "username":username,
                "scale_id":scale_id,
                "score": item,
                "user_type":user_type,
                # "ip_address":real_ip
            }

            # fetch the relevant settings meta data
            settings_meta_data = datacube_db(api_key=api_key, operation="fetch", id=scale_id)
            data = settings_meta_data['data'][0]['settings']
            print(data)
            print(channel_no)
            no_of_instances = data["no_of_instances"]
            instance_id = no_of_instances[channel_no-1]
            no_of_responses = data["no_of_responses"]
            channel_list = data["channel_list"]
            channel_instance_id = channel_no
            channel_name = channel_list[channel_no-1]
            print(channel_name)
            existing_data["channel_name"]=channel_name
            

            #response submission logic
            response_data = datacube_db_response(api_key=api_key, scale_id=scale_id,channel_name=channel_name,instance_id=instance_id, operation="fetch")
            print(response_data)
           
            current_instance_id = len(response_data['data']) + 1 if response_data['data'] else 1
            for data_entry in response_data['data']:
                # Check if the 'ip_address' field exists and matches the provided IP address
                if 'ip_address' in data_entry and data_entry['ip_address'] == ip_address:
                    return Response({"success": False, "message": "Cannot provide multiple scores from same user."},
                                    status=status.HTTP_400_BAD_REQUEST)

            if current_instance_id <= no_of_responses:
                event_id = get_event_id()
                created_time = dowell_time("Asia/Calcutta")

                existing_data.update({
                    "event_id":event_id,
                    "dowell_time":created_time,
                    "instance_id": current_instance_id,
                    "channel_instance_id":channel_instance_id
                })
                
                print(existing_data)
                responses =datacube_db_response(api_key=api_key, payload=existing_data, operation="insert")
                response_id = responses['data']['inserted_id']
                
                if user_type == "True":
                    product_url = "https://www.uxlive.me/dowellscale/npslitescale"
                    generated_url = f"{product_url}/?workspace_id={workspace_id}&scale_type={scale_type}&score={item}&channel={channel_name}&instance={channel_instance_id}"
                    return redirect(generated_url)
                else:
                    return Response({
                        "success": responses['success'],
                        "message": "Response recorded successfully",
                        "response_id": response_id,
                        "score": item,
                        "channel":channel_name,
                        "channel_id":channel_no,
                        "instance_id":channel_instance_id,
                        "current_response_no": current_instance_id,
                        "no_of_available_responses": no_of_responses - current_instance_id,
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
    


# https://100035.pythonanywhere.com/addons/create-response/?
# workspace_id=653637a4950d738c6249aa9a
# &username=CustomerSupport
# &scale_id=661faeb62fe858b30556371e
# &user=True
# &scale_type=nps
# &item=0


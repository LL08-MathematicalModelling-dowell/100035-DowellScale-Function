from itertools import chain
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ScaleSerializer, InstanceDetailsSerializer, ChannelInstanceSerializer
from addons.datacube import datacube_data_insertion, datacube_data_retrieval, datacube_data_update, api_key
from addons.utils import generate_urls, adjust_scale_range, scale_type_fn, calcualte_learning_index, determine_category
from .auth import processApikey
from api.utils import dowell_time
from nps.eventID import get_event_id
import json


class ScaleCreateAPI(APIView):
    def post(self, request, format=None): 
        scale_serializer = ScaleSerializer(data=request.data)
        if scale_serializer.is_valid():
            public_api_key = scale_serializer.validated_data['api_key']
            workspace_id = scale_serializer.validated_data['workspace_id']
            username = scale_serializer.validated_data['username']
            scale_name = scale_serializer.validated_data['scale_name']
            scale_type = scale_serializer.validated_data['scale_type']
            user_type = scale_serializer.validated_data['user_type']
            no_of_responses = scale_serializer.validated_data['no_of_responses']
            
            if public_api_key:
                print("api key present")
                try:
                    api_response = processApikey(public_api_key)
                except Exception as e:
                    return Response({"error":"Error Authenticating","details":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


                if api_response["success"] == True:
                    credit_count = api_response["total_credits"]

                    if credit_count >= 0:
                        print("credits sufficient")
                        if not "redirect_url" in request.data:
                            redirect_url = "https://dowellresearch.sg/"
                        else:
                            redirect_url = scale_serializer.validated_data['redirect_url']

                        
                        channel_instance_list = scale_serializer.validated_data['channel_instance_list']
                
                        channel_serializer = ChannelInstanceSerializer(data=channel_instance_list, many=True)
                        if channel_serializer.is_valid():
                            validated_channel_instance_list = channel_serializer.validated_data
                    
                            for channel_instance in validated_channel_instance_list:
                                instance_serializer = InstanceDetailsSerializer(data=channel_instance['instances_details'], many=True)
                                if instance_serializer.is_valid():
                                    validated_instance_details = instance_serializer.validated_data
                                
                            
                        payload = {"settings":{
                                    "scale_type": scale_type,
                                    "channel_instance_list": channel_instance_list
                                    }
                        }
                        settings = payload["settings"]
                        print(settings)
                    
                        if scale_type == "likert":
                            pointers = scale_serializer.validated_data.get('pointers')
                            if pointers is not None:
                                settings['pointers'] = pointers
                            else:
                                return Response("Missing field for likert", status=status.HTTP_400_BAD_REQUEST)

                        if scale_type == "stapel":
                            axis_limit = scale_serializer.validated_data.get('axis_limit')
                            if axis_limit is not None:
                                settings['axis_limit'] = axis_limit
                            else:
                                return Response("Missing field for stapel", status=status.HTTP_400_BAD_REQUEST)
                        
                        total_no_of_items = scale_type_fn(scale_type, payload)
                        settings["total_no_of_items"] = total_no_of_items
                        
                        scale_range = adjust_scale_range(payload)
                        print("Scale range",scale_range)
                        payload["scale_range"] = scale_range

                        event_id = get_event_id()

                        payload = {
                                    "workspace_id": workspace_id,
                                    "settings": {
                                        "scale_name": scale_name,
                                        "username": username,
                                        "scale_category": scale_type,
                                        "user_type": user_type,
                                        "total_no_of_items": total_no_of_items,
                                        "no_of_channels": len(channel_instance_list),
                                        "channel_instance_list":channel_instance_list,
                                        "no_of_responses": no_of_responses,
                                        "allow_resp": True,
                                        "scale_range": list(scale_range),
                                        "redirect_url":redirect_url,
                                        "pointers": pointers if scale_type == "likert" else None,
                                        "axis_limit": axis_limit if scale_type == "stapel" else None,
                                        "event_id": event_id
                            }
                        }
                        
                        try:
                            response = json.loads(datacube_data_insertion(api_key, "livinglab_scales", "collection_3", payload))
                            scale_id = response['data'].get("inserted_id")
                            payload['settings'].update({"scale_id":scale_id})

                            # generate the button urls
                            urls = generate_urls(payload)
                        
                            # insert urls into the db
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
                                "urls": urls,
                                "redirect_to":redirect_url
                            }
                            return Response(response_data, status=status.HTTP_201_CREATED)
                        except Exception as e:
                            print(e)
                            return Response({"message": "Could not process your request. Contact the admin."},status=status.HTTP_400_BAD_REQUEST)
                    else:
                        return Response({"success":False,"message":api_response["message"],"total credits":api_response["total_credits"]},status=status.HTTP_401_UNAUTHORIZED)
                else: 
                    print("Invalid API key")
                    return Response({"success":False,"message":api_response["message"]}, status=status.HTTP_401_UNAUTHORIZED)


            else:
                return Response({"success":False,"message":"Provide a valid API key"}, status=status.HTTP_403_FORBIDDEN)
        return Response(scale_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request):
        try:
            print(request.GET)
            public_api_key = request.GET.get("api_key")
            print("public_api_key", public_api_key)
            print("type", type(public_api_key))
            if public_api_key:
                print("api key present")
                try:
                    api_response = processApikey(public_api_key)
                except Exception as e:
                    return Response({"error":"Error Authenticating","details":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


                if api_response["success"] is True:
                    print("Valid API key")
                    credit_count = api_response["total_credits"]
                    if credit_count >= 0:
                        print("credits sufficient")
                        if 'scale_id' in request.GET:
                            scale_id = request.query_params.get('scale_id')

                            response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scales", "collection_3", {"_id":scale_id}, 10000, 0, False))
                            response = response_data['data'][0]
                        
                            if response:
                                # Extract the relevant information from the response

                                api_response_data = {
                                "scale_id":response["_id"],
                                "scale_name": response["settings"].get("scale_name"),
                                "scale_type":response["settings"].get("scale_category"),
                                "no_of_channels":response["settings"].get("no_of_channels"),
                                "channel_instance_details": response["settings"].get("channel_instance_list")
                                } 

                                return Response(
                                    {"success": True, "message": "settings fetched successfully", "scale_data": api_response_data},
                                    status=status.HTTP_200_OK)
                            else:
                                return Response("Scale not found", status=status.HTTP_404_NOT_FOUND)
                            
                        elif 'workspace_id' and 'username' and "scale_type" in request.GET:
                            workspace_id = request.GET.get('workspace_id')
                            username = request.GET.get('username')
                            scale_type = request.GET.get('scale_type')

                            response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scales", "collection_3", {"workspace_id":workspace_id,"settings.username": username,"settings.scale_category":scale_type}, 10000, 0, False))
                            
                            response = response_data['data']
                            
                            scale_details = [{
                                "scale_id":scale["_id"],
                                "scale_name": scale["settings"].get("scale_name"),
                                "scale_type":scale["settings"].get("scale_category"),
                                "no_of_channels":scale["settings"].get("no_of_channels"),
                                "channel_instance_details": scale["settings"].get("channel_instance_list")
                                } for scale in response]
                            
                            return Response(
                                {"success": True, "message": "settings fetched successfully","total_scales":len(response), "scale_data": scale_details},
                                status=status.HTTP_200_OK)
                    
                        elif 'workspace_id' in request.GET:
                            workspace_id = request.GET.get('workspace_id')

                            response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scales", "collection_3", {"workspace_id":workspace_id}, 10000, 0, False))
                        
                            if response_data['data']:
                                response = response_data['data'][0]
                                print(response)
                                settings = response["settings"]
                                
                                return Response(
                                    {"success": True, "message": "settings fetched successfully", "total":len(response),"scale_data": response_data['data']},
                                    status=status.HTTP_200_OK)
                            else:
                                return Response("No scales found in the requested workspace", status=status.HTTP_404_NOT_FOUND)
                        else:
                            return Response("scale_id or workspace_id required", status=status.HTTP_400_BAD_REQUEST)
                    else:
                        print("insufficient credits")
                        return Response({"success":False,"message":api_response["message"],"total credits":api_response["total_credits"]},status=status.HTTP_401_UNAUTHORIZED)
                else: 
                    print("Invalid API key")
                    return Response({"success":False,"message":api_response["message"]}, status=status.HTTP_401_UNAUTHORIZED)

            else:
                return Response({"success":False,"message":"Provide a valid API key"}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            print(e)
            return Response({"error":"Unexpected error occured while fetching your data","details":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        


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
    public_api_key = request.GET.get('api_key')

    if request.method == "GET":
        if public_api_key:

            print("api key present")
            try:
                print("this block is runnning")
                api_response = processApikey(public_api_key)
                print("api_response",api_response)
            except Exception as e:
                return Response({"error":"Error Authenticating","details":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            if api_response["success"] == True:
                credit_count = api_response["total_credits"]
                if credit_count >= 0:
                    try:
                        # Category determination
                        category = determine_category(scale_type, item)
                        if category is None:
                            return Response({"success": "false", "message": "Invalid value for score"}, status=status.HTTP_400_BAD_REQUEST)

                        # Fetch the relevant settings meta data
                        settings_meta_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scales", "collection_3", {"_id": scale_id}, 10000, 0, False))
                        data = settings_meta_data['data'][0]['settings']

                        no_of_responses = data["no_of_responses"]
                        channel_instance_list = data["channel_instance_list"]
                        redirect_url = data["redirect_url"]

                        for data in channel_instance_list:
                            if channel_name == data["channel_name"]:
                                for instance in data["instances_details"]:
                                    if instance_name == instance["instance_name"]:
                                        channel_display_names = [data["channel_display_name"]]
                                        instance_display_names = [instance["instance_display_name"]]
                                        break

                        if not channel_display_names or not instance_display_names:
                            return Response({"success": "false", "message": "Channel or Instance not found"}, status=status.HTTP_404_NOT_FOUND)

                        # Response submission logic
                        fields = {"scale_id": scale_id, "channel_name": channel_name, "instance_name": instance_name}
                        response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scale_response", "collection_1", fields, 10000, 0, False))

                        current_response_count = len(response_data['data']) + 1 if response_data['data'] else 1

                        if current_response_count <= no_of_responses:
                            event_id = get_event_id()
                            created_time = dowell_time("Asia/Calcutta")

                            learning_index_data = ""
                            if scale_type == 'learning_index':
                                learner_category = {
                                    "reading": 0,
                                    "understanding": 0,
                                    "explaining": 0,
                                    "evaluating": 0,
                                    "applying": 0
                                } if current_response_count == 1 else response_data['data'][-1].get("learning_index_data", {}).get("learning_level_count", {})

                                percentages, LLx, learning_stage, learner_category_cal = calcualte_learning_index(item, current_response_count, learner_category, category)
                                learning_index_data = {
                                    "control_group_size": current_response_count,
                                    "learning_level_count": learner_category_cal,
                                    "learning_level_percentages": percentages,
                                    "learning_level_index": LLx,
                                    "learning_stage": learning_stage
                                }

                            existing_data = {
                                "workspace_id": workspace_id,
                                "username": username,
                                "scale_id": scale_id,
                                "score": item,
                                "category": category,
                                "user_type": user_type,
                                "user_info": header,
                                "event_id": event_id,
                                "dowell_time": created_time,
                                "current_response_count": current_response_count,
                                "channel_name": channel_name,
                                "channel_display_name": channel_display_names[0],
                                "instance_name": instance_name,
                                "instance_display_name": instance_display_names[0],
                                "learning_index_data": learning_index_data
                            }

                            # Insertion into the DB
                            responses = json.loads(datacube_data_insertion(api_key, "livinglab_scale_response", "collection_1", existing_data))
                            response_id = responses['data']['inserted_id']

                            if user_type == "True":
                                product_url = "https://www.uxlive.me/dowellscale/npslitescale"
                                generated_url = f"{product_url}/?workspace_id={workspace_id}&scale_type={scale_type}&score={item}&channel={channel_name}&instance={instance_name}&redirect_to={redirect_url}"
                                return redirect(generated_url)
                            else:
                                return Response({
                                    "success": responses['success'],
                                    "message": "Response recorded successfully",
                                    "response_id": response_id,
                                    "score": item,
                                    "category": category,
                                    "channel": channel_name,
                                    "channel_display_name": channel_display_names[0],
                                    "instance_name": instance_name,
                                    "instance_display_name": instance_display_names[0],
                                    "current_response_no": current_response_count,
                                    "no_of_available_responses": no_of_responses - current_response_count,
                                    "time_stamp": created_time["current_time"]
                                })
                        else:
                            return Response({"success": False, "message": "All instances for this scale have been consumed. Create a new scale to continue"}, status=status.HTTP_200_OK)

                    except Exception as e:
                        print("response", e)
                        return Response({"Resource not found! Contact the admin"}, status=status.HTTP_404_NOT_FOUND)
                else:
                    return Response({"success":False,"message":api_response["message"],"total credits":api_response["total_credits"]},status=status.HTTP_401_UNAUTHORIZED)
            else: 
                print("Invalid API key")
                return Response({"success":False,"message":api_response["message"]}, status=status.HTTP_401_UNAUTHORIZED)

        else:
            return Response({"success":False,"message":"Provide a valid API key"}, status=status.HTTP_403_FORBIDDEN)

      
    else:
        return Response("Method not allowed")

    

@api_view(['GET'])
def get_scale_response(request):

    scale_id = request.GET.get('scale_id')
    channel = request.GET.get('channel')
    instance = request.GET.get('instance')
    public_api_key = request.GET.get('api_key')

    if request.method == "GET":
        if public_api_key:
            print("api key present")
            try:
                print("this block is runnning")
                api_response = processApikey(public_api_key)
                print("api_response",api_response)
            except Exception as e:
                return Response({"error":"Error Authenticating","details":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            if api_response["success"] == True:
                credit_count = api_response["total_credits"]
                if credit_count >= 0:
                    try:
                        fields = {"scale_id":scale_id}
                        response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scale_response", "collection_1", fields, 10000, 0, False))
                        data = response_data['data']

                        if 'channel' and 'instance' in request.GET:
                            matching_instance_list = [response for response in data if response["channel_name"] == channel and response["instance_name"] == instance]
                            print(matching_instance_list)
                            no_of_responses = len(matching_instance_list)
                            if no_of_responses == 0:
                                return Response({"success":"true",
                                                "message":"No responses found",
                                                "total_no_of_responses": no_of_responses
                                                }, status=status.HTTP_404_NOT_FOUND)
                            else:
                                return Response({"success":"true",
                                                "message":"fetched the data for the requested channel & instance",
                                                "total_no_of_responses": len(matching_instance_list),
                                                "data":matching_instance_list
                                                }, status=status.HTTP_200_OK)

                        elif 'channel' in request.GET:

                            matching_instance_list = [response for response in data if response["channel_name"] == channel]
                            print(matching_instance_list)
                            no_of_responses = len(matching_instance_list)
                            if no_of_responses == 0:
                                return Response({"success":"true",
                                                "message":"No responses found",
                                                "total_no_of_responses": no_of_responses
                                                }, status=status.HTTP_404_NOT_FOUND)
                            else:

                                return Response({"success":"true",
                                                "message":"fetched the data for the requested channel",
                                                "total_no_of_responses": len(matching_instance_list),
                                                "data":matching_instance_list
                                                }, status=status.HTTP_200_OK)

                        elif 'instance' in request.GET:
                            matching_instance_list = [response for response in data if response["instance_name"] == instance]
                            print(matching_instance_list)
                            no_of_responses = len(matching_instance_list)
                            if no_of_responses == 0:
                                return Response({"success":"true",
                                                "message":"No responses found",
                                                "total_no_of_responses": no_of_responses
                                                }, status=status.HTTP_404_NOT_FOUND)
                            else:

                                return Response({"success":"true",
                                                "message":"fetched the data for the requested instance",
                                                "total_no_of_responses": len(matching_instance_list),
                                                "data":matching_instance_list
                                                }, status=status.HTTP_200_OK)

                        else:
                            return Response({"success":"true",
                                            "message":"fetched the data for the requested scale",
                                            "total_no_of_responses": len(data),
                                            "data":data
                                            }, status=status.HTTP_200_OK)

                    except Exception as e:
                        return Response(e)
                else:
                    return Response({"success":False,"message":api_response["message"],"total credits":api_response["total_credits"]},status=status.HTTP_401_UNAUTHORIZED)
            else: 
                print("Invalid API key")
                return Response({"success":False,"message":api_response["message"]}, status=status.HTTP_401_UNAUTHORIZED)

        else:
            return Response({"success":False,"message":"Provide a valid API key"}, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response("Method not allowed")

 


# @api_view(['GET'])
# def learning_index_report(request):
   
#     scale_id = request.GET.get('scale_id')

#     if request.method == "GET":
#         try:
#             fields = {"scale_id":scale_id}
#             response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scale_response", "collection_1", fields, 10000, 0, False))
#             data = response_data['data']
#             print(data)
            
#             results =[{
#                     "response_id":data["_id"],
#                     "score":data["score"],
#                      "category":data["category"],
#                      "channel":data["channel_name"],
#                      "instance":data["instance_name"],
#                      "learning_index_data": data["learning_index_data"],
#                      "date_created":data.get("dowell_time", {}).get("current_time")
#                     } for data in data]
#             return Response({"success":"true",
#                              "message":"fetched the data",
#                              "data":results
#                              }, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response(e)
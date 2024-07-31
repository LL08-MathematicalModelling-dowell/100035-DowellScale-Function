from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import redirect
from rest_framework import status
from .eventID import get_event_id
from .serializers import ScaleSerializer, InstanceDetailsSerializer, ChannelInstanceSerializer, ScaleReportRequestSerializer
from .datacube import datacube_data_insertion, datacube_data_retrieval, datacube_data_update, api_key
from .utils import  generate_urls, adjust_scale_range, scale_type_fn, calcualte_learning_index, determine_category, dowell_time, get_date_range
import json


# Create your views here.
class ScaleCreateAPI(APIView):
    def post(self, request, format=None): 
        scale_serializer = ScaleSerializer(data=request.data)
        if scale_serializer.is_valid():
            workspace_id = scale_serializer.validated_data['workspace_id']
            username = scale_serializer.validated_data['username']
            scale_name = scale_serializer.validated_data['scale_name']
            scale_type = scale_serializer.validated_data['scale_type']
            user_type = scale_serializer.validated_data['user_type']
            no_of_responses = scale_serializer.validated_data['no_of_responses']
            
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
        return Response(scale_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request):
        try:
            print(request.GET)
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

        except Exception as e:
            print(e)
            return Response(f"Unexpected error occured while fetching your data", status=status.HTTP_400_BAD_REQUEST)
        


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
        return Response("Method not allowed")



@api_view(['GET'])
def get_scale_response(request):

    scale_id = request.GET.get('scale_id')
    channel = request.GET.get('channel')
    instance = request.GET.get('instance')

    if request.method == "GET":
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
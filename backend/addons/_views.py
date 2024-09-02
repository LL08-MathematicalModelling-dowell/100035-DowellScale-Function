from itertools import chain
import math
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ._serializers import ScaleSerializer, InstanceDetailsSerializer, ChannelInstanceSerializer, ScaleReportSerializer
from .services.datacube import datacube_data_insertion, datacube_data_retrieval, datacube_data_update, api_key
from .services.dowellclock import dowell_time
from .utils.helper import generate_urls, adjust_scale_range, scale_type_fn, calcualte_learning_index, determine_category, get_date_range
from nps.eventID import get_event_id
import json
from collections import defaultdict
from datetime import datetime


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
            
            # if not "redirect_url" in request.data:
            #     redirect_url = "https://dowellresearch.sg/"
            # else:
            #     redirect_url = scale_serializer.validated_data['redirect_url']

            
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
                            # "redirect_url":redirect_url,
                            "pointers": pointers if scale_type == "likert" else None,
                            "axis_limit": axis_limit if scale_type == "stapel" else None,
                            "event_id": event_id
                }
            }
            
            try:
                response = json.loads(datacube_data_insertion(api_key=api_key,database_name= "livinglab_scales",collection_name= "collection_3",data= payload))
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
                    # "redirect_to":redirect_url
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(e)
                return Response({"message": "Could not process your request. Contact the admin."},status=status.HTTP_400_BAD_REQUEST)
        return Response(scale_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request):
        try:
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
                    "channel_instance_details": response["settings"].get("channel_instance_list"),
                    "urls":response["urls"]
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
                    "channel_instance_details": scale["settings"].get("channel_instance_list"),
                    "urls":scale["urls"]
                    } for scale in response]
                
                return Response(
                    {"success": True, "message": "settings fetched successfully","total_scales":len(response), "scale_data": scale_details},
                    status=status.HTTP_200_OK)
        
            elif 'workspace_id' in request.GET:
                workspace_id = request.GET.get('workspace_id')

                response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scales", "collection_3", {"workspace_id":workspace_id}, 10000, 0, False))
            
                if response_data['data']:
                    response = response_data['data'][0]
                    
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


    try:
        # Category determination
        if scale_type == "nps_lite" or scale_type == "nps" or scale_type =="learning_index":
            category = determine_category(scale_type, item)
            if category is None:
                return Response({"success": "false", "message": "Invalid value for score"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            category = None

        # Fetch the relevant settings meta data
        settings_meta_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scales", "collection_3", {"_id": scale_id}, 10000, 0, False))
        data = settings_meta_data['data'][0]['settings']

        no_of_responses = data["no_of_responses"]
        channel_instance_list = data["channel_instance_list"]
        # redirect_url = data["redirect_url"]

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
                # generated_url = f"{product_url}/?workspace_id={workspace_id}&scale_type={scale_type}&score={item}&channel={channel_name}&instance={instance_name}&redirect_to={redirect_url}"
                generated_url = f"{product_url}/?workspace_id={workspace_id}&scale_type={scale_type}&score={item}&channel={channel_name}&instance={instance_name}"
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


@api_view(['GET'])
def learning_index_report(request):
   
    scale_id = request.GET.get('scale_id')

    if request.method == "GET":
        try:
            fields = {"scale_id":scale_id}
            response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scale_response", "collection_1", fields, 10000, 0, False))
            data = response_data['data']
            
            results =[{
                    "response_id":data["_id"],
                    "score":data["score"],
                     "category":data["category"],
                     "channel":data["channel_name"],
                     "instance":data["instance_name"],
                     "learning_index_data": data["learning_index_data"],
                     "date_created":data.get("dowell_time", {}).get("current_time")
                    } for data in data]
            return Response({"success":"true",
                             "message":"fetched the data",
                             "data":results
                             }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(e)


class ScaleReport(APIView):
    def post(self, request):
        scale_type = request.GET.get('scale_type')

        if scale_type == 'nps':
            return self.get_nps_report(request)
        elif scale_type == 'likert':
            return self.get_likert_report(request)
        elif scale_type == 'stapel':
            return self.get_stapel_report(request)
        elif scale_type == 'nps_lite':
            return self.get_nps_lite_report(request)
        else:
            return self.handle_errors(request)
        
    # NPS scale report
    def get_nps_report(self, request):
        serializer = ScaleReportSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({
                "success": False, 
                "message": "Posting invalid data",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            scale_id = serializer.validated_data['scale_id']
            # workspace_id = serializer.validated_data['workspace_id']
            channel_names = serializer.validated_data['channel_names']
            instance_names = serializer.validated_data['instance_names']
            period = serializer.validated_data['period']
            start_date, end_date = get_date_range(period)
            
            filters = {
                "scale_id": scale_id,
                "dowell_time.current_time": {"$gte": start_date, "$lte": end_date}
            }
            if "all" not in channel_names:
                filters["channel_name"] = {"$in": channel_names}
            if "all" not in instance_names:
                filters["instance_name"] = {"$in": instance_names}

            responses = json.loads(datacube_data_retrieval(api_key, 'livinglab_scale_response', 'collection_1', filters, 10000, 0, False))
            if not responses['data']:
                return Response({"success": False, "message": "No data found"}, status=status.HTTP_404_NOT_FOUND)

            daily_counts = defaultdict(lambda: {"promoter": 0, "detractor": 0, "passive": 0, "nps": 0})

            for response in responses['data']:
                response_date = datetime.strptime(response['dowell_time']['current_time'], "%Y-%m-%d %H:%M:%S").date()
                daily_counts[response_date][response["category"]] += 1
            
            for date, counts in daily_counts.items():
                total_responses = counts["promoter"] + counts["detractor"] + counts["passive"]
                if total_responses > 0:
                    counts["nps"] = (counts["promoter"] - counts["detractor"]) / total_responses * 100
                else:
                    counts["nps"] = 0 
            
            daily_counts = {str(date): counts for date, counts in daily_counts.items()}

            score_list = [response['score'] for response in responses['data']]
            category_dict = {key: sum(counts[key] for counts in daily_counts.values()) for key in ["promoter", "detractor", "passive"]}
            percentage_category_distribution = {key: value / len(score_list) * 100 for key, value in category_dict.items()}
            nps = percentage_category_distribution["promoter"] - percentage_category_distribution["detractor"]
            total_score = sum(score_list)
            max_score = len(score_list) * 10
            
            return Response({
                "success": True, 
                "message": f"Fetched {period} NPS data successfully",
                "report": {
                    "no_of_responses": len(score_list),
                    "total_score": f"{total_score} / {max_score}",
                    "nps": nps,
                    "nps_category_distribution": percentage_category_distribution,
                    "daily_counts": daily_counts
                }
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"Error in get_nps_report: {e}")
            return Response({
                "success": False,
                "message": "An error occurred while processing the NPS report.",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Likert scale report
    def get_likert_report(self, request):
        serializer = ScaleReportSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({
                "success": False, 
                "message": "Posting invalid data",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            scale_id = serializer.validated_data['scale_id']
            channel_names = serializer.validated_data['channel_names']
            instance_names = serializer.validated_data['instance_names']
            period = serializer.validated_data['period']
            start_date, end_date = get_date_range(period)
            
            filters = {
                "scale_id": scale_id,
                "dowell_time.current_time": {"$gte": start_date, "$lte": end_date}
            }
            if "all" not in channel_names:
                filters["channel_name"] = {"$in": channel_names}
            if "all" not in instance_names:
                filters["instance_name"] = {"$in": instance_names}

            responses = json.loads(datacube_data_retrieval(api_key, 'livinglab_scale_response', 'collection_1', filters, 10000, 0, False))
            if not responses['data']:
                return Response({"success": False, "message": "No data found"}, status=status.HTTP_404_NOT_FOUND)
            
            score_list = [response['score'] for response in responses['data']]
            pointers = 5  # Max score value
            
            # Initialize daily_counts to track count of each score (1 to 5) per day
            daily_counts = defaultdict(lambda: {score: 0 for score in range(1, 6)})
            score_distribution = defaultdict(int)  # To track count of each score (1 to 5) overall

            for response in responses['data']:
                response_date = str(datetime.strptime(response['dowell_time']['current_time'], "%Y-%m-%d %H:%M:%S").date())
                score = response['score']
                daily_counts[response_date][score] += 1
                score_distribution[score] += 1

            # Calculate the total and average score
            total_score = sum(score_list)
            average_score = total_score / len(score_list) if score_list else 0

            # Initialize percentage_distribution with all scores from 1 to 5 set to 0%
            total_responses = len(score_list)
            percentage_distribution = {score: 0 for score in range(1, 6)}
            max_score = pointers * total_responses
            
            # Update percentage for scores found in the responses
            for score, count in score_distribution.items():
                percentage_distribution[score] = (count / total_responses) * 100

            return Response({
                "success": True,
                "message": f"Fetched {period} Likert data successfully",
                "report": {
                    "no_of_responses": total_responses,
                    "total_score": f"{total_score} / {max_score}" ,  # Include total score in the report
                    "average_score": average_score,  # Include average score in the report
                    "score_list": score_list,
                    "pointers": pointers,
                    "daily_counts": daily_counts,  # Include daily count for each score
                    "overall_score_distribution": percentage_distribution  # Include percentage distribution in the report
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error in get_likert_report: {e}")
            return Response({
                "success": False,
                "message": "An error occurred while processing the Likert report.",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


            

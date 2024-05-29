from itertools import chain
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ._serializers import ScaleSerializer, InstanceDetailsSerializer, ChannelInstanceSerializer
from dowellnps_scale_function.settings import public_url
from .datacube import datacube_data_insertion, datacube_data_retrieval, datacube_data_update, api_key
from api.utils import dowell_time
from nps.eventID import get_event_id
import json


class ScaleCreateAPI(APIView):

    def build_urls(self, channel_instance,payload,instance_idx):
        urls = []
        print(payload)
        settings = payload["settings"]
        scale_range = settings["scale_range"]
        
        for idx in scale_range:
            # url = f"{public_url}/addons/create-response/v3/?user={payload['user_type']}&scale_type={payload['scale_category']}&channel={channel_instance['channel_name']}&instance={channel_instance['instances_details'][instance_idx]['instance_name']}&workspace_id={payload['workspace_id']}&username={payload['username']}&scale_id={payload['scale_id']}&item={idx}"
            url = f"http://127.0.0.1:8000/addons/create-response/v3/?user={settings['user_type']}&scale_type={settings['scale_category']}&channel={channel_instance['channel_name']}&instance={channel_instance['instances_details'][instance_idx]['instance_name']}&workspace_id={payload['workspace_id']}&username={settings['username']}&scale_id={settings['scale_id']}&item={idx}"
            urls.append(url)
        return urls

    def generate_urls(self, payload):
        response = []
        settings = payload["settings"]
        for channel_instance in settings["channel_instance_list"]:
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
        settings = payload["settings"]
        scale_type = settings['scale_type']
        print(f"Scale type: {scale_type}")
        
        total_no_of_items = int(settings['total_no_of_items'])
        print(f"Total number of items: {total_no_of_items}")
        print("++++++++++++++")
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
        print("inside scale type")
        print(payload)
        settings = payload["settings"]
        
        if scale_type == "nps":
            no_of_items = 11
        elif scale_type == "nps lite":
            no_of_items = 3
        elif scale_type == "likert":
            pointers = settings['pointers']
            no_of_items = pointers
        elif scale_type == "stapel":
            axis_limit = settings["axis_limit"]
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
            print("???????????????",payload)
            total_no_of_items = self.scale_type(scale_type, payload)
            settings["total_no_of_items"] = total_no_of_items
            print("???????????????",payload)
           
            scale_range = self.adjust_scale_range(payload)
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
                urls = self.generate_urls(payload)
               
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
                    "urls": urls
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
                settings = response["settings"]
            
                if response:
                    # Extract the relevant information from the response
                    scale_name = settings.get('scale_name')
                    scale_type = settings.get('scale_category')
                    total_no_of_items = settings.get('total_no_of_items')
                    urls = response.get('urls')

                    api_response_data = {
                        "scale_id": scale_id,
                        "scale_name": scale_name,
                        "scale_type": scale_type,
                        "total_no_of_buttons": total_no_of_items,
                        "urls": urls
                    }

                    return Response(
                        {"success": True, "message": "settings fetched successfully", "scale_data": api_response_data},
                        status=status.HTTP_200_OK)
                else:
                    return Response("Scale not found", status=status.HTTP_404_NOT_FOUND)
                
            elif 'workspace_id' in request.GET:
                workspace_id = request.GET.get('workspace_id')

                response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scales", "collection_3", {"workspace_id":workspace_id}, 10000, 0, False))
            
                if response_data['data']:
                    response = response_data['data'][0]
                    print(response)
                    settings = response["settings"]
                    return Response(
                        {"success": True, "message": "settings fetched successfully", "scale_data": response_data['data']},
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

def calcualte_learning_index(score, group_size):
    print(score,group_size)

    learner_category = {
                         "reading":0,
                         "understanding":0,
                         "explaining":0,
                         "evaluating":0,
                         "applying":0
                }
            
    score_ranges = {
                    (0, 2): "reading",
                    (3, 4): "understanding",
                    (5, 6): "explaining",
                    (7, 8): "evaluating",
                    (9, 10): "applying"
                }

    # Determine the learner category for the given score
    for range_tuple, category in score_ranges.items():
        if range_tuple[0] <= score <= range_tuple[1]:
            learner_category[category] += 1
            break

    # Calculate percentages
    percentages = {key: (value / group_size) * 100 for key, value in learner_category.items()}

    # Calculate LLx while avoiding division by zero
    denominator = percentages["reading"] + percentages["understanding"]
    if denominator == 0:
        LL_percent = (percentages["evaluating"] + percentages["applying"]) 
    else:
        LL_percent = (percentages["evaluating"] + percentages["applying"]) / denominator
    
    LLx = LL_percent / 100

    if 0 <= LLx <=1:
        learning_stage = "learning"
    else:
        learning_stage = "applying in context" 

    return learner_category, percentages, LLx, learning_stage



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
            if scale_type == "nps_lite":
                if item == 0:
                        category = "detractor"
                elif item == 1:
                    category = "passive"
                elif item == 2:
                    category = "promoter"
                else:
                    return Response({"success":"false",
                                    "message":"Invalid value for score"},
                                    status=status.HTTP_400_BAD_REQUEST)
    
            elif scale_type == "nps":
                if 0 <= item <=6:
                    category = "detractor"
                elif 7 <= item <=8:
                    category = "passive"
                elif 9 <= item <=10:
                    category = "promoter"

                else:
                    return Response({"success":"false",
                                    "message":"Invalid value for score"},
                                    status=status.HTTP_400_BAD_REQUEST)
                
            else:
                category = "N/A"
        
            existing_data = {
                "workspace_id":workspace_id,
                "username":username,
                "scale_id":scale_id,
                "score": item,
                "category":category,
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
            print(current_response_count)

            if current_response_count <= no_of_responses:
                event_id = get_event_id()
                created_time = dowell_time("Asia/Calcutta")

                learner_catergory, percentages, LLx, learning_stage = calcualte_learning_index(item,current_response_count)
                print("ho gaya")

                learning_index_data = {
                                    "control_group_size":current_response_count,
                                    "learning_level_count":learner_catergory,
                                    "learning_level_percentages":percentages,
                                    "learning_level_index":LLx,
                                    "learning_stage":learning_stage
                                    }

                existing_data.update({
                    "event_id":event_id,
                    "dowell_time":created_time,
                    "current_response_count": current_response_count,
                    "channel_name":channel_name,
                    "instance_name":instance_name,
                    "learning_index_data":learning_index_data
                })
                
                
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
                        "category":category,
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
    

    
    
@api_view(['GET'])
def get_scale_response(request):
   
    scale_id = request.GET.get('scale_id')

    if request.method == "GET":
        try:
            fields = {"scale_id":scale_id}
            response_data = json.loads(datacube_data_retrieval(api_key, "livinglab_scale_response", "collection_1", fields, 10000, 0, False))
            data = response_data['data']
            
            return Response({"success":"true",
                             "message":"fetched the data",
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
            print(data)
            
            results =[{
                    "response_id":data["_id"],
                    "score":data["score"],
                     "category":data["category"],
                     "learning_index_data": data["learning_index_data"],
                     "date_created":data.get("dowell_time", {}).get("current_time")
                    } for data in data]
            return Response({"success":"true",
                             "message":"fetched the data",
                             "data":results
                             }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(e)
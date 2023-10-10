import json
from nps.dowellconnection import dowellconnection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import datetime
from nps.eventID import get_event_id
from collections import Counter
from .utils import generate_pairs, arrange_ranking, segment_ranking, find_inconsistent_pair
from django.core.files.storage import default_storage
import uuid
import os


@api_view(['POST', 'GET', 'PUT'])
def settings_api_view_create(request):
    if request.method == 'POST':
        response = dict(request.data)
        username = response.get('username')
        images_dict = request.FILES
        if username == None:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            name = response['scale_name'][0]
            orientation = response['orientation'][0]
            scalecolor = response['scalecolor'][0]
            fontcolor = response['fontcolor'][0]
            roundcolor = response['roundcolor'][0]
            fontstyle = response['fontstyle'][0]
            time = response['time'][0]
            item_list = response['item_list']
            item_count = int(response["item_count"][0])
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or misspelt"}, status=status.HTTP_400_BAD_REQUEST)
        if images_dict != {}:
            image_names = images_dict.keys()
            if list(image_names) != item_list:
                return Response({"error": "Images name must match Item List"}, status=status.HTTP_400_BAD_REQUEST)
            for file in images_dict.values():
                _, type = str(file).split(".")
                if type != "jpg" and type != "png":
                    return Response({"error": "Only image files allowed"}, status=status.HTTP_400_BAD_REQUEST)
        if "user" in response:
            user = response["user"]
        else:
            user = True   
        if item_count != len(item_list):
            return Response({"error": "item count does not match length of item list"}, status=status.HTTP_400_BAD_REQUEST)
        if item_count < 2:
            return Response({"error": "2 or more items needed for paired comparison scale."}, status=status.HTTP_400_BAD_REQUEST)
        paired_items = []
        if item_count > 2:
            paired_items = generate_pairs(item_count, item_list)
        if item_count == 2:
            paired_items.append(item_list)
        total_pairs = len(paired_items)
        expected_pairs_count = (item_count * (item_count-1))/2
        if expected_pairs_count != total_pairs:
            return Response({"error": "Total number of pairs is not equal to expected number of pairs"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        eventID = get_event_id()
        image_paths = {}
        for image_name in images_dict.keys():
            _, type = str(images_dict[image_name]).split(".")
            path = default_storage.save(str(images_dict[image_name]), images_dict[image_name])
            image_paths[image_name] = path
        field_add = {
            "event_id": eventID,
            "settings" : {"orientation": orientation,
                            "scalecolor": scalecolor,
                            "fontcolor": fontcolor,
                            "roundcolor": roundcolor,
                            "fontstyle": fontstyle,
                            "time": time,
                            "paired_items": paired_items,
                            "item_list": item_list,
                            "total_items": item_count,
                            "total_pairs": total_pairs,
                            "username": username,
                            "user" : user,
                            "name": name,
                            "image_paths": image_paths,
                            "scale-category": "paired-comparison scale",
                             "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                             }
        }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                                 field_add, "nil")

        user_json = json.loads(x)
        scale_id = user_json['inserted_id']
        details = {"scale_id": scale_id, "event_id": eventID, "username": user}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                        "ABCDE",
                                        "insert", details, "nil")
        return Response({"success": x, "data": field_add})  
    elif request.method == 'GET':
        try:
            params = request.GET
            scale_id = params.get("scale_id")
            if not scale_id:
                field_add = {"settings.scale-category": "paired-comparison scale"}
                response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                                 "ABCDE", "fetch", field_add, "nil")
                return Response({"data": json.loads(response_data)}, status=status.HTTP_200_OK)

            field_add = {"_id": scale_id, "settings.scale-category": "paired-comparison scale"}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "find", field_add, "nil")
            settings_json = json.loads(x)
            if not settings_json.get('data'):
                return Response({"error": "scale not found"}, status=status.HTTP_404_NOT_FOUND)
            settings = settings_json['data']['settings']
            return Response({"success": settings})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "PUT":
        try:
            response = dict(request.data)
            images_dict = request.FILES
            if "scale_id" not in response:
                return Response({"error": "scale_id missing or mispelt"}, status=status.HTTP_400_BAD_REQUEST)
            if "item_list" in response or "item_count" in response:
                item_list = response.get('item_list')
                item_count = response.get('item_count')
                if (item_list == None) or (item_count == None):
                    return Response({"error": "item_list and item_count have to be updated together"}, status=status.HTTP_400_BAD_REQUEST)
                item_count, item_list = item_count[0], item_list[0]
                if item_count != len(item_list):
                    return Response({"error": "item count does not match length of item list"}, status=status.HTTP_400_BAD_REQUEST)
                if item_count < 2:
                    return Response({"error": "2 or more items needed for paired comparison scale."}, status=status.HTTP_400_BAD_REQUEST)
                paired_items = []
                if item_count > 2:
                    paired_items = generate_pairs(item_count, item_list)
                if item_count == 2:
                    paired_items.append(item_list)
                total_pairs = len(paired_items)
                expected_pairs_count = (item_count * (item_count-1))/2
                if expected_pairs_count != total_pairs:
                    return Response({"error": "Total number of pairs is not equal to expected number of pairs"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            id = response['scale_id'][0]
            field_add = {"_id": id, }
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                "fetch", field_add, "nil")
            settings_json = json.loads(x)
            settings = settings_json['data'][0]['settings']
            for key in settings.keys():
                if key in response:
                    settings[key] = response[key][0]
            if "item_list" in response:
                settings["paired_items"] = paired_items
                settings["total_items"] = item_count
                settings["total_pairs"] = total_pairs
            settings["scale-category"] = "paired-comparison scale"
            settings["date_updated"] = datetime.datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S")
            if images_dict != {}:
                for file in images_dict.values():
                    _, type = str(file).split(".")
                    if type != "jpg" and type != "png":
                        return Response({"error": "Only image files allowed"}, status=status.HTTP_400_BAD_REQUEST)
                image_names = images_dict.keys()
                for image in list(image_names):
                    if image not in settings["item_list"]:
                        return Response({"error": "Images name must be in Item List"}, status=status.HTTP_400_BAD_REQUEST)
            image_paths = settings["image_paths"]
            unique_path = uuid.uuid4()
            for image_name in images_dict.keys():
                if image_name in image_paths:
                    filename = image_paths[image_name]
                    try:
                        os.remove(f"static/images/{filename}")
                    except:
                        pass
                _, type = str(images_dict[image_name]).split(".")
                path = default_storage.save(f"{unique_path}.{type}", images_dict[image_name])
                image_paths[image_name] = path
            settings["image_paths"] = image_paths
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                 field_add, settings)
            return Response({"success": "Successfully Updated ", "data": settings})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST', 'GET'])
def submit_response_view(request):
    if request.method == "POST":
        try:
            response_data = request.data
            try:
                username = response_data['username']
                scale_id = response_data['scale_id']
                brand_name = response_data['brand_name']
                product_name = response_data['product_name']
            except KeyError as e:
                return Response({"error": f"Missing required parameter {e}"}, status=status.HTTP_400_BAD_REQUEST)
            # Check if user is authorized to submit response
            user = dowellconnection("dowellscale", "bangalore", "dowellscale", "users",
                                    "users", "1098", "ABCDE", "fetch", {"username": username}, "nil")
            if not user:
                return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

            # Check if scale exists
            scale = dowellconnection("dowellscale", "bangalore", "dowellscale",
                                     "scale", "scale", "1093", "ABCDE", "fetch", {"_id": scale_id}, "nil")
            if not scale:
                return Response({"error": "Scale not found."}, status=status.HTTP_404_NOT_FOUND)

            # Check if scale is of type "paired-comparison scale"
            scale_settings = json.loads(scale)
            if scale_settings['data'][0]['settings'].get('scale-category') != 'paired-comparison scale':
                return Response({"error": "Invalid scale type."}, status=status.HTTP_400_BAD_REQUEST)
            
            field_add = {"username": username, "scale_data.scale_id": scale_id}
            previous_response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094", "ABCDE", "fetch",
                                    field_add, "nil")
            previous_response = json.loads(previous_response)
            previous_response = previous_response.get('data')            
            if len(previous_response) > 0 :
                return Response({"error": "You have already submitted a response for this scale."}, status=status.HTTP_400_BAD_REQUEST)
            process_id = response_data['process_id']
            if not isinstance(process_id, str):
                return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)
            
            if "document_responses" in response_data:
                document_responses = response_data["document_responses"]
                all_results = []
                for single_response in document_responses:
                    products_ranking = single_response["products_ranking"]
                    document_data = {"details": {"action": response_data.get('action', ""), "authorized": response_data.get('authorized',""), "cluster": response_data.get('cluster', ""), "collection": response_data.get('collection',""), "command": response_data.get('command',""), "database": response_data.get('database', ""), "document": response_data.get('document', ""), "document_flag":response_data.get('document_flag',""), "document_right": response_data.get('document_right', ""), "field": response_data.get('field',""), "flag": response_data.get('flag', ""), "function_ID": response_data.get('function_ID', ""),"metadata_id": response_data.get('metadata_id', ""), "process_id": response_data['process_id'], "role": response_data.get('role', ""), "team_member_ID": response_data.get('team_member_ID', ""), "update_field": {"content": response_data.get('content', ""), "document_name": response_data.get('document_name', ""), "page": response_data.get('page', "")}, "user_type": response_data.get('user_type', ""), "id": response_data['_id']}, "product_name": response_data.get('product_name', "")}
                    success = response_submit_loop(scale_settings, username, scale_id, products_ranking, brand_name, product_name, process_id, document_data)
                    all_results.append(success.data)
                return Response({"data": all_results}, status=status.HTTP_200_OK)
            else:
                products_ranking = response_data["products_ranking"]
                return response_submit_loop(scale_settings, username, scale_id, products_ranking, brand_name, product_name, process_id)
        except Exception as e:
            print(f"error: {e}")
            return Response({"Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
def response_submit_loop(scale_settings, username, scale_id, products_ranking, brand_name, product_name, process_id=None, document_data=None):
    if len(products_ranking) != scale_settings["data"][0]["settings"]["total_pairs"]:
        return Response({"error": "Scale Responses incomplete"}, status=status.HTTP_400_BAD_REQUEST)
    event_id = get_event_id()
    item_list = scale_settings["data"][0]["settings"]["item_list"]
    paired_items = scale_settings["data"][0]["settings"]["paired_items"]
    for i in range(len(paired_items)):
        if products_ranking[i] not in paired_items[i]:
            return Response({"error": f"Product selected in position {i} is not in the pair"}, status=status.HTTP_400_BAD_REQUEST)
    arranged_ranking = arrange_ranking(paired_items, products_ranking)
    segmented_ranking = segment_ranking(arranged_ranking)
    is_consistent = find_inconsistent_pair(segmented_ranking, item_list)
    if is_consistent  != True:
        return Response({
                "error": "Scale Responses inconsistent",
                "segmented_ranking": segmented_ranking,
                "location_faulty_pair": is_consistent
            }, status=status.HTTP_400_BAD_REQUEST)
    scores_map = Counter(products_ranking)
    for product in item_list:
        if product not in scores_map:
            scores_map[product] = 0 
    scores_map = sorted(scores_map.items(), key=lambda x:x[1], reverse=True)
    scores_map = dict(scores_map)
    ranking = list(scores_map.keys())
    ranking_dict = {}
    for product in products_ranking:
        ranking_dict[f"pair_{len(ranking_dict)+1}"] = product
    # Insert new response into database
    response = {
        "event_id": event_id,
        "username": username,
        "scale_data": {"scale_id": scale_id, "scale_type": "paired-comparison scale"},
        "brand_data": {"brand_name": brand_name, "product_name": product_name},
        "ranking": ranking,
        "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    if process_id:
        response["process_id"] = process_id
    if document_data:
        response["document_data"] = document_data

    response_id = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094", "ABCDE", "insert", response, "nil")
    response_id = json.loads(response_id)
    return Response({
        "success": True, 
        "data": {
            "event_id": event_id,
            "response_id": response_id["inserted_id"],
            "product_ranking": ranking_dict,
        }})

# GET SINGLE SCALE RESPONSE
@api_view(['GET',])
def single_scale_response_api_view(request, id=None):
    try:
        field_add = {"_id": id}
        scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094", "ABCDE", "fetch",
                                 field_add, "nil")
        scale_data = json.loads(scale)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        settings = scale_data['data']
        if len(settings) > 0:
            return Response({"payload": settings[0]})
        return Response({"error": "Response not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', ])
def scale_response_api_view(request):
    try:
        field_add = {"scale_data.scale_type": "paired-comparison scale", }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                             "1094", "ABCDE", "fetch", field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response(json.loads(x))

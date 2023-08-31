import json
from nps.dowellconnection import dowellconnection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import datetime
from nps.eventID import get_event_id
from collections import Counter
from .utils import generate_pairs, arrange_ranking, segment_ranking, find_inconsistent_pair

@api_view(['POST', 'GET', 'PUT'])
def settings_api_view_create(request):
    if request.method == 'POST':
        response = request.data
        username = response.get('username')
        if username == None:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            name = response['scale_name']
            orientation = response['orientation']
            scalecolor = response['scalecolor']
            fontcolor = response['fontcolor']
            fontstyle = response['fontstyle']
            time = response['time']
            item_list = response['item list']
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or misspelt"}, status=status.HTTP_400_BAD_REQUEST)
        if "user" in response:
            user = response["user"]
        else:
            user = True        
        item_count = len(item_list)
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
        field_add = {
            "event_id": eventID,
            "settings" : {"orientation": orientation,
                            "scalecolor": scalecolor,
                            "fontcolor": fontcolor,
                            "fontstyle": fontstyle,
                            "time": time,
                            "paired_items": paired_items,
                            "item_list": item_list,
                            "total_items": item_count,
                            "total_pairs": total_pairs,
                            "username": username,
                            "user" : user,
                            "name": name,
                            "scale-category": "paired-comparison scale",
                             "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                             }
        }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                                 field_add, "nil")

        user_json = json.loads(x)
        details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                        "ABCDE",
                                        "insert", details, "nil")
        return Response({"success": x, "data": field_add})  
    elif request.method == 'GET':
        try:
            response = request.data
            scale_id = response.get('scale_id')
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
            response = request.data
            if "scale_id" not in response:
                return Response({"error": "scale_id missing or mispelt"}, status=status.HTTP_400_BAD_REQUEST)
            if "item_list" in response:
                item_list = response['item_list']
                item_count = len(item_list)
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
            id = response['scale_id']
            field_add = {"_id": id, }
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                "fetch", field_add, "nil")
            settings_json = json.loads(x)
            settings = settings_json['data'][0]['settings']
            for key in settings.keys():
                if key in response:
                    settings[key] = response[key]
            if "item_list" in response:
                settings["paired_items"] = paired_items
                settings["total_items"] = item_count
                settings["total_pairs"] = total_pairs
            settings["scale-category"] = "paired-comparison scale"
            settings["date_updated"] = datetime.datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S")
            update_field = {"settings": settings}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                 field_add, update_field)
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
            
            field_add = {"username": username, "scale_id": scale_id}
            previous_response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094", "ABCDE", "fetch",
                                    field_add, "nil")
            previous_response = json.loads(previous_response)
            previous_response = previous_response.get('data')            
            if len(previous_response) > 0 :
                return Response({"error": "You have already submitted a response for this scale."}, status=status.HTTP_400_BAD_REQUEST)
            
            if "document_responses" in response_data:
                document_responses = response_data["document_responses"]
                all_results = []
                for single_response in document_responses:
                    products_ranking = single_response["products_ranking"]
                    success = response_submit_loop(scale_settings, username, scale_id, products_ranking, brand_name, product_name)
                    all_results.append(success.data)
                return Response({"data": all_results}, status=status.HTTP_200_OK)
            else:
                products_ranking = response_data["products_ranking"]
                return response_submit_loop(scale_settings, username, scale_id, products_ranking, brand_name, product_name)
        except Exception as e:
            print(f"error: {e}")
            return Response({"Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
def response_submit_loop(scale_settings, username, scale_id, products_ranking, brand_name, product_name):
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
import json
from nps.dowellconnection import dowellconnection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import datetime
from nps.eventID import get_event_id
from collections import Counter

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
            i = 0
            while 0 <= i < item_count:
                j = i + 1
                while i < j < item_count:
                    paired_items.append([item_list[i], item_list[j]])
                    j += 1
                i += 1
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
                    i = 0
                    while 0 <= i < item_count:
                        j = i + 1
                        while i < j < item_count:
                            paired_items.append([item_list[i], item_list[j]])
                            j += 1
                        i += 1
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
            return Response({"Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
def response_submit_loop(scale_settings, username, scale_id, products_ranking, brand_name, product_name):
    event_id = get_event_id()
    item_list = scale_settings["data"][0]["settings"]["item_list"]
    scores_map = Counter(products_ranking)
    for product in item_list:
        if product not in scores_map:
            scores_map[product] = 0 
    scores_map = sorted(scores_map.items(), key=lambda x:x[1], reverse=True)
    scores_map = dict(scores_map)
    scores_list = list(scores_map.values())
    expected_scores_list = []
    for n in range(len(item_list)):
        expected_scores_list.append(n)
    expected_scores_list.sort(reverse=True)
    if expected_scores_list != scores_list:
        return Response({"error": "Scale Responses inconsistent"}, status=status.HTTP_400_BAD_REQUEST)
    ranking = list(scores_map.keys())
    # Insert new response into database
    response = {
        "event_id": event_id,
        "username": username,
        "scale_id": scale_id,
        "brand_data": {"brand_name": brand_name, "product_name": product_name},
        "ranking": ranking,
        "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    response_id = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094", "ABCDE", "insert", response, "nil")

    return Response({"success": True, "response_id": response_id})

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
        settings = scale_data['data'][0]
        return Response({"payload": settings})




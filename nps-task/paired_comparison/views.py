import json
from nps.dowellconnection import dowellconnection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import datetime
from nps.eventID import get_event_id

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
            user = response['user']
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or misspelt"}, status=status.HTTP_400_BAD_REQUEST)
        
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
            "orientation": orientation,
            "scalecolor": scalecolor,
            "fontcolor": fontcolor,
            "fontstyle": fontstyle,
            "time": time,
            "paired_items": paired_items,
            "total_items": item_count,
            "total_pairs": total_pairs,
            "username": username,
            "user": user,
            "name": name,
            "scale-category": "paired-comparison scale",
            "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                                field_add, "nil")
        user_json = json.loads(x)
        details = {
            "scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE",
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

            field_add = {"_id": scale_id,
                         "settings.scale-category": "paired-comparison scale"}
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
            name = settings["name"]
            for key in settings.keys():
                if key in response:
                    settings[key] = response[key]
            settings["name"] = name
            settings["scale-category"] = "likert scale"
            settings["date_updated"] = datetime.datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S")
            update_field = {"settings": settings}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                 field_add, update_field)
            return Response({"success": "Successfully Updated ", "data": settings})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            

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
        try:
            username = response['username']
        except:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            time = response.get('time')
            if time == None:
                time = 0
            scale_color = response['scale_color']
            fontstyle = response.get('fontstyle', "Arial, Helvetica, sans-serif")
            fontcolor = response.get('fontcolor', "black")
            name = response['scale_name']
            number_of_scales = response['no_of_scale']
            allow_resp = response.get('allow_resp')
            if allow_resp == "true" or allow_resp == "True":
                allow_resp = True
            else:
                allow_resp = False
            item_list = response["item_list"]
            item_count = response["item_count"]
            X_upper_limit = response["X_upper_limit"]
            Y_upper_limit = response["Y_upper_limit"]
            X_left = response["X_left"]
            X_right = response["X_right"]
            Y_top = response["Y_top"]
            Y_bottom = response["Y_bottom"]
            marker_type = response["marker_type"].lower()
            if marker_type not in ["dot", "cross", "pin", "circle"]:
                return Response({"error": "marker_type must be dot, cross, pin or circle"}, status=status.HTTP_400_BAD_REQUEST)
            marker_color = response["marker_color"]   
            X_spacing = response["X_spacing"]  
            Y_spacing = response["Y_spacing"]
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or mispelt"}, status=status.HTTP_400_BAD_REQUEST)
        if item_count != len(item_list):
            return Response({"error": "item_count must be equal to length of item_list"}, status=status.HTTP_400_BAD_REQUEST)
        if not 1 <= X_upper_limit <= 10 and 1 <= Y_upper_limit <= 10:
            return Response({"error": f"X_upper_limit and Y_upper_limit must be between 1 and 10"}, status=status.HTTP_400_BAD_REQUEST)
        X_lower_limit = -X_upper_limit
        Y_lower_limit = -Y_upper_limit
        x_range = []
        y_range = []
        for n in range(X_lower_limit, X_upper_limit+1):
            if n % X_spacing == 0:
                x_range.append(n)
        for n in range(Y_lower_limit, Y_upper_limit+1):
            if n % Y_spacing == 0:
                y_range.append(n)
        eventID = get_event_id()
        field_add = {"event_id": eventID,
                     "settings": {"item_list": item_list, "scale_color": scale_color, "fontstyle": fontstyle,
                                  "no_of_scales": number_of_scales, "fontcolor": fontcolor,
                                  "time": time, "name": name, "scale-category": "perceptual mapping", "username": username,
                                  "item_count": item_count, "X_left": X_left, "X_right": X_right, "Y_top": Y_top,
                                  "Y_bottom": Y_bottom, "marker_color": marker_color, "center": (0,0), "position": "center",
                                   "marker_type": marker_type, "x_range": x_range, "y_range": y_range,
                                  "allow_resp": allow_resp, "X_spacing": X_spacing, "Y_spacing": Y_spacing, 
                                  "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                                  }
                     }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                             field_add, "nil")

        user_json = json.loads(x)
        scale_id = user_json['inserted_id']
        field_add = {**{"scale_id":scale_id}, **field_add}
        details = {"scale_id": scale_id, "event_id": eventID, "username": username}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                        "ABCDE",
                                        "insert", details, "nil")
        return Response({"success": x, "data": field_add})
    elif request.method == 'GET':
        try:
            params = request.GET
            scale_id = params.get("scale_id")
            if not scale_id:
                field_add = {"settings.scale-category": "perceptual mapping"}
                response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                                 "ABCDE", "fetch", field_add, "nil")
                return Response({"data": json.loads(response_data)}, status=status.HTTP_200_OK)

            field_add = {"_id": scale_id, "settings.scale-category": "perceptual mapping"}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "find", field_add, "nil")
            settings_json = json.loads(x)
            if not settings_json.get('data'):
                return Response({"error": "scale not found"}, status=status.HTTP_404_NOT_FOUND)
            settings = settings_json['data']['settings']
            return Response({"success": settings_json})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        response = request.data
        if "scale_id" not in response:
            return Response({"error": "scale_id missing or mispelt"}, status=status.HTTP_400_BAD_REQUEST)
        id = response['scale_id']
        field_add = {"_id": id, }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                            "fetch", field_add, "nil")
        settings_json = json.loads(x)
        settings = settings_json['data'][0]['settings']
        for key in settings.keys():
            if key in response:
                settings[key] = response[key]
        if ("item_list" and "item_count") in response:
            item_count = response["item_count"]
            item_list = response["item_list"]
            if item_count != len(item_list):
                return Response({"error": "item_count must be equal to length of item_list"}, status=status.HTTP_400_BAD_REQUEST)
        X_upper_limit = None
        Y_upper_limit = None
        X_spacing = None
        Y_spacing = None
        if ("X_spacing" and "X_upper_limit") in response:
            X_upper_limit = response["X_upper_limit"]
            X_spacing = response["X_spacing"]
        elif "X_spacing" in response:
            X_spacing = response["X_spacing"]
            X_upper_limit = settings["x_range"][-1]
        elif "X_upper_limit" in response:
            X_spacing = settings["X_spacing"]
            X_upper_limit = response["X_upper_limit"]
        if X_upper_limit and X_spacing:
            if not 1 <= X_upper_limit <= 10:
                return Response({"error": f"X_upper_limit and Y_upper_limit must be between 1 and 10"}, status=status.HTTP_400_BAD_REQUEST)
            X_lower_limit = -X_upper_limit
            x_range = []
            for n in range(X_lower_limit, X_upper_limit+1):
                if n % X_spacing == 0:
                    x_range.append(n)

        if "Y_spacing" in response and "Y_upper_limit" in response:
            Y_upper_limit = response["Y_upper_limit"]
            Y_spacing = response["Y_spacing"]
        elif "Y_spacing" in response:
            Y_spacing = response["Y_spacing"]
            Y_upper_limit = settings["y_range"][-1]
        elif "Y_upper_limit" in response:
            Y_spacing = settings["Y_spacing"]
            Y_upper_limit = response["Y_upper_limit"]
        if Y_upper_limit and Y_spacing:
            if not 1 <= Y_upper_limit <= 10:
                return Response({"error": f"X_upper_limit and Y_upper_limit must be between 1 and 10"}, status=status.HTTP_400_BAD_REQUEST)
            Y_lower_limit = -Y_upper_limit
            y_range = []
            for n in range(Y_lower_limit, Y_upper_limit+1):
                if n % Y_spacing == 0:
                    y_range.append(n)
        
        if ("item_list" and  "item_count") in response:
            settings["item_count"] = item_count
            settings["item_count"] = item_list
        
        if X_upper_limit or X_spacing:
            settings["x_range"] = x_range

        if Y_upper_limit or Y_spacing:
            settings["y_range"] = y_range
        settings["date_updated"] = datetime.datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S")
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                field_add, {"settings" : settings})
        return Response({"success": "Successfully Updated ", "data": settings})


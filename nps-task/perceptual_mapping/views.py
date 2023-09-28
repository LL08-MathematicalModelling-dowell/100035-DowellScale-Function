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
                return Response({"error": "spacing must be betweeen 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)
            marker_color = response["marker_color"]   
            spacing = response["spacing"]  
            if not 1 <= spacing <= 5:
                return Response({"error": "spacing must be betweeen 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or mispelt"}, status=status.HTTP_400_BAD_REQUEST)
        if not spacing <= X_upper_limit <= 10 and spacing <= Y_upper_limit <= 10:
            return Response({"error": f"X_upper_limit and Y_upper_limit must be between {spacing} and 10"}, status=status.HTTP_400_BAD_REQUEST)
        X_lower_limit = -X_upper_limit
        Y_lower_limit = -Y_upper_limit
        eventID = get_event_id()
        field_add = {"event_id": eventID,
                     "settings": {"item_list": item_list, "scale_color": scale_color, "fontstyle": fontstyle,
                                  "no_of_scales": number_of_scales, "fontcolor": fontcolor,
                                  "left": "0%", "right": "100%",
                                  "time": time, "name": name, "scale_category": "percent scale", "username": username,
                                  "item_count": item_count, "X_left": X_left, "X_right": X_right, "Y_top": Y_top,
                                  "Y_bottom": Y_bottom, "X_upper_limit": X_upper_limit, "X_lower_limit": X_lower_limit,
                                   "Y_upper_limit": Y_upper_limit, "Y_lower_limit": Y_lower_limit, "marker_color": marker_color,
                                   "marker_type": marker_type, "spacing": spacing,
                                  "allow_resp": allow_resp, "scale_category": "perceptual mapping",
                                  "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                                  }
                     }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                             field_add, "nil")

        user_json = json.loads(x)
        details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": username}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                        "ABCDE",
                                        "insert", details, "nil")
        return Response({"success": x, "data": field_add})
        


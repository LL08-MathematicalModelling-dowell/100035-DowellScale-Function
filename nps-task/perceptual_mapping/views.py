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
            X_spacing = response["X_spacing"]  
            Y_spacing = response["Y_spacing"]
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or mispelt"}, status=status.HTTP_400_BAD_REQUEST)
        if (X_upper_limit * 2 % X_spacing != 0) or (Y_upper_limit * 2 % Y_spacing != 0):
            return Response({"error": "scale upper limits must be divisible by spacing unit"}, status=status.HTTP_400_BAD_REQUEST)
        if item_count != len(item_list):
            return Response({"error": "item_count must be equal to length of item_list"}, status=status.HTTP_400_BAD_REQUEST)
        if not X_spacing <= X_upper_limit <= 10 and Y_spacing <= Y_upper_limit <= 10:
            return Response({"error": f"X_upper_limit and Y_upper_limit must be between 1 and 10"}, status=status.HTTP_400_BAD_REQUEST)
        X_lower_limit = -X_upper_limit
        Y_lower_limit = -Y_upper_limit
        x_range = []
        y_range = []
        for position in range(X_lower_limit, X_upper_limit+1, X_spacing):
            x_range.append(position)
        for position in range(Y_lower_limit, Y_upper_limit+1, Y_spacing):
            y_range.append(position)
        eventID = get_event_id()
        field_add = {"event_id": eventID,
                     "settings": {"item_list": item_list, "scale_color": scale_color, "fontstyle": fontstyle,
                                  "no_of_scales": number_of_scales, "fontcolor": fontcolor,
                                  "time": time, "name": name, "scale_category": "perceptual_mapping scale", "username": username,
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
        details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": username}
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
            if (X_upper_limit * 2 % X_spacing != 0):
                return Response({"error": "scale upper limits must be divisible by spacing unit"}, status=status.HTTP_400_BAD_REQUEST)
            X_lower_limit = -X_upper_limit
            x_range = []
            for position in range(X_lower_limit, X_upper_limit+1, X_spacing):
                x_range.append(position)

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
            if (Y_upper_limit * 2 % Y_spacing != 0):
                return Response({"error": "scale upper limits must be divisible by spacing unit"}, status=status.HTTP_400_BAD_REQUEST)
            Y_lower_limit = -Y_upper_limit
            y_range = []
            for position in range(Y_lower_limit, Y_upper_limit+1, Y_spacing):
                y_range.append(position)
        
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


@api_view(['POST', 'GET'])
def response_submit_api_view(request):
    if request.method == 'GET':
        try:
            params = request.GET
            scale_id = params.get("scale_id")
            if not scale_id:
                field_add = {"scale_data.scale_type": "perceptual_mapping scale"}
                response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                                                 "ABCDE", "fetch", field_add, "nil")
                return Response({"data": json.loads(response_data)}, status=status.HTTP_200_OK)

            field_add = {"_id": scale_id, "scale_data.scale_type": "perceptual_mapping scale"}          
            scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                     "scale_reports",
                                     "1094", "ABCDE", "fetch", field_add, "nil")
            settings_json = json.loads(scale)
            if not settings_json.get('data'):
                return Response({"error": "scale not found"}, status=status.HTTP_404_NOT_FOUND)
            settings = settings_json['data']
            return Response({"success": settings_json})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

    elif request.method == 'POST':
        response = request.data
        try:
            username = response['username']
        except:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            scale_id = response['scale_id']
            product_name = response['product_name']
            brand_name = response['brand_name']
            possisions = response['possisions']
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or misspelled"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        #check if scale exists
        field_add = {"_id": scale_id, "settings.scale_category": "perceptual_mapping scale"}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                            "fetch", field_add, "nil")
        settings_json = json.loads(x)
        event_id = get_event_id()
        if not settings_json.get('data'):
            return Response({"error": "scale not found"}, status=status.HTTP_404_NOT_FOUND)
        settings = settings_json['data'][0]['settings']
        possisions = response['possisions']
        x_range = settings['x_range']
        y_range = settings['y_range']
        x_left = settings['X_left']
        x_right = settings['X_right']
        y_top = settings['Y_top']
        y_bottom = settings['Y_bottom']
        item_list = settings['item_list']
        item_count = settings['item_count']
        
        if isinstance(possisions, dict) == False:
            return Response({"error": "possisions must be a dict of item and respective x & y possision"}, status=status.HTTP_400_BAD_REQUEST)
        if len(possisions) != item_count:
            return Response({"error": f"possisions count must be equal to item_count"}, status=status.HTTP_400_BAD_REQUEST)
        
        #check if all items are present in possisions
        for item in possisions.keys():
            if item not in item_list:
                return Response({"error": f"{item} not in item_list"}, status=status.HTTP_400_BAD_REQUEST)
            
        #check if all possitions, and items  are valid
        for item, possision in possisions.items():
            if isinstance(possision, list) == False:
                return Response({"error": f"{item} possision must be a tuple"}, status=status.HTTP_400_BAD_REQUEST)
            if item not in item_list:
                return Response({"error": f"{item} not in item_list"}, status=status.HTTP_400_BAD_REQUEST)
            if possision[0] not in x_range:
                return Response({"error": f"{item} x possision not in x_range"}, status=status.HTTP_400_BAD_REQUEST)
            if possision[1] not in y_range:
                return Response({"error": f"{item} y possision not in y_range"}, status=status.HTTP_400_BAD_REQUEST)
            if possision[0] < x_left or possision[0] > x_right:
                return Response({"error": f"{item} x possision not in x_left and x_right"}, status=status.HTTP_400_BAD_REQUEST)
            if possision[1] < y_bottom or possision[1] > y_top:
                return Response({"error": f"{item} y possision not in y_bottom and y_top"}, status=status.HTTP_400_BAD_REQUEST)
            
    
        field_add = {"event_id": event_id,
                     "scale_data": {"scale_id": scale_id, "scale_type": "perceptual_mapping scale"},
                     "brand_data": {"brand_name": brand_name, "product_name": product_name},
                     "possisions": possisions,
                     "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    }
        
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                             "ABCDE", "insert", field_add, "nil")
        response = json.loads(x)
        details = {"scale_id": response['inserted_id'], "username": username}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                        "ABCDE",
                                        "insert", details, "nil")
        return Response({"success": response['inserted_id'], "data": field_add})
    
            
            
    
        
        
        

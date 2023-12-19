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
        if not 1 <= X_upper_limit <= 100 or not 1 <= Y_upper_limit <= 100:
            return Response({"error": f"X_upper_limit and Y_upper_limit must be between 1 and 100"}, status=status.HTTP_400_BAD_REQUEST)
        if not 1 <= X_spacing <= 50 or not  1 <= Y_spacing <= 50 :
            return Response({"error": f"X_spacing and Y_spacing must be between 1 and 50"}, status=status.HTTP_400_BAD_REQUEST)
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
                                  "time": time, "name": name, "scale_category": "perceptual_mapping scale", "username": username,
                                  "item_count": item_count, "X_left": X_left, "X_right": X_right, "Y_top": Y_top,
                                  "Y_bottom": Y_bottom, "marker_color": marker_color, "center": (0,0), "position": "center",
                                   "marker_type": marker_type, "x_range": x_range, "y_range": y_range, "X_upper_limit": X_upper_limit, "Y_upper_limit": Y_upper_limit,
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
                field_add = {"settings.scale_category": "perceptual_mapping scale"}
                response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                                 "ABCDE", "fetch", field_add, "nil")
                return Response({"data": json.loads(response_data)}, status=status.HTTP_200_OK)

            field_add = {"_id": scale_id, "settings.scale_category": "perceptual_mapping scale"}
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
            if not 1 <= X_upper_limit <= 100:
                return Response({"error": f"X_upper_limit and Y_upper_limit must be between 1 and 100"}, status=status.HTTP_400_BAD_REQUEST)
            if not 1 <= X_spacing <= 50:
                return Response({"error": f"X_spacing must be between 1 and 50"}, status=status.HTTP_400_BAD_REQUEST)
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
            if not 1 <= Y_upper_limit <= 100:
                return Response({"error": f"X_upper_limit and Y_upper_limit must be between 1 and 100"}, status=status.HTTP_400_BAD_REQUEST)
            if not 1 <= Y_spacing <= 50 :
                return Response({"error": f"Y_spacing must be between 1 and 50"}, status=status.HTTP_400_BAD_REQUEST)
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


@api_view(['POST', 'GET'])
def response_submit_api_view(request):
    if request.method == 'GET':
        params = request.GET
        id = params.get("scale_id")
        if id:
            # Retrieve specific response by scale_id
            field_add = {"_id": id, "scale_data.scale_type": "perceptual_mapping scale"}
            scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                     "scale_reports",
                                     "1094", "ABCDE", "fetch", field_add, "nil")
            data = json.loads(scale)
            if data.get('data') is None:
                return Response({"Error": "Scale Response does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"data": data['data']}, status=status.HTTP_200_OK)
        else:
            # Return all perceptual_mapping scale responses
            field_add = {"scale_data.scale_type": "perceptual_mapping scale"}
            scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                     "scale_reports",
                                     "1094", "ABCDE", "fetch", field_add, "nil")
            settings_list = []
            responses = json.loads(scale)
            for item in responses['data']:
                settings_list.append(item)
            return Response({"data": settings_list}, status=status.HTTP_200_OK)
        

    elif request.method == 'POST':
        response = request.data
        try:
            username = response['username']
        except:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if "document_responses" in response:
            try:
                username = response['username']
                document_response = response['document_responses']
                instance_id = response['instance_id']
                process_id = response['process_id']
                brand_name = response['brand_name']
                product_name = response['product_name']
            except KeyError as e:
                return Response({"error": f"Missing required parameter {e}"}, status=status.HTTP_400_BAD_REQUEST)
            if not isinstance(process_id, str):
                return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)
            
            results = []
            for rsp in document_response:
                scale_id = rsp['scale_id']
                positions = rsp['positions']
                document_data = {"details": {"action": response.get('action', ""),
                                             "authorized": response.get('authorized', ""),
                                             "cluster": response.get('cluster', ""),
                                             "collection": response.get('collection', ""),
                                             "command": response.get('command', ""),
                                             "database": response.get('database', ""),
                                             "document": response.get('document', ""),
                                             "document_flag": response.get('document_flag', ""),
                                             "document_right": response.get('document_right', ""),
                                             "field": response.get('field', ""),
                                             "flag": response.get('flag', ""),
                                             "function_ID": response.get('function_ID', ""),
                                             "metadata_id": response.get('metadata_id', ""),
                                             "process_id": response['process_id'],
                                             "role": response.get('role', ""),
                                             "team_member_ID": response.get('team_member_ID', ""),
                                             "product_name": response.get('product_name', ""),
                                             "update_field": {"content": response.get('content', ""),
                                                              "document_name": response.get('document_name', ""),
                                                              "page": response.get('page', "")},
                                             "user_type": response.get('user_type', ""),
                                             "id": response.get('_id')}
                                 }
                
                responses = {
                    "brand_name": brand_name,
                    "product_name": product_name,
                    "positions": positions
                }
                result = response_submit_loop(username, scale_id, responses, instance_id, process_id, document_data)
                result = result.data
                results.append(result)
                if result.get('error', None):
                    return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(results)
        else:
            instance_id = response.get('instance_id')
            try:
                scale_id = response['scale_id']
                username = response['username']
                positions = response['positions']
                brand_name = response['brand_name']
                product_name = response['product_name']
            except KeyError as e:
                return Response({"error": f"Missing required parameter {e}"}, status=status.HTTP_400_BAD_REQUEST)
            responses = {
                "brand_name": brand_name,
                "product_name": product_name,
                "positions": positions,
            }
            if "process_id" in response:
                process_id = response.get('process_id')
                if not isinstance(process_id, str):
                    return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)
                return response_submit_loop(username, scale_id, responses, instance_id, process_id)

            result = response_submit_loop(username, scale_id, responses, instance_id)
            result = result.data
            return Response(result)
        
def response_submit_loop(username, scale_id, responses, instance_id, process_id=None, document_data=None):
    # Check if response already exists for this event
    field_add = {"username": username, "scale_data.scale_id": scale_id, "scale_data.scale_type": "perceptual_mapping scale",
                 "scale_data.instance_id": instance_id}
    previous_response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                         "1094", "ABCDE", "fetch",
                                         field_add, "nil")
    previous_response = json.loads(previous_response)
    previous_response = previous_response.get('data')
    if len(previous_response) > 0:
        return Response({"error": "You have already submitted a response for this scale."},
                        status=status.HTTP_400_BAD_REQUEST)

    # Check if scale exists
    event_id = get_event_id()
    field_add = {"_id": scale_id, "settings.scale_category": "perceptual_mapping scale"}
    scale = dowellconnection("dowellscale", "bangalore", "dowellscale",
                             "scale", "scale", "1093", "ABCDE", "fetch", field_add, "nil")
    scale = json.loads(scale)
    if not scale.get('data, none'):
        return Response({"Error": "Scale does not exist."}, status=status.HTTP_400_BAD_REQUEST)
    if scale['data'][0]['settings']['scale_category'] != 'perceptual_mapping scale':
        return Response({"error": "Invalid scale type."}, status=status.HTTP_400_BAD_REQUEST)
    settings = scale['data'][0]['settings']
    if settings['allow_resp'] == False:
        return Response({"error": "scale not accepting responses"}, status=status.HTTP_400_BAD_REQUEST)
    
    x_range = settings['x_range']
    y_range = settings['y_range']
    X_upper_limit = settings['X_upper_limit']
    Y_upper_limit = settings['Y_upper_limit']
    x_left = settings['X_left']
    x_right = settings['X_right']
    y_top = settings['Y_top']
    y_bottom = settings['Y_bottom']
    item_list = settings['item_list']
    item_count = settings['item_count']
    positions = responses['positions']
    
    if isinstance(positions, dict) == False:
        return Response({"error": "positions must be a dict of item and respective x & y possision"}, status=status.HTTP_400_BAD_REQUEST)
    if len(positions) != item_count:
        return Response({"error": f"positions count must be equal to item_count"}, status=status.HTTP_400_BAD_REQUEST)
    
    #check if all items are present in positions
    for item in positions.keys():
        if item not in item_list:
            return Response({"error": f"{item} not in item_list"}, status=status.HTTP_400_BAD_REQUEST)
        
    #check if all possitions, and items  are valid
    for item, position in positions.items():
        if isinstance(position, list) == False:
            return Response({"error": f"{item} position must be a list of x and y position"}, status=status.HTTP_400_BAD_REQUEST)
        if item not in item_list:
            return Response({"error": f"{item} not in item_list"}, status=status.HTTP_400_BAD_REQUEST)
        if position[0] < -X_upper_limit or position[0] > X_upper_limit:
            return Response({"error": f"{item} position not in range"}, status=status.HTTP_400_BAD_REQUEST)
        if position[1] < -Y_upper_limit or position[1] > Y_upper_limit:
            return Response({"error": f"{item} position not in range"}, status=status.HTTP_400_BAD_REQUEST)
        if position[0] not in x_range:
            return Response({"error": f"{item} x position not in x_range"}, status=status.HTTP_400_BAD_REQUEST)
        if position[1] not in y_range:
            return Response({"error": f"{item} y position not in y_range"}, status=status.HTTP_400_BAD_REQUEST)
        
    field_add = {"event_id": event_id,
                    "scale_data": {"scale_id": scale_id, "scale_type": "perceptual_mapping scale",  "instance_id": instance_id},
                    "brand_data": {"brand_name": responses['brand_name'], "product_name": responses['product_name']},
                    "positions": positions,
                    "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
    if document_data:
        field_add['document_data'] = document_data
    if process_id:
        field_add['process_id'] = process_id
        
    
    x = dowellconnection("dowellscale", "bangalore"
                            , "dowellscale", "scale_reports", "scale_reports", "1094",
                            "ABCDE", "insert", field_add, "nil")
    response = json.loads(x)
    details = {"scale_id": response['inserted_id'], "username": username}
    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                    "ABCDE",
                                    "insert", details, "nil")
    return Response({"success": True, "inserted_id": response['inserted_id'], "data": field_add})
    
    

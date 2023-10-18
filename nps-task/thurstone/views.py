import json
from nps.dowellconnection import dowellconnection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import datetime
from nps.eventID import get_event_id
from Qsort.views import dowellshuffling_function


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
            topic = response.get('topic')
            statement_count = response.get('statement_count')
            statements = response.get('stements')
            sorting_order = response.get('sorting_order').lower()
            if sorting_order not in ["random", "alphabetical", "custom", "no order"]:
                return Response({"error": "sorting_order must be one of random, alphabetical, custom or no order"}, status=status.HTTP_400_BAD_REQUEST)
            percentage_accuracy = response.get('response.get')
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or mispelt"}, status=status.HTTP_400_BAD_REQUEST)
        if statement_count != len(statements):
            return Response({"error": "statement count must be equal to length of statements"}, status=status.HTTP_400_BAD_REQUEST)
        if sorting_order == "random":
            statements = dowellshuffling_function(statements)  
        elif sorting_order == "alphabetical":
            statements = lambda statements: [string.capitalize() for string in statements]
            statements = sorted(statements)
        elif sorting_order == "custom":
            statements = lambda statements: sorted(statements, key=lambda x: x[0])
        min_allowed_score = 1
        max_allowed_score = 11
        eventID = get_event_id()
        field_add = {"event_id": eventID,
                "settings": {"topic": topic, "scale_color": scale_color, "fontstyle": fontstyle,
                            "no_of_scales": number_of_scales, "fontcolor": fontcolor,
                            "time": time, "name": name, "scale_category": "thurstone scale", "username": username,
                            "statement_count": statement_count, "statements": statements, "sorting_order": sorting_order,
                            "percentage_accuracy": percentage_accuracy, "min_allowed_score": min_allowed_score,
                            "max_allowed_score": max_allowed_score, "allow_resp": allow_resp,
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
    elif request.method == "GET":
        try:
            params = request.GET
            scale_id = params.get("scale_id")
            if not scale_id:
                field_add = {"settings.scale-category": "thurstone"}
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
        statements = settings.get("statements")
        sorting_order = settings.get("sorting_order")
        if ("statements" in response) or ("statement_count" in response):
            statement_count = response.get("statement_count")
            statements = response.get("statements")
            if statements == None or statement_count == None:
                return Response({"error": "statements and statement_count have to be updated together"}, status=status.HTTP_400_BAD_REQUEST)
            if statement_count != len(statements):
                return Response({"error": "statement_count must be equal to length of statements"}, status=status.HTTP_400_BAD_REQUEST)

        if "sorting_order" in response:
            if sorting_order == "random":
                statements = dowellshuffling_function(statements)  
            elif sorting_order == "alphabetical":
                statements = lambda statements: [string.capitalize() for string in statements]
                statements = sorted(statements)
            elif sorting_order == "custom":
                statements = lambda statements: sorted(statements, key=lambda x: x[0])

        settings["statements"] = statements
        settings["statement_count"] = statement_count
        settings["sorting_order"] = sorting_order
        settings["date_updated"] = datetime.datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S")
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                field_add, {"settings":settings})
        return Response({"success": "Successfully Updated ", "data": settings})


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
            return Response({"error": "item_count must be equal to length of item_list"}, status=status.HTTP_400_BAD_REQUEST)
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

import json
from nps.dowellconnection import dowellconnection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import datetime
from nps.eventID import get_event_id
from Qsort.views import dowellshuffling_function


from api.utils import dowell_time_asian_culta


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
            topic = response['topic']
            statement_count = response['statement_count']
            statements = response['statements']
            sorting_order = response['sorting_order'].lower()
            if sorting_order not in ["random", "alphabetical", "custom", "no order"]:
                return Response({"error": "sorting_order must be one of random, alphabetical, custom or no order"}, status=status.HTTP_400_BAD_REQUEST)
            percentage_accuracy = response.get('percentage_accuracy')
            if not 0 <= int(percentage_accuracy) <= 100:
                return Response({"error": "percentage_accuracy must be between 0 and 100"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or mispelt"}, status=status.HTTP_400_BAD_REQUEST)
        if statement_count != len(statements):
            return Response({"error": "statement count must be equal to length of statements"}, status=status.HTTP_400_BAD_REQUEST)
        if sorting_order == "random":
            statements = dowellshuffling_function(statements)


        elif sorting_order == "alphabetical":
            capitalize_list = lambda statements: [string[-1].capitalize() for string in statements]
            statements = sorted(capitalize_list(statements))

        elif sorting_order == "custom":
            for statement in statements:
                if len(statement) != 2:
                    return Response({"error": "You must add a sorting index in each statement when using custom sort"}, status=status.HTTP_400_BAD_REQUEST)
                if type(statement[0]) is not int:
                                        return Response({"error": "Sorting index when using custom sort must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
            index_sort = lambda statements: sorted(statements, key=lambda x: x[0])
            statementsList = index_sort(statements)
            statements = []
            for statement in statementsList:
                 statements.append(statement[1])

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
                            "date_created":  dowell_time_asian_culta().get("current_time")
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
                field_add = {"settings.scale_category": "thurstone scale"}
                response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                                 "ABCDE", "fetch", field_add, "nil")
                return Response({"data": json.loads(response_data)}, status=status.HTTP_200_OK)

            field_add = {"_id": scale_id, "settings.scale_category": "thurstone scale"}
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
        settings = settings_json.get('data')
        if settings == None or len(settings) == 0:
             return Response({"error": "Scale not found"}, status=status.HTTP_404_NOT_FOUND)
        settings = settings[0]
        settings = settings.get('settings')
        if settings == None or len(settings) == 0:
             return Response({"error": "Scale not found"}, status=status.HTTP_404_NOT_FOUND)
        for key in settings.keys():
            if key in response:
                if key == "percentage_accuracy":
                    percentage_accuracy = response.get('percentage_accuracy')
                    if not 0 <= int(percentage_accuracy) <= 100:
                        return Response({"error": "percentage_accuracy must be between 0 and 100"}, status=status.HTTP_400_BAD_REQUEST)
                settings[key] = response[key]
        statements = settings.get("statements")
        statement_count = settings.get("statement_count")
        sorting_order = settings.get("sorting_order")
        if ("statements" in response) or ("statement_count" in response):
            statement_count = response.get("statement_count")
            statements = response.get("statements")
            if statements == None or statement_count == None:
                return Response({"error": "statements and statement_count have to be updated together"}, status=status.HTTP_400_BAD_REQUEST)
            if statement_count != len(statements):
                return Response({"error": "statement_count must be equal to length of statements"}, status=status.HTTP_400_BAD_REQUEST)

        if "sorting_order" in response:
            if sorting_order not in ["random", "alphabetical", "custom", "no order"]:
                return Response({"error": "sorting_order must be one of random, alphabetical, custom or no order"}, status=status.HTTP_400_BAD_REQUEST)
        if sorting_order == "random":
            statements = dowellshuffling_function(statements)
        elif sorting_order == "alphabetical":
            capitalize_list = lambda statements: [string.capitalize() for string in statements]
            statements = sorted(capitalize_list(statements))
        elif sorting_order == "custom":
            for statement in statements:
                if len(statement) != 2:
                    return Response({"error": "You must add a sorting index in each statement when using custom sort"}, status=status.HTTP_400_BAD_REQUEST)
                if type(statement[0]) is not int:
                                        return Response({"error": "Sorting index when using custom sort must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
            index_sort = lambda statements: sorted(statements, key=lambda x: x[0])
            statementsList = index_sort(statements)
            statements = []
            for statement in statementsList:
                 statements.append(statement[1])

        settings["statements"] = statements
        settings["statement_count"] = statement_count
        settings["sorting_order"] = sorting_order
        settings["date_updated"] =  dowell_time_asian_culta().get("current_time")
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                field_add, {"settings":settings})
        return Response({"success": "Successfully Updated ", "data": settings})


@api_view(['POST', 'GET'])
def response_submit_api_view(request):
    if request.method == 'GET':
        params = request.GET
        id = params.get("scale_id")
        if id:
            # Retrieve specific response by scale_id
            field_add = {"_id": id, "scale_data.scale_type": "thurstone scale"}
            scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                     "scale_reports",
                                     "1094", "ABCDE", "fetch", field_add, "nil")
            data = json.loads(scale)
            if data.get('data') is None:
                return Response({"Error": "Scale Response does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"data": data['data']}, status=status.HTTP_200_OK)
        else:
            # Return all thurstone scale responses
            field_add = {"scale_data.scale_type": "thurstone scale"}
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
        try:

            brand_name = response['brand_name']

        except KeyError as e:
                return Response({"error": f"Missing required parameter {e}"}, status=status.HTTP_400_BAD_REQUEST)

        if "document_responses" in response:
            try:
                document_responses = response['document_responses']
                instance_id = response['instance_id']
                process_id = response['process_id']
                brand_name = response['brand_name']
            except KeyError as e:
                return Response({"error": f"Missing required parameter {e}"}, status=status.HTTP_400_BAD_REQUEST)
            if not isinstance(process_id, str):
                return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)

            results = []
            for resp in document_responses:
                scale_id = resp['scale_id']
                statements = resp['statements']
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
                    "scale_id": scale_id,
                    "statements": statements,
                    "brand_name": brand_name
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
                statements = response['statements']
                brand_name = response['brand_name']
            except KeyError as e:
                return Response({"error": f"Missing required parameter {e}"}, status=status.HTTP_400_BAD_REQUEST)

            if "process_id" in response:
                process_id = response.get('process_id')
                if not isinstance(process_id, str):
                    return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)
                return response_submit_loop(username, scale_id, response, instance_id, process_id)

            result = response_submit_loop(username, scale_id, response, instance_id)
            return result



def response_submit_loop(username, scale_id, response, instance_id, process_id=None, document_data=None):

    # Check if response already exists for this event
    field_add = {"username": username, "scale_data.scale_id": scale_id, "scale_data.scale_type": "thurstone scale",
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
    field_add = {"_id": scale_id, "settings.scale_category": "thurstone scale"}
    scale = dowellconnection("dowellscale", "bangalore", "dowellscale",
                            "scale", "scale", "1093", "ABCDE", "fetch", field_add, "nil")
    scale = json.loads(scale)
    print(scale)
    if scale.get("data") == None:
        return Response({"Error": "Scale does not exist."}, status=status.HTTP_400_BAD_REQUEST)
    if len(scale["data"]) == 0 or scale["data"][0].get("settings") == None:
        return Response({"Error": "Scale does not exist."}, status=status.HTTP_400_BAD_REQUEST)
    if scale['data'][0]['settings']['scale_category'] != 'thurstone scale':
        return Response({"error": "Invalid scale type."}, status=status.HTTP_400_BAD_REQUEST)
    settings = scale['data'][0]['settings']
    print("a")
    if settings['allow_resp'] == False:
        return Response({"error": "scale not accepting responses"}, status=status.HTTP_400_BAD_REQUEST)

    statements = response['statements']
    statements_count = settings['statement_count']
    percentage_accuracy = settings['percentage_accuracy']
    min_allowed = settings['min_allowed_score']
    max_allowed = settings['max_allowed_score']


    # Check if all statements are assigned a score
    if len(statements) != statements_count:
        return Response({"error": "All statements are not assigned a score."}, status=status.HTTP_400_BAD_REQUEST)

    # Validate if each scale are assigned a score
    for statement in statements:
        if statement['score'] < min_allowed or statement['score'] > max_allowed or type(statement['score']) != int:
            return Response({"error": "Invalid score assigned."}, status=status.HTTP_400_BAD_REQUEST)

    # Sort the statements by score
    statements = sorted(statements, key=lambda k: k['score'])

    # Calculate median score
    median_score = statements[statements_count//2]['score']

    # Calculate score range
    score_range = max_allowed - min_allowed

    # Calculate standardized score
    standardized_score_list = []
    for statement in statements:
        standardized_score = (statement['score'] - min_allowed) / score_range
        if 0 <= standardized_score <= 1:
            standardized_score_list.append(standardized_score)
        else:
            return Response({"error": "Invalid score assigned."}, status=status.HTTP_400_BAD_REQUEST)

    # Calculate cut off score
    cut_off_percentage = percentage_accuracy / 100 or 0.5
    cut_off_score = (cut_off_percentage  * score_range) + min_allowed

    # Calculate response attitude
    response_attitude = {
        "favourable": 0,
        "unfavourable": 0,
        "neutral": 0
    }

    for statement in standardized_score_list:
        if statement < 0.5:
            response_attitude['unfavourable'] += 1
        elif statement > 0.5:
            response_attitude['favourable'] += 1
        else:
            response_attitude['neutral'] += 1

    # Calculate attitude percentage
    attitude_percentage = {
        "favourable": (response_attitude['favourable'] / len(statements)) * 100,
        "unfavourable": (response_attitude['unfavourable'] / len(statements)) * 100,
        "neutral": (response_attitude['neutral'] / len(statements)) * 100
    }

    # Calculate overall user attitude
    if attitude_percentage['favourable'] == attitude_percentage['neutral'] == attitude_percentage['unfavourable']:
        overall_user_attitude = "Cannot be decided"
    else:
        overall_user_attitude = max(attitude_percentage, key=attitude_percentage.get)

    field_add = {
        "event_id": event_id,
        "scale_data": {
            "scale_id": scale_id,
            "scale_type": "thurstone scale",
            "instance_id": instance_id
        },
        "brand_data": {
            "brand_name": response["brand_name"]
        },
        "statements": statements,
        "median_score": median_score,
        "standardized_score_list": standardized_score_list,
        "cut_off_score": cut_off_score,
        "response_attitude": response_attitude,
        "attitude_percentage": attitude_percentage,
        "overall_user_attitude": overall_user_attitude,
        "date_created":  dowell_time_asian_culta().get("current_time")
    }
    if document_data:
        field_add['document_data'] = document_data
    if process_id:
        field_add['process_id'] = process_id


    x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                    "1094", "ABCDE", "insert", field_add, "nil")
    response  = json.loads(x)
    field_add["inserted_id"] = response["inserted_id"]
    return Response({"success": True, "data": field_add }, status=status.HTTP_200_OK)


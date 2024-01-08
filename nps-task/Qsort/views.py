import json
import random

from django.http import JsonResponse
from django.shortcuts import render
# from ..EvaluationModule.calculate_function import *
# from ..EvaluationModule.normality import *
from concurrent.futures import ThreadPoolExecutor
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
# from .dowellconnection import dowellconnection
# from ..EvaluationModule.calculate_function import *
from .eventID import *
from .dowellconnection import dowellconnection


def dowellshuffling_function(statements):
    random.shuffle(statements)
    return statements


def move_last_to_start(d):
    if not d:
        return d

    last_key, last_value = list(d.items())[-1]
    new_dict = {last_key: last_value}
    new_dict.update(d)
    return new_dict


@api_view(['GET', 'POST', 'PUT'])
def CreateScale(request):
    global field_add, x
    required_fields = ['sort_order', 'statements', 'product_name', 'scalecolor', 'fontstyle', 'fontcolor', 'user',
                       'name']

    if request.method == 'POST':
        payload = request.data

        for field in required_fields:
            # print(f"Checking for {field}")
            if field not in payload:
                return Response({"Error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

        sort_order = payload['sort_order']
        if sort_order not in ['random', 'alphabetical', 'custom', 'custom_descending']:
            return Response({"Error": "Invalid sort_order"}, status=status.HTTP_400_BAD_REQUEST)

        statements = payload['statements']
        if sort_order == 'random':
            statements = dowellshuffling_function(statements)
        elif sort_order == 'alphabetical':
            statements.sort()
        elif sort_order in ['custom', 'custom_descending']:
            if not all(isinstance(i, dict) for i in statements):
                return Response({"Error": "statements : must be dictionaries for custom sort orders"},
                                    status=status.HTTP_400_BAD_REQUEST)
            statements.sort(key=lambda x: x['id'], reverse=sort_order == 'custom_descending')

        eventID = get_event_id()

        field_add = {
            "event_id": eventID,
            "product_name": payload["product_name"],
            "sort_order": sort_order,
            "statements": statements,
            "settings": {
                "scaletype": "qsort",
                "scalecolor": payload["scalecolor"],
                "fontstyle": payload["fontstyle"],
                "fontcolor": payload["fontcolor"],
            }
        }

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                             field_add, "nil")

        data_dict = json.loads(x)

        inserted_id = data_dict["inserted_id"]
        show_response = {
            "scale_id": inserted_id,
            "event_id": eventID['event_id'],
            "product_name": payload["product_name"],
            "sort_order": sort_order,
            "Number of statements": len(statements),
            "settings": {
                "scalecolor": payload["scalecolor"],
                "fontstyle": payload["fontstyle"],
                "fontcolor": payload["fontcolor"],
                "statements": statements
            }
        }

        return Response({"Response": show_response}, status=status.HTTP_201_CREATED)

    if request.method == 'GET':
        try:
            params = request.GET
            scale_id = params.get("scale_id")
            if not scale_id:
                z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                    "fetch",
                                    {"settings.scaletype": "qsort"}, "nil")

                z = json.loads(z)
                return Response({"Response": "Please input Scale Id in payload", "Avalaible Scales": z["data"]},
                                    status=status.HTTP_200_OK)
            else:
                field_add = {"_id": scale_id}
                # print(x)
                
                x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                                        field_add, "nil")
                settings_json = json.loads(x)
                if not settings_json.get('data'):
                    return Response({"error": "scale not found"}, status=status.HTTP_404_NOT_FOUND)
                return Response({"Success": x, "Response": field_add}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"Error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT':
        fields = ['sort_order', 'scale_id', 'product_name', 'scalecolor', 'fontstyle', 'fontcolor']
        try:
            
            payload = request.data
            for field in fields:
                if field not in payload:
                    return Response({"Error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)
            
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                            "fetch", field_add, "nil")
            field_add = {"scale_id": payload["scale_id"]}
            settings_json = json.loads(x)
            
            if not settings_json.get('data', None):
                return Response({"error": "scale not found"}, status=status.HTTP_404_NOT_FOUND)
            update_field = {
                "sort_order": payload["sort_order"],
                "scalecolor": payload["scalecolor"],
                "fontstyle": payload["fontstyle"],
                "fontcolor": payload["fontcolor"]
            }
            all_fields = {"product_name": payload["product_name"], "scale_id": payload["scale_id"], 
                        "sort_order": payload["sort_order"], "scalecolor": payload["scalecolor"], 
                        "fontstyle": payload["fontstyle"], "fontcolor": payload[
                            "fontcolor"]}

            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                field_add, update_field)

            return Response({"Success": "Settings were successfully updated", "Response": all_fields}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"Error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST', 'GET'])
def ResponseAPI(request):
    payload = request.data

    if request.method == 'POST':
        if not payload.get("scale_id", None):
            return Response({"Error": "Missing required field: scale_id"}, status=status.HTTP_400_BAD_REQUEST)          
        field_add = {"_id": payload["scale_id"]}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "find",
                             field_add, "nil")
        x = json.loads(x)
        try:
            type = x["data"]["settings"]["scaletype"]
        except:
            type = "nil"

        try:
            if x[
                "error"]:  # You might need to modify this condition based on how your connection function handles non-existing scales
                return Response({"Error": "Scale does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            if type != "qsort":
                return Response({"Error": "Scale is not a qsort"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                     "1094", "ABCDE", "find",
                                     field_add, "nil")
                x = json.loads(x)
                if x["isSuccess"] == 'True':
                    return Response({"Success": "Scale response Already exists", "data": x["data"][0]["responses"]},
                                        status=status.HTTP_200_OK)
                else:
                    # try:
                    #     if x["data"][0]["statements"]:
                    #         return JsonResponse({"Success": "Scale response Already exists", "data": x["data"][0]["statements"]},
                    #                             status=status.HTTP_200_OK)
                    # except:
                    required_fields = ['disagree', 'neutral', 'agree', 'sort_order', 'product_name', 'scalecolor',
                                       'fontstyle', 'fontcolor']
                    # print(sum(
                    #     [len(data["statements"]) for key, data in payload.items() if
                    #      key in ["disagree", "neutral", "agree"]]))
                    total_statements = sum(
                        [len(data["statements"]) for key, data in payload.items() if
                         key in ["disagree", "neutral", "agree"]])

                    if not total_statements in range(60, 141):
                        return Response(
                            {"Error": "Invalid number of total statements. Must be between 60 and 140 inclusive."},
                            status=status.HTTP_400_BAD_REQUEST)
                    # Check for continuous card numbers
                    all_cards = []
                    for group in ["disagree", "neutral", "agree"]:
                        if group in payload:
                            all_cards.extend([stmt["card"] for stmt in payload[group]['statements']])
                    all_cards = sorted(list(map(int, all_cards)))  # Convert to integers and sort
                    print(all_cards, "cards\n\n")
                    print(list(range(1, total_statements + 1)), "range\n\n")
                    if all_cards != list(range(1, total_statements + 1)):
                        return Response({"Error": "Card numbers are not continuous or missing."},
                                            status=status.HTTP_400_BAD_REQUEST)

                    payload = request.data
                    for field in required_fields:
                        if field not in payload:
                            return Response({"Error": f"Missing required field: {field}"},
                                                status=status.HTTP_400_BAD_REQUEST)

                    if "document_responses" in payload:
                        document_response = payload['document_responses']
                        instance_id = payload['instance_id']
                        process_id = payload['process_id']
                        if not isinstance(process_id, str):
                            return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)
                        for response in document_response:
                            if not isinstance(response, dict):
                                return Response({"error": "The document responses should be a list of dictionaries."},
                                                status=status.HTTP_400_BAD_REQUEST)
                            document_data = {"details": {"action": payload.get('action', ""), 
                                                "authorized": payload.get('authorized',""), 
                                                "cluster": payload.get('cluster', ""), 
                                                "collection": payload.get('collection',""), 
                                                "command": payload.get('command',""), 
                                                "database": payload.get('database', ""), 
                                                "document": payload.get('document', ""), 
                                                "document_flag":payload.get('document_flag',""), 
                                                "document_right": payload.get('document_right', ""), 
                                                "field": payload.get('field',""), 
                                                "flag": payload.get('flag', ""), 
                                                "function_ID": payload.get('function_ID', ""),
                                                "metadata_id": payload.get('metadata_id', ""), 
                                                "process_id": payload['process_id'], 
                                                "role": payload.get('role', ""), 
                                                "team_member_ID": payload.get('team_member_ID', ""), 
                                                "product_name": payload.get('product_name', ""),
                                                "update_field": {"content": payload.get('content', ""), 
                                                                "document_name": payload.get('document_name', ""), 
                                                                "page": payload.get('page', "")}, 
                                                                "user_type": payload.get('user_type', ""), 
                                                                "id": payload['_id']} 
                                                }
                            
                    # Define fixed pile ranges
                    pile_ranges = {
                        "disagree": [-5, -4, -3, -2, -1],
                        "neutral": [0],
                        "agree": [1, 2, 3, 4, 5]
                    }

                    # Function to dynamically distribute scores
                    def assign_to_piles(statements, pile_range):
                        total_statements = len(statements)
                        distribution = {}

                        # Calculate base ratios for each score
                        base_ratios = {
                            -5: 2 / 47, -4: 3 / 47, -3: 4 / 47, -2: 5 / 47, -1: 6 / 47,
                            0: 7 / 47,
                            1: 6 / 47, 2: 5 / 47, 3: 4 / 47, 4: 3 / 47, 5: 2 / 47
                        }

                        # Pro-rata distribution based on the number of actual statements
                        for score in pile_range:
                            distribution[score] = round(base_ratios[score] * total_statements)

                        # Adjust for any discrepancies due to rounding
                        discrepancy = total_statements - sum(distribution.values())
                        adjusting_scores = sorted(pile_range, key=lambda x: abs(x))

                        while discrepancy != 0:
                            for score in adjusting_scores:
                                if discrepancy > 0:
                                    distribution[score] += 1
                                    discrepancy -= 1
                                elif discrepancy < 0:
                                    distribution[score] -= 1
                                    discrepancy += 1
                                if discrepancy == 0:
                                    break

                        # Create a copy of the statements and sort them by their card number
                        sorted_statements = sorted(statements,
                                                   key=lambda x: str(x['card']).split('-')[1] if '-' in str(
                                                       x['card']) else x[
                                                       'card'])
                        # print(statements)
                        # Assign scores to statements based on their card numbers, but maintain the original order for output
                        scored_statements = [{'card': s['card'], 'statement': s['text'], 'score': None} for s in
                                             statements]

                        for score in pile_range:
                            for _ in range(distribution[score]):
                                statement = sorted_statements.pop(0)
                                index = next(
                                    (i for i, s in enumerate(scored_statements) if s['card'] == statement['card']),
                                    None)
                                if index is not None:
                                    scored_statements[index]['score'] = score

                        return scored_statements

                    # Iterate through groups (disagree, neutral, agree) and calculate scores
                    results = {}
                    for group, group_data in payload.items():
                        if group in ["disagree", "neutral", "agree"]:
                            statements = group_data['statements']
                            scores = assign_to_piles(statements, pile_ranges[group])
                            results[group.capitalize()] = scores

                    # Other payload information
                    user_info = {key: value for key, value in payload.items() if
                                 key not in ["disagree", "neutral", "agree"]}
                    user_info['results'] = results

                    event = get_event_id()
                    add = {
                        "event_id": event,
                        "_id": payload["scale_id"],
                        "results": results,
                        "user": payload["user"],
                        "name": payload["name"],
                        "product_name": payload["product_name"],
                        "scale_type": "Qsort",
                        "scalecolor": payload["scalecolor"],
                        "fontstyle": payload["fontstyle"],
                        "fontcolor": payload["fontcolor"]

                    }
                    
                    if "process_id" in payload:
                        add["process_id"] = payload["process_id"]
                        
                    if 'document_data' in  payload:
                        add["document_data"] = payload['document_data']
                    
                    x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                         "1094", "ABCDE", "insert",
                                         add, "nil")

                    x = json.loads(x)

                    data_dict = x
                    if data_dict['isSuccess'] == 'true' or data_dict['isSuccess'] == True:

                        results = move_last_to_start(user_info)
                        return Response({"Success": data_dict}, status=status.HTTP_200_OK)
                    elif data_dict['isSuccess'] == 'false' or data_dict['isSuccess'] == False and data_dict['error'][
                                                                                                  0:6] == 'E11000':
                        return Response({"Error": "Response Already Exists"}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        return Response({"Error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)
        
                
        

    if request.method == 'GET':
        params = request.GET
        id = params.get("scale_id")
        if not id:
            z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                    "fetch",
                                    {"settings.scaletype": "qsort"}, "nil")

            z = json.loads(z)
            return Response({"Response": "Please input Scale Id in payload", "Avalaible Scales": z["data"]},
                                status=status.HTTP_200_OK)
        else:
            field_add = {"_id": id}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale",
                                     "1093", "ABCDE", "fetch",
                                     field_add, "nil")
            data = json.loads(x)
            print(data, "data\n\n")
            if data.get('data') == []:
                return Response({"Error": "Scale Response does not exist."}, status=status.HTTP_400_BAD_REQUEST)            
            return Response({"data": data['data']}, status=status.HTTP_200_OK)
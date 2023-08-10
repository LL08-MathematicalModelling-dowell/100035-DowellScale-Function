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
    global field_add,x
    required_fields = ['sort_order', 'statements', 'product_name', 'scalecolor', 'fontstyle', 'fontcolor', 'user', 'name' ]

    if request.method == 'POST':
        payload = request.data
        for field in required_fields:
            if field not in payload:
                return JsonResponse({"Error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

        sort_order = payload['sort_order']
        if sort_order not in ['random', 'alphabetical', 'custom', 'custom_descending']:
            return JsonResponse({"Error": "Invalid sort order"}, status=status.HTTP_400_BAD_REQUEST)

        statements = payload['statements']
        if sort_order == 'random':
            statements = dowellshuffling_function(statements)
        elif sort_order == 'alphabetical':
            statements.sort()
        elif sort_order in ['custom', 'custom_descending']:
            if not all(isinstance(i, dict) for i in statements):
                return JsonResponse({"Error": "Statements must be dictionaries for custom sort orders"},
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
            "Scale_id": inserted_id,
            "event_id": eventID['event_id'],
            "product_name": payload["product_name"],
            "sort_order": sort_order,
            "settings": {
                "scalecolor": payload["scalecolor"],
                "fontstyle": payload["fontstyle"],
                "fontcolor": payload["fontcolor"],
                "statements": statements
            }
        }

        return JsonResponse({"Response": show_response}, status=status.HTTP_201_CREATED)

    if request.method == 'GET':
        payload = request.data
        if 'scale_id' not in payload:
            return JsonResponse({"Error": "Missing required field: scale_id"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            field_add = {"_id": payload["scale_id"]}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                                 field_add, "nil")
            x = json.loads(x)
            if x["error"]:  # You might need to modify this condition based on how your connection function handles non-existing scales
                z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                     "fetch",
                                     {"settings.scaletype": "qsort"}, "nil")

                z = json.loads(z)
                return JsonResponse({"Response": x, "Avalaible Scales": z["data"]}, status=status.HTTP_200_OK)
        return JsonResponse({"Success": x, "data": field_add}, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        fields = ['sort_order', 'scale_id', 'product_name', 'scalecolor', 'fontstyle', 'fontcolor']
        payload = request.data
        for field in fields:
            if field not in payload:
                return JsonResponse({"Error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

        field_add = {"scale_id": payload["id"]}

        update_field = {
            "sort_order": payload["sort_order"],
            "scalecolor": payload["scalecolor"],
            "fontstyle": payload["fontstyle"],
            "fontcolor": payload["fontcolor"]
        }

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                             field_add, update_field)

        return JsonResponse({"Success": "Settings were successfully updated", "data": field_add},
                            status=status.HTTP_200_OK)


@api_view(['POST', 'GET'])
def ResponseAPI(request):
    required_fields = ['disagree', 'neutral', 'agree', 'sort_order', 'product_name', 'scalecolor', 'fontstyle', 'fontcolor']

    if request.method == 'POST':
        payload = request.data
        for field in required_fields:
            if field not in payload:
                return JsonResponse({"Error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

        # Define fixed pile ranges
        pile_ranges = {
            "disagree": [-5, -4, -3, -2, -1],
            "neutral": [0],
            "agree": [1, 2, 3, 4, 5]
        }

        # Function to assign statements to piles and calculate scores
        def assign_to_piles(statements, pile_range):
            if len(statements) != sum([2 if score in [-5, 5] else 3 if score in [-4, 4] else 4 if score in [-3,
                                                                                                            3] else 5 if score in [
                -2, 2] else 6 if score in [-1, 1] else 7 for score in pile_range]):
                raise ValueError("Invalid number of statements for piles")

            distribution = {
                -5: 2, -4: 3, -3: 4, -2: 5, -1: 6,
                0: 7,
                1: 6, 2: 5, 3: 4, 4: 3, 5: 2
            }

            scores = []
            count = 0
            for score in pile_range:
                for _ in range(distribution[score]):
                    scores.append(score)
                    count += 1

            if count != len(statements):
                raise ValueError("Mismatch in statement count and score distribution")

            return scores

        # Iterate through groups (disagree, neutral, agree) and calculate scores
        results = {}
        for group, group_data in payload.items():
            if group in ["disagree", "neutral", "agree"]:
                statements = group_data['statements']
                scores = assign_to_piles(statements, pile_ranges[group])
                results[group.capitalize()] = {'statements': statements, 'scores': scores}

        # Other payload information
        user_info = {key: value for key, value in payload.items() if key not in ["disagree", "neutral", "agree"]}

        field_add = {"scale_id": payload["scale_id"]}
        update_field = {"data": results}

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                             field_add, update_field)

        user_info['results'] = results

        data_dict = json.loads(x)
        print(data_dict)
        if data_dict['isSuccess'] == 'true' or data_dict['isSuccess'] == True:

            results = move_last_to_start(user_info)
            return JsonResponse({"Success": results}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"Error": "Invalid Dowell Response"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        payload = request.data
        if 'scale_id' not in payload:
            return JsonResponse({"Error": "Missing required field: scale_id"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            field_add = {"_id": payload["scale_id"]}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                                 field_add, "nil")
            x = json.loads(x)
            if x[
                "error"]:  # You might need to modify this condition based on how your connection function handles non-existing scales
                z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                     "fetch",
                                     {"settings.scaletype": "qsort"}, "nil")

                z = json.loads(z)
                return JsonResponse({"Response": x, "Avalaible Scales": z["data"]}, status=status.HTTP_200_OK)
        return JsonResponse({"Success": x, "data": field_add}, status=status.HTTP_200_OK)


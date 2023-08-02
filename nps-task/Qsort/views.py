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
def qsort_analysis(request):
    if request.method == 'POST':
        # Extract the statements from the payload
        payload = request.data
        print(payload)
        statements = payload["statements"]

        # Sort the statements based on the sorting order (ascending or descending)
        sort_order = payload["sort_order"]
        if sort_order.lower() == "ascending":
            sorted_statements = sorted(statements, key=lambda x: list(x.values())[0])
        elif sort_order.lower() == "descending":
            sorted_statements = sorted(statements, key=lambda x: list(x.values())[0], reverse=True)
        else:
            raise ValueError("Invalid sort order. It should be 'ascending' or 'descending'.")

        # Calculate the number of statements and categories
        num_statements = len(statements)
        num_categories = 5  # Number of categories in a 5-point QSort scale

        # Determine the category index and label for each statement
        categories = {}
        category_labels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
        for idx, statement in enumerate(sorted_statements):
            normalized_score = (list(statement.values())[0] / 10) * (num_categories - 1)
            category_index = round(normalized_score)
            categories[list(statement.keys())[0]] = {
                "category_index": category_index,
                "category_label": category_labels[category_index]
            }

        eventID = get_event_id()

        field_add = {
            "event_id": eventID,
            "product_name": payload["product_name"],
            "sort_order": payload["sort_order"],
            "scalecolor": payload["scalecolor"],
            "fontstyle": payload["fontstyle"],
            "fontcolor": payload["fontcolor"],
            "statements": payload["statements"],
            "categories": categories
        }

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                             field_add, "nil")
        data_dict = json.loads(x)

        inserted_id = data_dict["inserted_id"]
        show_response = {
            "Scale_id": inserted_id,
            "event_id": eventID['event_id'],
            "product_name": payload["product_name"],
            "sort_order": payload["sort_order"],
            "settings": {
                "scalecolor": payload["scalecolor"],
                "fontstyle": payload["fontstyle"],
                "fontcolor": payload["fontcolor"],
                "statements": payload["statements"],
                "categories": categories
            }
        }

        return JsonResponse({"Response":show_response}, status=status.HTTP_200_OK)


    elif request.method == 'PUT':
        payload = request.data
        print(payload)

        field_add = {"scale_id": payload["id"]}

        update_field = {
            "sort_order": payload["sort_order"],
            "scalecolor": payload["scalecolor"],
            "fontstyle": payload["fontstyle"],
            "fontcolor": payload["fontcolor"]
        }

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                             field_add, update_field)

        print(x)

        # result = json.loads(x)

        return JsonResponse({"Success": x, "data": field_add}, status=status.HTTP_200_OK)
    elif request.method == 'GET':
        payload = request.data
        field_add = {"_id": payload["id"]}

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                             field_add, "nil")

        print(x)

        # result = json.loads(x)

        return JsonResponse({"Success": x, "data": field_add}, status=status.HTTP_200_OK)
        

@api_view(['GET', 'POST', 'PUT'])
def CreateScale(request):
    if request.method == 'POST':
        payload = request.data
        print(payload)

        num_statements = len(payload['statements'])
        if num_statements < 60 or num_statements > 140:
            return JsonResponse({"Error": "Number of statements must be between 60 and 140"}, status=status.HTTP_400_BAD_REQUEST)

        sort_order = payload['sort_order']
        if sort_order not in ['random', 'alphabetical', 'custom']:
            return JsonResponse({"Error": "Invalid sort order"}, status=status.HTTP_400_BAD_REQUEST)

        statements = payload['statements']
        if sort_order == 'random':
            statements = dowellshuffling_function(statements)
        elif sort_order == 'alphabetical':
            statements.sort()
        elif sort_order == 'custom':
            # Here you might want to have a separate key for ID mapping if custom sorting is needed
            statements.sort(key=lambda x: x['id'])

        eventID = get_event_id()

        field_add = {
            "event_id": eventID,
            "product_name": payload["product_name"],
            "sort_order": sort_order,
            "scalecolor": payload["scalecolor"],
            "fontstyle": payload["fontstyle"],
            "fontcolor": payload["fontcolor"],
            "statements": statements
        }

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                             field_add, "nil")

        print(x)
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

        return JsonResponse({"Response": show_response}, status=status.HTTP_200_OK)

    if request.method == 'GET':
        payload = request.data
        print(payload)

        field_add = {"_id": payload["id"]}

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                             field_add, "nil")

        print(x)

        return JsonResponse({"Success": x, "data": field_add}, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        payload = request.data
        print(payload)

        field_add = {"scale_id": payload["id"]}

        update_field = {
            "sort_order": payload["sort_order"],
            "scalecolor": payload["scalecolor"],
            "fontstyle": payload["fontstyle"],
            "fontcolor": payload["fontcolor"]
        }

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                             field_add, update_field)

        print(x)


        return JsonResponse({"Success": x, "data": field_add}, status=status.HTTP_200_OK)

@api_view(['POST'])
def ResponseAPI(request):
    if request.method == 'POST':
        payload = request.data

        # Define fixed pile ranges
        pile_ranges = {
            "disagree": [-5, -4, -3, -2, -1],
            "neutral": [0],
            "agree": [1, 2, 3, 4, 5]
        }

        # Function to assign statements to piles and calculate scores
        def assign_to_piles(statements, pile_range):
            if len(statements) < len(pile_range):
                raise ValueError("Invalid number of statements for piles")

            scores = []
            pile_size = len(statements) // len(pile_range)
            for i, statement in enumerate(statements):
                pile_index = i // pile_size
                if pile_index >= len(pile_range):
                    pile_index = len(pile_range) - 1
                score = pile_range[pile_index]
                scores.append(score)
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


# save_data = CreateScale
# assign_statements = ResponseAPI



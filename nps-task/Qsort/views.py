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
            print(f"Checking for {field}")
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

        return JsonResponse({"Response": show_response}, status=status.HTTP_201_CREATED)

    if request.method == 'GET':
        payload = request.data
        if 'scale_id' not in payload:
            z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "fetch",
                                 {"settings.scaletype": "qsort"}, "nil")

            z = json.loads(z)
            return JsonResponse({"Response": "Please input Scale Id in payload", "Avalaible Scales": z["data"]}, status=status.HTTP_200_OK)
        else:
            field_add = {"_id": payload["scale_id"]}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                                 field_add, "nil")
            x = json.loads(x)
            print(x)
            try:
                if x["error"]:  # You might need to modify this condition based on how your connection function handles non-existing scales
                    z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                         "fetch",
                                         {"settings.scaletype": "qsort"}, "nil")

                    z = json.loads(z)
                    return JsonResponse({"Response": x, "Avalaible Scales": z["data"]}, status=status.HTTP_200_OK)
            except:
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
    payload = request.data

    if request.method == 'POST':
        field_add = {"_id": payload["scale_id"]}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                             field_add, "nil")
        x = json.loads(x)

        try:
            if x["error"]:  # You might need to modify this condition based on how your connection function handles non-existing scales
                return JsonResponse({"Error": "Scale does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            required_fields = ['disagree', 'neutral', 'agree', 'sort_order', 'product_name', 'scalecolor', 'fontstyle', 'fontcolor']
            print(sum(
                [len(data["statements"]) for key, data in payload.items() if key in ["disagree", "neutral", "agree"]]))
            total_statements = sum(
                [len(data["statements"]) for key, data in payload.items() if key in ["disagree", "neutral", "agree"]])

            if not total_statements in range(60, 141):
                return JsonResponse({"Error": "Invalid number of total statements. Must be between 60 and 140 inclusive."},
                                    status=status.HTTP_400_BAD_REQUEST)
            # Check for continuous card numbers
            all_cards = []
            for group in ["disagree", "neutral", "agree"]:
                if group in payload:
                    all_cards.extend([stmt["card"] for stmt in payload[group]['statements']])
            all_cards = sorted(list(map(int, all_cards)))  # Convert to integers and sort

            if all_cards != list(range(1, total_statements + 1)):
                return JsonResponse({"Error": "Card numbers are not continuous or missing."},
                                    status=status.HTTP_400_BAD_REQUEST)

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
                                           key=lambda x: str(x['card']).split('-')[1] if '-' in str(x['card']) else x[
                                               'card'])
                print(statements)
                # Assign scores to statements based on their card numbers, but maintain the original order for output
                scored_statements = [{'card': s['card'], 'statement': s['text'], 'score': None} for s in statements]

                for score in pile_range:
                    for _ in range(distribution[score]):
                        statement = sorted_statements.pop(0)
                        index = next((i for i, s in enumerate(scored_statements) if s['card'] == statement['card']), None)
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
            user_info = {key: value for key, value in payload.items() if key not in ["disagree", "neutral", "agree"]}
            user_info['results'] = results

            field_add = {"scale_id": payload["scale_id"]}
            print(field_add, "=====================")
            update_field = {"data": user_info}
            print(update_field, "=====================")

            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                 field_add, update_field)


            data_dict = json.loads(x)
            print(data_dict, "-=098o78675476890-9877+++++++++++++++++++++")
            if data_dict['isSuccess'] == 'true' or data_dict['isSuccess'] == True:

                results = move_last_to_start(user_info)
                return JsonResponse({"Success": results}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"Error": "Invalid Dowell Response"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        payload = request.data
        if 'scale_id' not in payload:
            z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "fetch",
                                 {"settings.scaletype": "qsort"}, "nil")

            z = json.loads(z)
            return JsonResponse({"Response": "Please input Scale Id in payload", "Avalaible Scales": z["data"]}, status=status.HTTP_200_OK)
        else:
            field_add = {"_id": payload["scale_id"]}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                                 field_add, "nil")
            x = json.loads(x)

            try:
                # You might need to modify this condition based on how your connection function handles non-existing
                # scales
                if x["error"]:
                    z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                         "fetch",
                                         {"settings.scaletype": "qsort"}, "nil")

                    z = json.loads(z)
                    return JsonResponse({"Response": x, "Avalaible Scales": z["data"]}, status=status.HTTP_200_OK)
            except:
                return JsonResponse({"Success": x, "data": field_add}, status=status.HTTP_200_OK)


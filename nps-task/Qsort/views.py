import json

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


# Create your views here.

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

        # Create a dictionary representing the QSort analysis result
        qsort_result = {
            "user": payload["user"],
            "name": payload["name"],
            "id": payload["id"],
            "product_name": payload["product_name"],
            "sort_order": sort_order,
            "scalecolor": payload["scalecolor"],
            "fontstyle": payload["fontstyle"],
            "fontcolor": payload["fontcolor"],
            "categories": categories,
        }

    elif request.method == 'PUT':
        qsort_result = {
        "user": "user",
        "name": "name",
        "id": "id",
        "product_name": "product_name",
        "sort_order": "sort_order",
        "scalecolor": "scalecolor",
        "fontstyle": "fontstyle",
        "fontcolor": "fontcolor",

        }
    else:
        qsort_result = {
            "user": "user",
            "name": "name",
            "id": "id",
            "product_name": "product_name",
            "sort_order": "sort_order",
            "scalecolor": "scalecolor",
            "fontstyle": "fontstyle",
            "fontcolor": "fontcolor",

        }
        
    return JsonResponse({"Response":qsort_result}, status=status.HTTP_200_OK)

@api_view(['GET', 'POST', 'PUT'])
def save_data(request):
    if request.method == 'POST':
        # Extract the statements from the payload
        payload = request.data
        print(payload)

        eventID = get_event_id()

        field_add = {
            "event_id": eventID,
            "product_name": payload["product_name"],
            "sort_order": payload["sort_order"],
            "scalecolor": payload["scalecolor"],
            "fontstyle": payload["fontstyle"],
            "fontcolor": payload["fontcolor"],
            "statements": payload["statements"]
        }

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                             field_add, "nil")

        print(x)

        # result = json.loads(x)

        return JsonResponse({"Response":x}, status=status.HTTP_200_OK)

    if request.method == 'GET':
        # Extract the statements from the payload
        payload = request.data
        print(payload)

        field_add = { "_id": payload["id"] }

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                             field_add, "nil")

        print(x)

        # result = json.loads(x)

        return JsonResponse({"Response":x}, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        # Extract the statements from the payload
        payload = request.data
        print(payload)

        field_add = { "scale_id": payload["id"] }

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

        return JsonResponse({"Response":x}, status=status.HTTP_200_OK)



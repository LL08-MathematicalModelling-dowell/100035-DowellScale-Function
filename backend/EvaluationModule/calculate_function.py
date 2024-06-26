from collections import defaultdict

import requests
import random
import json
from rest_framework.decorators import api_view
import requests

# dowell API
url = 'http://uxlivinglab.pythonanywhere.com/'


def dowellconnection(cluster, platform, database, collection, document, team_member_ID, function_ID, command, field,
                     update_field):
    data = {
        "cluster": cluster,
        "platform": platform,
        "database": database,
        "collection": collection,
        "document": document,
        "team_member_ID": team_member_ID,
        "function_ID": function_ID,
        "command": command,
        "field": field,
        "update_field": update_field
    }
    headers = {'content-type': 'application/json'}
    try:
        response = requests.post(url, json=data, headers=headers)
        return response.json()
    except:
        return "check your connectivity"


"""
    This function calculates the total score for a given document number and product name.
    It fetches data using the Dowell API, filters out the relevant document, and sums up the
    scores for the "nps scale".
"""


def calculate_total_score(doc_no=None, product_name=None):
    try:
        field_add = {"brand_data.product_name": product_name}
        response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                         "1094", "ABCDE", "fetch", field_add, "nil")
        data = json.loads(response_data)["data"]
        """
        This line below 'all_scales = [x for x in data if x['score'][0]['instance_id'].split("/")[0] == doc_no]'
        all_scales is a list comprehension which iterates over the data list and checks if the first 
        segment (before the first '/') of the instance_id from the first score equals doc_no. If it does, 
        the current item x is included in the all_scales list.
        """
        all_scales = [x for x in data if x['score'][0]['instance_id'].split("/")[0] == doc_no]

        print(f"\n\nall_scales: {all_scales}\n\n")
        dat = [x['score'][0]['score'] for x in all_scales if x["scale_data"]["scale_type"] == "nps scale"]
        print(f"\n\ndata  {dat}\n\n")
        """
        Then this return statement then uses all_scales to return a new list containing score values
        from items where the scale_type equals "nps scale
        """
        return [x['score'][0]['score'] for x in all_scales if x["scale_data"]["scale_type"] == "nps scale"]
    except Exception as e:
        raise RuntimeError("Error calculating total score.") from e
# Statricks API
def stattricks_api(title, process_id, process_sequence_id, series, seriesvalues):
    url = "https://100004.pythonanywhere.com/processapi"
    payload = {
        "title": title,
        "Process_id": process_id,
        "processSequenceId": process_sequence_id,
        "series": series,
        "seriesvalues": seriesvalues
    }
    response = requests.post(url, json=payload)
    return response.json()


# Statricks API GET
def stattricks_api_get(process_id):
    url = "https://100004.pythonanywhere.com/processapi"

    payload = {
        "Process_id": process_id
    }

    response = requests.get(url, json=payload)

    return response.json()


"""
    Get the results of scores through calling the calculate_total_score function and using the statricks API to get the results
"""


def Evaluation_module(process_id, doc_no=None, product_name=None):
    return stattricks_api("evaluation_module", process_id, 16, 3,
                          {"list1": calculate_total_score(doc_no, product_name)})


"""
    This function uses the Dowell API to fetch data from the database for a specific product name.
    The result is then returned as a Python dictionary.
"""


def fetch_data(product_name):
    field_add = {"brand_data.product_name": product_name}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                     "1094", "ABCDE", "fetch", field_add, "nil")
    return json.loads(response_data)["data"]


"""
    This function takes the fetched data and a document number as input. It processes the data to collect
    scores for a particular document number and returns a dictionary where keys are scale types and values
    are lists of corresponding scores.
"""


def process_data(data, doc_no=None):
    """
    This line below
    'all_scales = [x for x in data if x['score'][0]['instance_id'].split("/")[-1] == doc_no]'
    collects all the elements from data where the last segment (after the last '/')
    of the instance_id from the first score equals doc_no
    """
    all_scales = []
    if doc_no is None:
        for i in data:
            all_scales.append(i)
    else:
        all_scales = [int(x) for x in data if int(x['score']['instance_id'].split("/")[-1]) == int(doc_no)]
    print(f"\n\nall_scales: {all_scales}.................\n\n")

    scores = defaultdict(list)
    nps_categories = []
    for x in all_scales:
        scale_type = x["scale_data"]["scale_type"]
        print(f"\n\nscale_type: {scale_type}.................\n\n")
        score = x['score']['score']
        print(f"\n\nscore: {score}.................\n\n")
        scores[scale_type].append(int(score))
        scores[scale_type].append(int(score))
        if scale_type == "nps scale":
            category = x['score']['category']
            nps_categories.append(category)

    nps_scale_data = calculate_nps_category(nps_categories)
    return scores, nps_scale_data


"""
    Generates Random Number for the document to show API results using Process ID 
"""


def calculate_nps_category(categories):
    promoters = categories.count("Promoter")
    detractors = categories.count("Detractor")
    passives = categories.count("Neutral")

    total_responses = len(categories)

    if total_responses == 0:
        return "N/A"  # Avoid division by zero

    promoters_percentage = (promoters / total_responses) * 100
    detractors_percentage = (detractors / total_responses) * 100
    passive_percentage = (passives / total_responses) * 100

    net_promoter_score = promoters_percentage - detractors_percentage

    if 1 <= net_promoter_score <= 100:
        overall_nps_category = "majorly promoters"
    elif -100 <= net_promoter_score <= -1:
        overall_nps_category = "majorly detractors"
    elif net_promoter_score == 0:
        overall_nps_category = "balanced"
    else:
        overall_nps_category = "N/A"  # Handle cases outside defined ranges

    response = {
        "net_promoter_score": net_promoter_score,
        "promoters_percentage": promoters_percentage,
        "passives_percentage": passive_percentage,
        "detractors_percentage": detractors_percentage,
        "overall_nps_category": overall_nps_category
    }
    return response


def calculate_stapel_scale_category(responses):
    # Count the number of positive and negative responses
    positive_responses = sum(1 for response in responses if response > 0)
    negative_responses = sum(1 for response in responses if response < 0)

    # Calculate the total number of responses
    total_responses = len(responses)

    # Calculate the Positive Responses Percentage and Negative Responses Percentage
    positive_percentage = (positive_responses / total_responses) * 100
    negative_percentage = (negative_responses / total_responses) * 100

    # Determine the Stapel Category based on average score
    average_score = sum(responses) / total_responses
    if average_score > 0:
        stapel_category = "majorly positive"
    elif average_score < 0:
        stapel_category = "majorly negative"
    else:
        stapel_category = "neutral"

    response = {
        "average_score": average_score,
        "positives_percentage": positive_percentage,
        "negatives_percentage": negative_percentage,
        "overall_stapel_category": stapel_category
    }
    return response


def generate_random_number():
    min_number = 10 ** 2
    max_number = 10 ** 6 - 1
    return random.randint(min_number, max_number)

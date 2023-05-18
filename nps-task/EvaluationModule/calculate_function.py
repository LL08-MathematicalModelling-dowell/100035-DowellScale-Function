from collections import defaultdict

import requests
import random
import json
from rest_framework.decorators import api_view
import requests


# dowell API
url = 'http://uxlivinglab.pythonanywhere.com/'
def dowellconnection(cluster,platform,database,collection,document,team_member_ID,function_ID,command,field,update_field):
    data={
      "cluster": cluster,
      "platform": platform,
      "database": database,
      "collection": collection,
      "document": document,
      "team_member_ID": team_member_ID,
      "function_ID": function_ID,
      "command": command,
      "field": field,
      "update_field":update_field
       }
    headers = {'content-type': 'application/json'}
    try :
      response = requests.post(url, json=data,headers=headers)
      return response.json()
    except:
      return "check your connectivity"


#This function calculates the total score for a given document number and product name.
# It fetches data using the Dowell API, filters out the relevant document, and sums up the
# scores for the "nps scale".
#@api_view(['GET', ])
def calculate_total_score(doc_no=None, product_name=None):
    try:
        field_add = {"brand_data.product_name": product_name}
        response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094", "ABCDE", "fetch", field_add, "nil")
        data = json.loads(response_data)["data"]
        all_scales = [x for x in data if x['score'][0]['instance_id'].split("/")[0] == doc_no]
        return [x['score'][0]['score'] for x in all_scales if x["scale_data"]["scale_type"] == "nps scale"]
    except Exception as e:
        raise RuntimeError("Error calculating total score.") from e


# Statricks API
def stattricks_api(title, process_id, process_sequence_id, series, seriesvalues):
    url = "https://100004.pythonanywhere.com/api"

    payload = {
        "title": title,
        "Process_id": process_id,
        "processSequenceId": process_sequence_id,
        "series": series,
        "seriesvalues": seriesvalues
    }

    response = requests.post(url, json=payload)

    return response.json()

# Get the results of scores through calling the calculate_total_score function and using the statricks API to get the results
def Evaluation_module(process_id, doc_no=None, product_name=None):
    return stattricks_api("evaluation_module", process_id, 16, 3, {"list1": calculate_total_score(doc_no, product_name)})

#This function uses the Dowell API to fetch data from the database for a specific product name.
# The result is then returned as a Python dictionary.
def fetch_data(product_name):
    field_add = {"brand_data.product_name": product_name}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                      "1094", "ABCDE", "fetch", field_add, "nil")
    return json.loads(response_data)["data"]

#This function takes the fetched data and a document number as input. It processes the data to collect
# scores for a particular document number and returns a dictionary where keys are scale types and values
# are lists of corresponding scores.
def process_data(data, doc_no):
    all_scales = [x for x in data if x['score'][0]['instance_id'].split("/")[-1] == doc_no]
    scores = defaultdict(list)
    for x in all_scales:
        scale_type = x["scale_data"]["scale_type"]
        score = x['score'][0]['score']
        scores[scale_type].append(score)
    return scores

# Generates Random Number for the document to show API results using Process ID 
def generate_random_number():
    min_number = 10 ** 2
    max_number = 10 ** 6 - 1
    return random.randint(min_number, max_number)
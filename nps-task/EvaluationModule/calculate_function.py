from collections import defaultdict

import requests
import random
import json
from rest_framework.decorators import api_view

import requests
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

#@api_view(['GET', ])
def calculate_total_score(doc_no=None, product_name=None):
    try:
        field_add = {"brand_data.product_name": product_name}
        response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
            "1094", "ABCDE", "fetch", field_add, "nil")
        data = json.loads(response_data)["data"]
        # loop over token find the one with matching instance = document
        all_scales = []
        if len(data) != 0:
            for x in data:
                print(x)
                instance_id = x['score'][0]['instance_id'].split("/")[0]
                print("Instance_ID",instance_id)

                if instance_id == doc_no:  # document_number
                    all_scales.append(x)

        all_scores = []
        nps_scales = 0
        nps_score = 0
        for x in all_scales:
            scale_type = x["scale_data"]["scale_type"]  # nps/stapel/lite
            if scale_type == "nps scale":
                score = x['score'][0]['score']
                all_scores.append(score)
                nps_score += score
                nps_scales += 1
    except:
        return print({"error": "Please try again"})
    # return print({"All_scores": all_scores, f"Total_score for document {doc_no}": nps_score})
    print("all_scores", all_scores)
    return all_scores


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
    print("\n\nstattrick response", response, "\n\n")

    return response.json()


def Evaluation_module(process_id,doc_no=None, product_name=None):
    title = "evaluation_module"
    process_id = process_id
    process_sequence_id = 16 # like process id, depend on workflow process
    series = 3
    seriesvalues = {
        "list1": calculate_total_score(doc_no, product_name),
    }

    result = stattricks_api(title, process_id, process_sequence_id, series, seriesvalues)
    print(result)

    return result

def fetch_data(product_name):
    field_add = {"brand_data.product_name": product_name}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                      "1094", "ABCDE", "fetch", field_add, "nil")
    return json.loads(response_data)["data"]

def process_data(data, doc_no):
    all_scales = [x for x in data if x['score'][0]['instance_id'].split("/")[-1] == doc_no]
    scores = defaultdict(list)
    for x in all_scales:
        print(x, "x\n\n")
        scale_type = x["scale_data"]["scale_type"]
        score = x['score'][0]['score']
        scores[scale_type].append(score)
    print(scores, "scores\n\n")
    return scores

def generate_random_number():
    min_number = 10 ** 2
    max_number = 10 ** 6 - 1
    return random.randint(min_number, max_number)
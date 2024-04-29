import requests
import json
import numpy as np

from collections import Counter
from scipy.stats import chi2_contingency , ttest_ind

from EvaluationModule.calculate_function import dowellconnection
from addons.db_operations import datacube_db_response

from .exceptions import NoScaleResponseFound


likert_label_map = {
        2: {
            0 : "No",
            1 : "Yes"
        },
        3: {
            0 : "Disagree",
            1 : "Neutral",
            2 : "Agree"
        },
        4: {
            0 : "Strongly Disagree",
            1 : "Disagree",
            2 : "Agree",
            3 : "Strongly Agree",
        },
        5: {
            0 : "Strongly Disagree",
            1 : "Disagree",
            2 : "Neutral",
            3 : "Agree",
            4 : "Strongly Agree",
        },
        7: {
            0 : "Strongly Disagree",
            1 : "Disagree",
            2 : "Somewhat Disagree",
            3 : "Neutral",
            4 : "Somewhat Agree",
            5 : "Agree",
            6 : "Strongly Agree",
        },
        9: {
            0 : "Strongly Disagree",
            1 : "Disagree",
            2 : "Moderately Disagree",
            3 : "Mildly Disagree",
            4 : "Neutral",
            5 : "Mildly Agree",
            6 : "Moderately Agree",
            7 : "Agree",
            8 : "Strongly Agree",
        },
    }

def fetch_scale_response(field_add : dict):

    result = dowellconnection(
                "dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                            "1094", "ABCDE", "fetch", field_add , "nil"
        )
        
    try:
                                            
            
        result= json.loads(result) 

        if not isinstance(result , dict):
            raise NoScaleResponseFound("Error while fetching data from scale_reports")
        
        return  result

    except:
            raise NoScaleResponseFound("Error while fetching scale responses.")

def fetch_scale_response_addons(scale_id : str, api_key: str):
    result = datacube_db_response(api_key=api_key, scale_id=scale_id,operation="fetch")
    try:
        if not isinstance(result , dict):
            raise NoScaleResponseFound("Error while fetching data from scale_reports")
        return result
    except:
            raise NoScaleResponseFound("Error while fetching scale responses.")


def targeted_population(database_details, time_input , distribution_input , stage_input_list ,  binomial = None , bernoulli = None):

    number_of_variables = 1

    request_data={
        'database_details': database_details,
        'distribution_input': distribution_input,
        'number_of_variable':number_of_variables,
        'stages':stage_input_list if stage_input_list else [],
        'time_input':time_input,
    }

    if distribution_input['bernoulli'] == 1:

        request_data["bernoulli"] = bernoulli

    if distribution_input['binomial'] == 1:
        request_data["binomial"] = binomial


    headers = {'content-type': 'application/json'}

    response = requests.post("http://100032.pythonanywhere.com/api/targeted_population/", json=request_data , headers=headers)

    return response.json()

def get_all_scores(scales_data , score_type = "int"):
    """
        Gets all the scores irrespectives of the scores on the 
    """

    all_scores = []
    for x in scales_data["data"]: 
        score = x.get("score", None)

        if not score:
            continue

        score = score.get("score") or isinstance(x.get("score") , dict) or x["score"][0].get('score') or score.get("scorescale_id")

        if not score:
            continue

        if score_type != "int":
            all_scores.append(score)
        else:
            all_scores.append(int(score))
    
    return all_scores

def get_positions(scales_data):
    all_positions=[]
    for x in scales_data["data"]:
        if x.get("positions"):
            all_positions.append(x["positions"])

    return all_positions


def mode(data):
    counter = Counter(data)
    mode_value = max(counter, key=counter.get)
    return mode_value

def median(data):
    sorted_data = sorted(data)
    n = len(sorted_data)

    if n % 2 == 0:
        # If the list has an even number of elements, average the middle two
        median_value = (sorted_data[n // 2 - 1] + sorted_data[n // 2]) / 2
    else:
        # If the list has an odd number of elements, take the middle one
        median_value = sorted_data[n // 2]

    return median_value

def find_range(data):
    return max(data) - min(data)


def get_percentage_occurrence(counter_dict):
    total_items = sum(counter_dict.values())

    percentage_dict = {}

    for item, count in counter_dict.items():
        percentage = (count / total_items) * 100
        percentage_dict[item] = percentage

    return percentage_dict


def t_test(group1 , group2):
    t_test_p_value , t_statistic = ttest_ind(group1 , group2)
    return {"p_value" : t_test_p_value , "t_statisitic" : t_statistic}

def get_key_by_value(counter_dict , value):
    return list(counter_dict.keys())[list(counter_dict.values()).index(value)]

def chi_square_test(data):
    chi2_stat, p_value, dof, expected = chi2_contingency(data)
    
    return {"chi2_stat" : chi2_stat , "p_value" :  p_value , "dof" : dof , "expected" : expected}

def get_percentile(data):
    percentile_ranges = [25 ,50 , 75]
    return {percentile  : result for result , percentile in zip(np.percentile(data
                                                    , percentile_ranges) , percentile_ranges)}
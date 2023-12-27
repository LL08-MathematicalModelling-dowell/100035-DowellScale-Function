import requests

from collections import Counter


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
    all_scores = []
    for x in scales_data["data"]: 
        score = x.get("score", None)
        if not score:
            continue

        score = score.get("score") if isinstance(x.get("score") , dict) else x["score"][0].get('score')

        if not score:
            continue

        if score_type != "int":
            all_scores.append(score)
        else:
            all_scores.append(int(score))
    
    return all_scores

def convert_all_likert_label(label_selection , labels_list):
    return [convert_likert_label(label_selection , label) for label in labels_list]

def get_percentage_occurrence(counter_dict):
    total_items = sum(counter_dict.values())

    percentage_dict = {}

    for item, count in counter_dict.items():
        percentage = (count / total_items) * 100
        percentage_dict[item] = percentage

    return percentage_dict

def get_key_by_value(counter_dict , value):
    return list(counter_dict.keys())[list(counter_dict.values()).index(value)]

def convert_likert_label(label_selection , label):
    return get_key_by_value(likert_label_map[label_selection] , label)

def likert_scale_report(label_selection , all_scores):
    counts = Counter(all_scores)

    percentage_dict = get_percentage_occurrence(counts)


    return {
        "max_reponse" : get_key_by_value(counts , max(list(counts.values()))),
        "no_of_scores" : len(counts),
        "scale_data" : percentage_dict,
        }





    

import requests
from itertools import chain
from datetime import datetime, timedelta
from functools import partial
from LearningScaleIndex.settings import public_url
import logging
import json 
import requests



def build_urls(channel_instance,payload,instance_idx):
        urls = []
        print(payload)
        settings = payload["settings"]
        scale_range = settings["scale_range"]
        
        for idx in scale_range:
            url = f"{public_url}/addons/create-response/v3/?user={settings['user_type']}&scale_type={settings['scale_category']}&channel={channel_instance['channel_name']}&instance={channel_instance['instances_details'][instance_idx]['instance_name']}&workspace_id={payload['workspace_id']}&username={settings['username']}&scale_id={settings['scale_id']}&item={idx}"
            # url = f"http://127.0.0.1:8000/addons/create-response/v3/?user={settings['user_type']}&scale_type={settings['scale_category']}&channel={channel_instance['channel_name']}&instance={channel_instance['instances_details'][instance_idx]['instance_name']}&workspace_id={payload['workspace_id']}&username={settings['username']}&scale_id={settings['scale_id']}&item={idx}"
            urls.append(url)
        return urls

def generate_urls(payload):
    response = []
    settings = payload["settings"]
    for channel_instance in settings["channel_instance_list"]:
        channel_response = {
            "channel_name": channel_instance["channel_name"],
            "channel_display_name": channel_instance["channel_display_name"],
            "urls": []
        }
        for instance_detail in channel_instance["instances_details"]:
            instance_idx = channel_instance["instances_details"].index(instance_detail)
            instance_response = {
                "instance_name": instance_detail["instance_name"],
                "instance_display_name": instance_detail["instance_display_name"],
                "instance_urls": build_urls(channel_instance, payload,instance_idx)
            }
            channel_response["urls"].append(instance_response)
        response.append(channel_response)
    
    return response


def adjust_scale_range(payload):
    print("Inside adjust_scale_range function")
    settings = payload["settings"]
    scale_type = settings['scale_type']
    print(scale_type)
    print(f"Scale type: {scale_type}")
    
    total_no_of_items = int(settings['total_no_of_items'])
    print(f"Total number of items: {total_no_of_items}")
    print("++++++++++++++")
    if "pointers" in payload:
        pointers = payload['pointers']
    if "axis_limit" in payload:
        axis_limit = payload['axis_limit']
    print(f"Scale type: {scale_type}, Total number of items: {total_no_of_items}")

    if scale_type == 'nps' or scale_type == 'learning_index':
        scale_range = range(0, 11)
        print(scale_range)
        return scale_range

    elif scale_type == 'nps_lite':
        return range(0, 3)
    elif scale_type == 'stapel':
        if 'axis_limit' in payload:
            pointers = int(payload['axis_limit'])
            return chain(range(-axis_limit, 0), range(1, axis_limit + 1))
    elif scale_type == 'likert':
        if 'pointers' in payload:
            pointers = int(payload['pointers'])
            return range(1, pointers + 1)
        else:
            raise ValueError("Number of pointers not specified for Likert scale")
    else:
        raise ValueError("Unsupported scale type")

def scale_type_fn(scale_type, payload):
    print("inside scale type")
    print(payload)
    settings = payload["settings"]
    
    if scale_type == "nps" or scale_type == 'learning_index':
        no_of_items = 11
    elif scale_type == "nps lite":
        no_of_items = 3
    elif scale_type == "likert":
        pointers = settings['pointers']
        no_of_items = pointers
    elif scale_type == "stapel":
        axis_limit = settings["axis_limit"]
        no_of_items = 2 * axis_limit
        print(no_of_items)
    else:
        no_of_items = 11
    return no_of_items

def calcualte_learning_index(score, group_size, learner_category, category):
    print(score,group_size,learner_category)    

    #determine the learner category for the given score
    print(learner_category.items())
    for key, value in learner_category.items():
        if category == key:
            
            learner_category[key] += 1
           
            #calculate percentages for each learner category
            percentages = {key: (value / group_size) * 100 for key, value in learner_category.items()}

            #calculate LLx while avoiding division by zero
            denominator = percentages["reading"] + percentages["understanding"]
            if denominator == 0:
                LLx = (percentages["evaluating"] + percentages["applying"]) 
            else:
                LLx = (percentages["evaluating"] + percentages["applying"]) / denominator

            #identify the learning stage for the control group
            if 0 <= LLx <=1:
                learning_stage = "learning"
            else:
                learning_stage = "applying in context" 

    return percentages, LLx, learning_stage, learner_category

def determine_category(scale_type, item):
    ref = {"nps_lite":{0:"detractor",1:"passive",2:"promoter"},


     "nps":{(range(0,7)):"detractor",(range(7,9)):"passive",(range(9,11)):"promoter"},
     
     "learning_index":{(range(0,3)):"reading",(range(3,5)):"understanding",(range(5,7)):"explaining",(range(7,9)):"evaluating",(range(9,11)):"applying"}
     }
    
    if scale_type != "nps_lite":
        secondary_ref = ref[scale_type]
        for key, value in secondary_ref:
            if item in key:
                return value
    elif scale_type == "nps_lite":
        return ref[scale_type][item]
    else:
        return None
    

    # if scale_type == "nps_lite":
    #     if item == 0:
    #         return "detractor"
    #     elif item == 1:
    #         return "passive"
    #     elif item == 2:
    #         return "promoter"
    # elif scale_type == "nps":
    #     if 0 <= item <= 6:
    #         return "detractor"
    #     elif 7 <= item <= 8:
    #         return "passive"
    #     elif 9 <= item <= 10:
    #         return "promoter"
    # elif scale_type == "learning_index":
    #     if item in range(0, 3):
    #         return "reading"
    #     elif item in range(3, 5):
    #         return "understanding"
    #     elif item in range(5, 7):
    #         return "explaining"
    #     elif item in range(7, 9):
    #         return "evaluating"
    #     elif item in range(9, 11):
    #         return "applying"
    # return None

# Targeted population API
def targeted_population(period,api_key):
    url = "http://100032.pythonanywhere.com/api/targeted_population/v3/?api_key=3db9086b-527f-408b-9fea-ff552160bf40"

    payload = {
                "database_details": {
                "database_name": "datacube",
                "collection": "collection_1",
                "database": "livinglab_scale_response",
                "fields": [
                    "score"
                ]
            },
            "distribution_input": {
                "normal": 1,
                "poisson": 1,
                "binomial": 1,
                "bernoulli": 1
            },
            "number_of_variable": 1,
            "stages": [
            ],
            "time_input": {
                "column_name": "dowell_time.current_time",
                "split": "week",
                "period": period
            }
        }

    response = requests.post(url, json = payload)
    return response.json()

def log_api_downtime(api_name, error_message):
    logger = logging.getLogger('external_api')
    logger.error(f"API '{api_name}' is down: {error_message}")


def dowell_time(timezone):
    url = "https://100009.pythonanywhere.com/dowellclock/"
    payload = json.dumps({
        "timezone":timezone,
        })
    headers = {
        'Content-Type': 'application/json'
        }

    response = requests.request("POST", url, headers=headers, data=payload)

    if response.status_code != 200:
        res= json.loads(response.text)

    else:
        import pytz
        from datetime import datetime   

        timezone = pytz.timezone('Asia/Calcutta')

        current_time = datetime.now(timezone)
        
        res = {"current_time" : current_time.strftime("%Y-%m-%d %H:%M:%S")}

        log_api_downtime("dowell clock" , "Some is bad")

    return res


dowell_time_asian_culta = partial(dowell_time , "Asia/Calcutta")



def get_date_range(period):
    now = datetime.utcnow()
    if period == 'seven_days':
        start_date = now - timedelta(days=7)
    elif period == 'one_month':
        start_date = now - timedelta(days=30)
    elif period == 'one_year':
        start_date = now - timedelta(days=90)
    elif period == 'custom':
        start_date = now - timedelta(days=30)
    else:
        raise ValueError("Invalid time period")
    return start_date.isoformat(), now.isoformat()
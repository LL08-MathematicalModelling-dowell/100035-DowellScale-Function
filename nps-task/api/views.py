import random
import datetime
import json
from nps.dowellconnection import dowellconnection
from nps.eventID import get_event_id
from dowellnps_scale_function.settings import public_url
from django.core.files.storage import default_storage
from concurrent.futures import ThreadPoolExecutor
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response


def compare_event_ids(arr1, arr2):
    for elem in arr1:
        if elem in arr2:
            return True
    return False


def find_category(score):
    if int(score) <= 6:
        category = "Detractor"
    elif int(score) <= 8:
        category = "Neutral"
    elif int(score) < 0 or int(score) > 10:
        return Response({"Error": "Score can be only from 1-10"})
    else:
        category = "Promoter"
    return category


def total_score_fun(id):
    field_add = {"scale_data.scale_id": id}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                     "1094", "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response_data)
    existing_responses = data["data"]

    all_scores = []
    instance_ids = []

    total_score = sum(int(i['score'][0]['score']) for i in data['data'])
    all_scores = [i['score'] for i in data['data']]
    instance_ids = [int(i['score'][0]['instance_id'].split("/")[0])
                    for i in data['data']]

    if total_score == 0 or len(all_scores) == 0:
        overall_category = "No response provided"
        category = "No response provided"
    else:
        overall_category = total_score / len(all_scores)
        category = find_category(overall_category)

    return overall_category, category, all_scores, instance_ids, total_score, existing_responses


@api_view(['POST',])
def custom_configuration_list(request):
    template_id = request.data.get('template_id')
    field_add = {"template_id": template_id}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data",
                                     "1181", "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response_data)
    element_ids = []

    for item in data.get('data', []):
        dic = item.get('custom_input_groupings', {})
        all_values = list(dic.values())
        element_ids.extend(all_values)

    return Response({"data": element_ids})

# Custom configuration api


from concurrent import futures

@api_view(['GET', 'POST', 'PUT'])
def custom_configuration_view(request):
    def execute_api_call(*args):
        # Execute the API call asynchronously
        with futures.ThreadPoolExecutor() as executor:
            response_data = executor.submit(dowellconnection, *args)
            response_data = response_data.result()
        return json.loads(response_data)

    if request.method == 'GET':
        scale_id = request.data.get('scale_id')
        field_add = {"scale_id": scale_id}
        response_data = execute_api_call("dowellscale", "bangalore", "dowellscale",
                                         "custom_data", "custom_data", "1181", "ABCDE", "find", field_add, "nil")
        return Response({"data": response_data})

    elif request.method == "POST":
        template_id = request.data.get('template_id')
        custom_input_groupings = request.data.get('custom_input_groupings')
        scale_id = request.data.get('scale_id')
        scale_label = request.data.get('scale_label')

        try:
            field_add = {"_id": scale_id}
            response_data1 = execute_api_call("dowellscale", "bangalore", "dowellscale",
                                              "scale", "scale", "1093", "ABCDE", "find", field_add, "nil")
            settings_values = response_data1['data']['settings']

            field_add1 = {
                "template_id": template_id,
                "custom_input_groupings": custom_input_groupings,
                "scale_id": scale_id,
                "scale_label": scale_label,
                "default_name": settings_values['name'],
                "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            response_data2 = execute_api_call("dowellscale", "bangalore", "dowellscale",
                                              "custom_data", "custom_data", "1181", "ABCDE", "insert", field_add1, "nil")

            field_add = {"_id": scale_id}
            settings_values['name'] = scale_label
            update_field = {"settings": settings_values}
            response_data3 = execute_api_call("dowellscale", "bangalore", "dowellscale",
                                              "scale", "scale", "1093", "ABCDE", "update", field_add, update_field)

            return Response({"message": response_data3, "data": field_add1})
        except:
            return Response({"message": "Error occured"}, status=status.HTTP_403_FORBIDDEN)

    elif request.method == "PUT":
        scale_id = request.data.get('scale_id')
        field_add = {"scale_id": scale_id}
        response_data = execute_api_call("dowellscale", "bangalore", "dowellscale",
                                         "custom_data", "custom_data", "1181", "ABCDE", "fetch", field_add, "nil")
        settings = response_data['data'][0]
        custom_input_groupings = request.data.get(
            'custom_input_groupings', settings.get('custom_input_groupings'))
        scale_label = request.data.get(
            'scale_label', settings.get('scale_label'))

        try:
            update_field = {
                "custom_input_groupings": custom_input_groupings,
                "scale_id": scale_id,
                "template_id": settings['template_id'],
                "scale_label": scale_label,
                "date_created": settings['date_created'],
                "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            response_data = execute_api_call("dowellscale", "bangalore", "dowellscale",
                                             "custom_data", "custom_data", "1181", "ABCDE", "update", field_add, update_field)

            return Response({"success": "Successfully Updated", "data": update_field})
        except:
            return Response({"message": "Error occured"}, status=status.HTTP_403_FORBIDDEN)

    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)


# CREATE SCALE SETTINGS


@api_view(['POST', 'PUT', 'GET'])
def settings_api_view_create(request):
    def execute_api_call(*args):
        # Execute the API call asynchronously
        with futures.ThreadPoolExecutor() as executor:
            response_data = executor.submit(dowellconnection, *args)
            response_data = response_data.result()
        return json.loads(response_data)

    if request.method == 'GET':
        response = request.data
        if "scale_id" in response:
            scale_id = response['scale_id']
            field_add = {"_id": scale_id}
            response_data = execute_api_call("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE", "find", field_add, "nil")
            settings = response_data['data']['settings']
            template_name = settings["template_name"]
            no_of_scales = int(settings["no_of_scales"])
            urls = [
                f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor"
            ]
            if no_of_scales > 1:
                urls = [
                    f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor/{i}"
                    for i in range(1, no_of_scales + 1)
                ]
            return Response({"data": response_data, "urls": urls})
        else:
            field_add = {"settings.scale-category": "nps scale"}
            response_data = execute_api_call("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE", "fetch", field_add, "nil")
            return Response({"data": response_data})

    elif request.method == 'POST':
        response = request.data
        left = response['left']
        center = response['center']
        right = response['right']
        text = f"{left}+{center}+{right}"
        rand_num = random.randrange(1, 10000)
        name = response['name']
        time = response.get('time', "")
        template_name = f"{name.replace(' ', '')}{rand_num}"
        if time == "":
            time = 0
        eventID = get_event_id()
        field_add = {
            "event_id": eventID,
            "settings": {
                "orientation": response.get('orientation'),
                "scalecolor": response.get('scalecolor'),
                "numberrating": 10,
                "no_of_scales": 1,
                "roundcolor": response.get('roundcolor'),
                "fontcolor": response.get('fontcolor'),
                "fomat": response.get('fomat'),
                "time": time,
                "template_name": template_name,
                "name": name,
                "text": text,
                "left": left,
                "right": right,
                "center": center,
                "allow_resp": False,
                "scale-category": "nps scale",
                "show_total_score": 'true',
                "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        }
        response_data = execute_api_call("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                         "insert", field_add, "nil")
        scale_urls = f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor"
        return Response({"success": response_data, "data": field_add, "scale_urls": scale_urls})

    if request.method == "PUT":
        response = request.data
        scale_id = response['scale_id']
        field_add = {"_id": scale_id}
        response_data = execute_api_call("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                         "find", field_add, "nil")
        settings = response_data['data']['settings']
        left = response.get('left', settings["left"])
        center = response.get('center', settings["center"])
        right = response.get('right', settings["right"])
        text = f"{left}+{center}+{right}"
        name = settings["name"]
        time = response.get('time', settings["time"]) or 0
        template_name = settings["template_name"]
        orientation = response.get('orientation', settings["orientation"])
        scalecolor = response.get('scalecolor', settings["scalecolor"])
        roundcolor = response.get('roundcolor', settings["roundcolor"])
        fontcolor = response.get('fontcolor', settings["fontcolor"])
        fomat = response.get('fomat', settings["fomat"])
        update_field = {
            "settings": {
                "orientation": orientation,
                "scalecolor": scalecolor,
                "numberrating": 10,
                "no_of_scales": settings["no_of_scales"],
                "roundcolor": roundcolor,
                "fontcolor": fontcolor,
                "fomat": fomat,
                "time": time,
                "template_name": template_name,
                "name": name,
                "text": text,
                "left": left,
                "right": right,
                "center": center,
                "scale-category": "nps scale",
                "show_total_score": 'true',
                "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        }
        no_of_scales = int(settings["no_of_scales"])
        urls = [
            f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor/{i}"
            for i in range(1, no_of_scales + 1)
        ] if no_of_scales > 1 else [
            f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor"
        ]
        return Response({"success": "Successful Updated ", "data": update_field, "scale_urls": urls})

    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)


import asyncio


from concurrent.futures import ThreadPoolExecutor
import concurrent.futures

@api_view(['POST'])
def dynamic_scale_instances(request):
    response = request.data
    scale_id = response["scale_id"]
    field_add = {"_id": scale_id}

    x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                         "fetch", field_add, "nil")
    settings_json = json.loads(x)
    settings = settings_json['data'][0]['settings']
    template_name = settings['template_name']
    settings['allow_resp'] = True
    scale_type = settings['scale-category']
    name_url = ""

    if scale_type == "stapel scale":
        name_url = "/stapel/stapel-scale1/"
    elif scale_type == "nps scale":
        name_url = "/nps-scale1/"
    else:
        return Response({"error": "Scale not integrated yet"}, status=status.HTTP_400_BAD_REQUEST)

    instances = settings.get('instances', [])
    start = len(instances) + 1

    if 'no_of_documents' in response:
        no_of_documents = response['no_of_documents'] + start
        for x in range(start, int(no_of_documents)):
            instance = {
                f"document{x}": f"{public_url}{name_url}{template_name}?brand_name=WorkflowAI&product_name=editor/{x}"
            }
            instances.append(instance)
    else:
        instance = {
            f"document{start}": f"{public_url}{name_url}{template_name}?brand_name=WorkflowAI&product_name=editor/{start}"
        }
        instances.append(instance)

    update_field = {
        "settings.no_of_scales": len(instances),
        "settings.instances": instances,
        "settings.allow_resp": True
    }

    with ThreadPoolExecutor() as executor:
        futures = []
        futures.append(executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                       "update", field_add, update_field))
        futures.append(executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                       "fetch", field_add, "nil"))

        results = [future.result() for future in concurrent.futures.as_completed(futures)]
        z, x = results

    settings_json = json.loads(x)
    return Response({"success": z, "response": settings_json['data'][0]['settings']})



@api_view(['GET'])
def calculate_total_score(request, doc_no=None, product_name=None):
    try:
        field_add = {"brand_data.product_name": product_name}
        response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                         "1094", "ABCDE", "fetch", field_add, "nil")
        data = json.loads(response_data)["data"]
        all_scales = [x for x in data if x['score'][0]
                      ['instance_id'].split("/")[0] == doc_no]
        all_scores = []
        nps_scales = 0
        nps_score = 0
        for x in all_scales:
            scale_type = x["scale_data"]["scale_type"]
            if scale_type == "nps scale":
                score = x['score'][0]['score']
                all_scores.append(score)
                nps_score += score
                nps_scales += 1
    except Exception as e:
        return Response({"error": "Please try again"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"All_scores": all_scores, f"Total_score for document {doc_no}": nps_score},
                    status=status.HTTP_200_OK)

# SUMBIT SCALE RESPONSE


@api_view(['POST'])
def nps_response_view_submit(request):
    if request.method == 'POST':
        response = request.data
        try:
            user = response['username']
        except KeyError:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

        scale_id = response['scale_id']
        score = response['score']
        category = find_category(score)
        instance_id = response['instance_id']
        field_add = {"_id": scale_id, "settings.scale-category": "nps scale"}

        default_scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                         "find", field_add, "nil")
        data = json.loads(default_scale)
        print(data)
        if data['data'] is None:
            return Response({"Error": "Scale does not exist"})

        settings = data['data']['settings']
        number_of_scale = settings['no_of_scales']
        scale_id = data['data']['_id']
        overall_category, _, _, _, _, existing_responses = total_score_fun(
            scale_id)
        category = find_category(score)
        responses_id = [c['event_id'] for c in existing_responses if
                        int(c['score'][0]['instance_id'].split("/")[0]) == int(instance_id)]

        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                        "ABCDE", "fetch", {"scale_id": scale_id, "username": user}, "nil")
        user_dets = json.loads(user_details)
        user_ids = [i["event_id"] for i in user_dets['data']]
        check_existance = compare_event_ids(responses_id, user_ids)
        if check_existance:
            return Response({"error": "Scale Response Exists!", "current_score": score, "Category": category},
                            status=status.HTTP_405_METHOD_NOT_ALLOWED)
        event_id = get_event_id()
        score_data = {"instance_id": f"{instance_id}/{number_of_scale}",
                      "score": score, "category": category}
        if int(instance_id) > int(number_of_scale):
            return Response({"Instance doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
        field_add = {"event_id": event_id, "scale_data": {"scale_id": scale_id, "scale_type": "nps scale"},
                     "brand_data": {"brand_name": response["brand_name"], "product_name": response["product_name"]},
                     "score": [score_data]}
        z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                             "ABCDE", "insert", field_add, "nil")
        return Response({"success": z, "score": score_data, "payload": field_add,
                         "url": f"{public_url}/nps-scale1/{settings['template_name']}?brand_name=WorkflowAI&product_name=editor/{response['instance_id']}",
                         "Category": category})
    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)


# GET ALL SCALES


@api_view(['GET', ])
def scale_settings_api_view(request):
    try:
        field_add = {"settings.scale-category": "nps scale"}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                             field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(json.loads(x))


# GET SINGLE SCALE
@api_view(['GET', ])
def single_scale_settings_api_view(request, id=None):
    try:
        # field_add = {"_id": id }
        field_add = {"settings.template_name": id, }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                             "fetch", field_add, "nil")
        settings_json = json.loads(x)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        settings = settings_json['data'][0]['settings']
        no_of_scales = int(settings['no_of_scales'])

        template_name = settings['template_name']
        urls = []
        for i in range(1, no_of_scales + 1):
            url = f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor/{i}"
            urls.append(url)

        return Response({"payload": json.loads(x), "urls": urls})


# GET SINGLE SCALE RESPONSE
@api_view(['GET', ])
def single_scale_response_api_view(request, id=None):
    try:
        field_add = {"_id": id}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                             "1094", "ABCDE", "fetch", field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({"payload": json.loads(x)})


# GET ALL SCALES RESPONSES
@api_view(['GET', ])
def scale_response_api_view(request):
    try:
        # field_add = {}
        field_add = {"scale_data.scale_type": "nps scale", }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                             "1094", "ABCDE", "fetch", field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(json.loads(x))


# All APIS below here are for LIKERT Scales
# CREATE SCALE SETTINGS
"""
@api_view(['POST',])
def likert_settings_api_view_create(request):
    if request.method == 'POST':
        response = request.data
        try:
            user = response['username']
        except:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

        rand_num = random.randrange(1, 10000)
        name = response['name']
        template_name = f"{name.replace(' ', '')}{rand_num}"
        scales = [response.get('scale_choice 0', "None"),
                  response.get('scale_choice 1', "None"),
                  response.get('scale_choice 2', "None"),
                  response.get('scale_choice 3', "None"),
                  response.get('scale_choice 4', "None"),
                  response.get('scale_choice 5', "None"),
                  response.get('scale_choice 6', "None"),
                  response.get('scale_choice 7', "None"),
                  response.get('scale_choice 8', "None")
                  ]

        eventID = get_event_id()

        field_add = {"event_id": eventID,
                     "settings": {"orientation": response['orientation'],
                                  "labelscale": response['labelscale'],
                                  "roundcolor": response['roundcolor'],
                                  "fontcolor": response['fontcolor'],
                                  "labeltype": response['labeltype'],
                                  "time": response['time'],
                                  "template_name": template_name,
                                  "name": response['name'],
                                  "scale-category": "likert scale",
                                  "number_of_scales": response['no_of_scales'],
                                  "scales": scales}}

        print(field_add)
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                             field_add, "nil")

        user_json = json.loads(x)
        details = {"scale_id": user_json['inserted_id'],
                   "event_id": eventID, "username": user}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE",
                                        "insert", details, "nil")
        urls = []
        for i in range(1, response['no_of_scales'] + 1):
            url = f"{public_url}/likert/likert-scale1/{template_name}?brand_name=your_brand&product_name=product_name/{i}"
            urls.append(url)
        return Response({"success": x, "payload": field_add, "scale_urls": urls})
    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)

# SUMBIT SCALE RESPONSE


@api_view(['POST',])
def nps_response_view_submit(request):
    if request.method == 'POST':
        print("Ambrose")

        response = request.data
        try:
            user = response['username']
        except:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

        id = response['id']
        field_add = {"_id": id}
        default = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                   "fetch", field_add, "nil")
        data = json.loads(default)
        x = data['data'][0]['settings']
        number_of_scale = x['no_of_scales']

        eventID = get_event_id()
        score = {
            "instance_id": f"{response['instance_id']}/{number_of_scale}", 'score': response['score']}

        if int(response['instance_id']) > int(number_of_scale):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        field_add = {"event_id": eventID, "scale_data": {"scale_id": id, "scale_type": "nps scale"},
                     "brand_data": {"brand_name": response["brand_name"], "product_name": response["product_name"]},
                     "score": [score]}
        z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                             "ABCDE", "insert", field_add, "nil")
        user_json = json.loads(z)
        details = {"scale_id": user_json['inserted_id'],
                   "event_id": eventID, "username": user}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE",
                                        "insert", details, "nil")
        return Response({"success": z, "payload": field_add, "url": f"{public_url}/nps-scale1/{x['template_name']}?brand_name=your_brand&product_name=product_name/{response['instance_id']}"})
    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)


# GET ALL SCALES
@api_view(['GET',])
def scale_settings_api_view(request):
    try:
        field_add = {}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                             field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(json.loads(x))

# GET SINGLE SCALE


@api_view(['GET',])
def single_scale_settings_api_view(request, id=None):
    try:
        field_add = {"_id": id}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                             "fetch", field_add, "nil")
        settings_json = json.loads(x)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        settings = settings_json['data'][0]['settings']
        no_of_scales = settings['no_of_scales']
        template_name = settings['template_name']
        urls = []
        for i in range(1, no_of_scales + 1):
            url = f"{public_url}/nps-scale1/{template_name}?brand_name=your_brand&product_name=product_name/{i}"
            urls.append(url)
        return Response({"payload": json.loads(x), "urls": urls})

# GET SINGLE SCALE RESPONSE


@api_view(['GET',])
def single_scale_response_api_view(request, id=None):
    try:
        field_add = {"_id": id}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                             "1094", "ABCDE", "fetch", field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({"payload": json.loads(x)})

# GET ALL SCALES RESPONSES


@api_view(['GET',])
def scale_response_api_view(request):
    try:
        field_add = {"settings.scale-category": "likert scale"}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                             "1094", "ABCDE", "fetch", field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(json.loads(x))
"""



@api_view(['POST', 'PUT', 'GET'])
def new_nps_create(request):
    response = request.data
    username = response['username']
    user = response['user']
    left = response['left']
    center = response['center']
    fontstyle = response.get('fontstyle', "Arial, Helvetica, sans-serif")
    right = response['right']
    text = f"{left}+{center}+{right}"
    rand_num = random.randrange(1, 10000)
    name = response['name']
    time = response.get('time', "")
    template_name = f"{name.replace(' ', '')}{rand_num}"
    fomat = response.get('fomat')
    no_of_scales = int(response['no_of_scales'])
    stored_images = {}
    custom_format = {}

    print("+++++++++++++",template_name)

    if no_of_scales > 100 or no_of_scales < 1:
        return Response({"no_of_scales": "Out of range" },status=status.HTTP_400_BAD_REQUEST)

    if fomat == "emoji":
        custom_format = response['custom_format']
    elif fomat == "image":
        image_dict = response.get('images', {})
        def save_image(key, image_data):
            image_path = f'images/{key}.png'  # Define a unique path for each image
            default_storage.save(image_path, image_data)
            stored_images[key] = image_path

        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(save_image, key, image_data) for key, image_data in image_dict.items()]
            # Wait for all image saving tasks to complete
            for future in futures:
                future.result()

    if time == "":
        time = 0
    eventID = get_event_id()
    field_add = {
        "event_id": eventID,
        "settings": {
            "username": username,
            "user":user,
            "orientation": response.get('orientation'),
            "scalecolor": response.get('scalecolor'),
            "numberrating": 10,
            "no_of_scales": no_of_scales,
            "roundcolor": response.get('roundcolor'),
            "fontcolor": response.get('fontcolor'),
            "fomat": fomat,
            "time": time,
            "label_images":stored_images,
            "fontstyle":fontstyle,
            "template_name": template_name,
            "name": name,
            "text": text,
            "left": left,
            "right": right,
            "emoji_format":custom_format,
            "center": center,
            "allow_resp": False,
            "scale-category": "nps scale",
            "show_total_score": 'true',
            "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    }
    def insert_data():
        response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
            "insert", field_add, "nil")
        return response_data

    with ThreadPoolExecutor() as executor:
        future = executor.submit(insert_data)
        response_data = future.result()

    return Response({"success": response_data, "data": field_add})

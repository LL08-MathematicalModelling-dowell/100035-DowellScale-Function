import concurrent
import random
import base64
import datetime
import json
import re

from .api_key import processApikey
from .utils import dowell_time_asian_culta

from concurrent import futures
from django.http import JsonResponse
from django.shortcuts import redirect
import stapel.views as stapel
import likert.views as likert
import percent_sum.views as percent_sum
import percent.views as percent
import npslite.views as nps_lite
import ranking.views as ranking
import Qsort.views as Qsort
import paired_comparison.views as paired_comparison
import perceptual_mapping.views as perceptual_mapping
from nps.dowellconnection import dowellconnection
from nps.eventID import get_event_id
from dowellnps_scale_function.settings import public_url
from django.core.files.storage import default_storage
from concurrent.futures import ThreadPoolExecutor
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import ScalesPluginSerializer
from rest_framework.response import Response
import concurrent.futures
import imghdr


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
    total_score = sum(int(i['score']['score']) for i in existing_responses)

    all_scores = [i['score'] for i in data['data']]

    instance_ids = [int(i['score']['instance_id'].split("/")[0])
                    for i in data['data']]

    if total_score == 0 or len(all_scores) == 0:
        overall_category = "No response provided"
        category = "No response provided"
    else:
        overall_category = total_score / len(all_scores)
        category = find_category(overall_category)
    return overall_category, category, all_scores, instance_ids, total_score, existing_responses


@api_view(['POST', ])
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


@api_view(['GET', 'POST', 'PUT'])
def custom_configuration_view(request):
    if request.method == 'GET':
        scale_id = request.data.get('scale_id')
        field_add = {"scale_id": scale_id}
        response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data",
                                         "1181", "ABCDE", "find", field_add, "nil")
        return Response({"data": json.loads(response_data)})

    elif request.method == "POST":
        template_id = request.data.get('template_id')
        custom_input_groupings = request.data.get('custom_input_groupings')
        scale_id = request.data.get('scale_id')
        scale_label = request.data.get('scale_label')

        try:
            field_add = {"_id": scale_id}
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE", "find", field_add, "nil")
            data = json.loads(response_data)
            settings_values = data['data']['settings']

            field_add1 = {
                "template_id": template_id,
                "custom_input_groupings": custom_input_groupings,
                "scale_id": scale_id,
                "scale_label": scale_label,
                "default_name": data['data']['settings']['name'],
                "date_created": dowell_time_asian_culta().get("current_time")
            }
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data",
                                             "1181", "ABCDE", "insert", field_add1, "nil")

            field_add = {"_id": scale_id}
            settings_values['name'] = scale_label
            update_field = {"settings": settings_values}
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE", "update", field_add, update_field)
            return Response({"message": json.loads(response_data), "data": field_add1})
        except:
            return Response({"message": "Error Occurred. Try Again"}, status=status.HTTP_403_FORBIDDEN)

    elif request.method == "PUT":
        scale_id = request.data.get('scale_id')
        field_add = {"scale_id": scale_id}
        response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data",

                                         "1181", "ABCDE", "fetch", field_add, "nil")
        settings = json.loads(response_data)['data'][0]
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
                "date_updated": dowell_time_asian_culta().get("current_time")
            }

            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data",
                                             "1181", "ABCDE", "update", field_add, update_field)
            return Response({"success": "Successfully Updated", "data": update_field})
        except:
            return Response({"message": "Error Occurred. Try Again!"}, status=status.HTTP_403_FORBIDDEN)
    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)


# CREATE SCALE SETTINGS
@api_view(['POST', 'PUT', 'GET'])
def settings_api_view_create(request):
    if request.method == 'GET':
        response = request.data
        if "scale_id" in response:
            scale_id = response['scale_id']
            field_add = {"_id": scale_id}
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE", "find", field_add, "nil")
            settings = json.loads(response_data)['data']['settings']
            template_name = settings["template_name"]
            urls = [
                f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor"]
            if int(settings["no_of_scales"]) > 1:
                urls = [f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor/{i}"
                        for i in range(1, int(settings["no_of_scales"]) + 1)]
            return Response({"data": json.loads(response_data), "urls": urls})
        else:
            field_add = {"settings.scale_category": "nps scale"}
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE", "fetch", field_add, "nil")
            return Response({"data": json.loads(response_data)})

    elif request.method == 'POST':
        response = request.data
        left = response['left']
        center = response['center']
        allow_resp = response.get('allow_resp', True)
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
                "allow_resp": allow_resp,
                "scale_category": "nps scale",
                "show_total_score": 'true',
                "date_created": dowell_time_asian_culta().get("current_time")
            }
        }
        response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                         "insert", field_add, "nil")
        return Response({"success": response_data, "data": field_add,
                         "scale_urls": f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor"})

    if request.method == "PUT":
        response = request.data
        id = response['scale_id']
        field_add = {"_id": id}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                             "find", field_add, "nil")
        settings_json = json.loads(x)
        settings = settings_json['data']['settings']
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
                "scale_category": "nps scale",
                "show_total_score": 'true',
                "date_updated": dowell_time_asian_culta().get("current_time")
            }
        }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                             "update", field_add, update_field)
        urls = []
        if int(settings["no_of_scales"]) > 1:
            for i in range(1, int(settings["no_of_scales"]) + 1):
                url = f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor/{i}"
                urls.append(url)
        else:
            urls.append(
                f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor")
        return Response({"success": "Successful Updated ", "data": update_field, "scale_urls": urls})
    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)


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
    scale_type = settings['scale_category']
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
    z = None
    x = None

    with ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                            "ABCDE",
                            "update", field_add, update_field),
            executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                            "ABCDE",
                            "fetch", field_add, "nil")]

        for future in concurrent.futures.as_completed(futures):
            try:
                result = future.result()
                if future == futures[0]:
                    z = result
                elif future == futures[1]:
                    x = result
            except Exception as e:
                print(f"Exception: {e}")

    settings_json = json.loads(x)
    return Response({"success": z, "response": settings_json['data'][0]['settings']})


@api_view(['POST'])
def dynamic_scale_instances_new(request):
    response = request.data
    scale_id = response["scale_id"]
    field_add = {"_id": scale_id}

    x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                         "fetch", field_add, "nil")
    settings_json = json.loads(x)
    settings = settings_json['data'][0]['settings']
    settings['allow_resp'] = True
    scale_type = settings['scale_category']

    if scale_type == "stapel scale":
        name_url = "/stapel/stapel-scale1/"
    elif scale_type == "nps scale":
        name_url = "/nps-scale1/"
    else:
        return Response({"error": "Scale not integrated yet"}, status=status.HTTP_400_BAD_REQUEST)

    instances = settings['no_of_scales']

    if 'no_of_documents' in response:
        no_of_scales = response['no_of_documents'] + instances
    else:
        no_of_scales = instances + 1
    update_field = {
        "settings.no_of_scales": no_of_scales,
        "settings.allow_resp": True
    }
    with ThreadPoolExecutor() as executor:
        future_z = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale",
                                   "1093", "ABCDE",
                                   "update", field_add, update_field)
        future_x = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale",
                                   "1093", "ABCDE",
                                   "fetch", field_add, "nil")

        z = future_z.result()  # Get the result of the first thread
        x = future_x.result()  # Get the result of the second thread

    settings_json = json.loads(x)
    settings_json = settings_json['data'][0]['settings']
    return Response({"success": z, "response": settings_json})


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


def is_emoji(character):
    # Use a regular expression to check if the character is an emoji
    emoji_pattern = re.compile("[\U00010000-\U0010ffff]", flags=re.UNICODE)
    return bool(emoji_pattern.match(character))


# SUMBIT SCALE RESPONSE
@api_view(['POST', 'GET'])
def nps_response_view_submit(request, api_key=None):
    if request.method == "POST":

        try:
            if request.data:
                response = request.data
            else:
                response = json.loads(request.body)
            try:
                user = response['username']
            except KeyError:
                return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

            if 'document_responses' in response:
                document_responses = response['document_responses']
                instance_id = response['instance_id']
                process_id = response['process_id']

                if not isinstance(process_id, str):
                    return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)
                resp = []
                for x in document_responses:
                    scale_id = x['scale_id']
                    score = x['score']
                    document_data = {
                        "details": {"action": response.get('action', ""), "authorized": response.get('authorized', ""),
                                    "cluster": response.get('cluster', ""),
                                    "collection": response.get('collection', ""),
                                    "command": response.get('command', ""), "database": response.get('database', ""),
                                    "document": response.get('document', ""),
                                    "document_flag": response.get('document_flag', ""),
                                    "document_right": response.get('document_right', ""),
                                    "field": response.get('field', ""), "flag": response.get('flag', ""),
                                    "function_ID": response.get('function_ID', ""),
                                    "metadata_id": response.get('metadata_id', ""),
                                    "process_id": response['process_id'], "role": response.get('role', ""),
                                    "team_member_ID": response.get('team_member_ID', ""),
                                    "update_field": {"content": response.get('content', ""),
                                                     "document_name": response.get('document_name', ""),
                                                     "page": response.get('page', "")},
                                    "user_type": response.get('user_type', ""), "id": response['_id']},
                        "product_name": response.get('product_name', "")}
                    success = response_submit_loop(
                        response, scale_id, instance_id, user, score, process_id, document_data)
                    resp.append(success.data)
                return Response({"data": resp}, status=status.HTTP_200_OK)
            else:
                scale_id = response['scale_id']
                score = response['score']
                instance_id = response['instance_id']
                if "process_id" in response:
                    process_id = response['process_id']
                    if not isinstance(process_id, str):
                        return Response({"error": "The process ID should be a string."},
                                        status=status.HTTP_400_BAD_REQUEST)
                    return response_submit_loop(response, scale_id, instance_id, user, score, process_id,api_key=api_key)
                return response_submit_loop(response, scale_id, instance_id, user, score, api_key=api_key)
        except Exception as e:
            return Response({"Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "GET":
        params = request.GET
        id = params.get("scale_id")
        try:
            field_add = {"scale_data.scale_type": "nps scale"}
            if id != None:
                field_add["scale_data.scale_id"] = id
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                             "scale_reports",
                                             "1094", "ABCDE", "fetch", field_add, "nil")
            data = json.loads(response_data)
            if data.get("data") == []:
                return Response({"error": "Scale response not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response({"data": json.loads(response_data)})
        except:
            return Response({"error": "An error occcured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def find_key_by_emoji(emoji_to_find, emoji_dict):
    for key, emoji in emoji_dict.items():
        if emoji == emoji_to_find:
            return key
    return None


def increment_last_element(arr):
    # Sort the array in ascending order
    arr.sort()

    # Check if the array is empty
    if not arr:
        # If empty, return 1 as the first element
        return 1
    else:
        # If not empty, add 1 to the last element
        arr[-1] += 1
        return arr[-1]


def response_submit_loop(response, scale_id, instance_id, user, score, process_id=None, document_data=None, api_key=None):
    field_add = {"_id": scale_id, "settings.scale_category": "nps scale"}
    default_scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                     "find", field_add, "nil")
    data = json.loads(default_scale)

    if 0 < int(score) > 10:
        return Response({"Error": "Score limit exceeded"}, status=status.HTTP_400_BAD_REQUEST)

    if data['data'] is None:
        return Response({"Error": "Scale does not exist"}, status=status.HTTP_404_NOT_FOUND)
    settings = data['data']['settings']

    if settings['allow_resp'] == False:
        return Response({"Error": "Scale response submission restricted!"}, status=status.HTTP_401_UNAUTHORIZED)
    number_of_scale = settings['no_of_scales']
    scale_id = data['data']['_id']

    category = find_category(score)

    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                    "ABCDE", "fetch",
                                    {"scale_id": scale_id, "username": user, "instance_id": instance_id}, "nil")
    user_dets = json.loads(user_details)
    overall_category, _, _, instance_ids, _, existing_responses = total_score_fun(scale_id)
    if len(user_dets['data']) >= 1:
        b = [l['score']['score'] for l in existing_responses if
             l['score']['instance_id'].split("/")[0] == f"{instance_id}" and l['event_id'] == user_dets['data'][0][
                 'event_id']]
        category = find_category(b[0])

        return Response({"error": "Scale Response Exists!", "current_score": b[0], "Category": category},
                        status=status.HTTP_405_METHOD_NOT_ALLOWED)
    if isinstance(api_key, int):
        total_no_of_items = settings['total_no_of_items']
        number_of_scale = settings['no_of_scales']
        score = api_key
        instance_id = increment_last_element(instance_ids)
        if api_key > total_no_of_items:
            return Response({"error": "Scale does not exist!"}, status=status.HTTP_400_BAD_REQUEST)
        elif instance_id > number_of_scale:
            return Response({"error": "Maximum responses reached!"}, status=status.HTTP_400_BAD_REQUEST)

    event_id = get_event_id()
    score_data = {"instance_id": f"{instance_id}/{number_of_scale}",
                  "score": score, "category": category}

    if int(instance_id) > int(number_of_scale):
        return Response({"Instance doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
    # Common dictionary elements
    common_data = {
        "username": user,
        "event_id": event_id,
        "scale_data": {"scale_id": scale_id, "scale_type": "nps scale"},
        "brand_data": {"brand_name": response["brand_name"], "product_name": response["product_name"]},
        "score": score_data,
        "date_created": dowell_time_asian_culta().get("current_time")
    }

    # Conditionally add "process_id" if it exists
    if process_id:
        common_data["process_id"] = process_id
    if api_key:
        common_data["api_key"] = api_key
    if document_data:
        common_data["document_data"] = document_data
    z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                         "ABCDE", "insert", common_data, "nil")
    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                    "ABCDE", "insert",
                                    {"scale_id": scale_id, "event_id": event_id, "instance_id": instance_id,
                                     "username": user}, "nil")
    common_data['inserted_id'] = json.loads(z)['inserted_id']
    return Response({"success": True, "payload": common_data})


# GET ALL SCALES
@api_view(['GET', ])
def scale_settings_api_view(request):
    try:
        field_add = {"settings.scale_category": "nps scale"}
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
        field_add = {"_id": id }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                             "fetch", field_add, "nil")
        settings_json = json.loads(x)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        settings = settings_json['data'][0]['settings']
        no_of_scales = int(settings['no_of_scales'])

        template_name = settings['template_name']

        return Response({"payload": json.loads(x)})


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


@api_view(['POST', 'PUT', 'GET'])
def new_nps_create(request):
    global image_label_format

    if request.method == 'POST':
        try:
            response = request.data
            username = response['username']
            user = response['user']
            left = response['left']
            center = response['center']
            fontstyle = response.get(
                'fontstyle', "Arial, Helvetica, sans-serif")
            right = response['right']
            text = f"{left}+{center}+{right}"
            rand_num = random.randrange(1, 10000)
            name = response['name']
            time = response.get('time', "")
            template_name = f"{name.replace(' ', '')}{rand_num}"
            fomat = response.get('fomat')
            no_of_scales = int(response.get('no_of_scales', 1))
            custom_emoji_format = {}
            image_label_format = {}

            if no_of_scales < 1:
                return Response({"no_of_scales": "Out of range"}, status=status.HTTP_400_BAD_REQUEST)

            if fomat == "emoji":
                custom_emoji_format = response.get('custom_emoji_format', {})
            elif fomat == "image":
                image_label_format = response.get('image_label_format', {})

                def save_image(key, image_data):
                    try:
                        # Decode the base64-encoded image data
                        image_bytes = base64.b64decode(image_data)
                    except ValueError:
                        # Handle invalid base64 data
                        return

                    # Determine the file extension based on the image format
                    image_format = imghdr.what('', h=image_bytes)
                    if image_format is None:
                        # Handle unsupported or unknown image formats
                        return

                    # Define a unique path for each image
                    image_path = f'images/{key}.{image_format}'
                    default_storage.save(image_path, image_bytes)
                    image_label_format[key] = image_path

                with ThreadPoolExecutor() as executor:
                    futures = [executor.submit(save_image, key, image_data) for key, image_data in
                               image_label_format.items()]
                    # Wait for all image saving tasks to complete
                    for future in futures:
                        future.result()

            event_ID = get_event_id()
            field_add = {
                "event_id": event_ID,
                "settings": {
                    "user": user,
                    "orientation": response.get('orientation'),
                    "scalecolor": response.get('scalecolor'),
                    "numberrating": 10,
                    "no_of_scales": no_of_scales,
                    "roundcolor": response.get('roundcolor'),
                    "fontcolor": response.get('fontcolor'),
                    "fomat": fomat,
                    "time": time,
                    "fontstyle": fontstyle,
                    "template_name": template_name,
                    "name": name,
                    "text": text,
                    "left": left,
                    "right": right,
                    "center": center,
                    "allow_resp": response.get('allow_resp', True),
                    "scale_category": "nps scale",
                    "show_total_score": response.get('show_total_score', True),
                    "date_created": dowell_time_asian_culta().get("current_time")
                }
            }

            if image_label_format:
                field_add['settings']['image_label_format'] = image_label_format
            if custom_emoji_format:
                field_add['settings']['custom_emoji_format'] = custom_emoji_format
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE",
                                             "insert", field_add, "nil")
            field_add['scale_id'] = json.loads(response_data)['inserted_id']

            # Should be inserted in a thread
            details = {"scale_id": json.loads(response_data)['inserted_id'], "event_id": event_ID, "username": username}
            user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                            "ABCDE",
                                            "insert", details, "nil")

            return Response({"success": True, "data": field_add}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        try:
            response = request.data
            scale_id = response['scale_id']
            if not scale_id:
                return Response({"error": "Scale ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            field_add = {"_id": scale_id}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "find", field_add, "nil")
            settings_json = json.loads(x)
            if not settings_json['data']:
                return Response({"error": "Scale does not exist"}, status=status.HTTP_404_NOT_FOUND)

            settings = settings_json['data']['settings']
            if settings['user'].lower() == "no":
                return Response({"error": "Cannot modify scale settings"}, status=status.HTTP_401_UNAUTHORIZED)

            left = response.get('left', settings["left"])
            center = response.get('center', settings["center"])
            right = response.get('right', settings["right"])
            text = f"{left}+{center}+{right}"
            name = response.get('name', settings["name"])
            time = response.get('time', settings["time"]) or 0
            template_name = settings["template_name"]
            orientation = response.get('orientation', settings["orientation"])
            scalecolor = response.get('scalecolor', settings["scalecolor"])
            roundcolor = response.get('roundcolor', settings["roundcolor"])
            fontcolor = response.get('fontcolor', settings["fontcolor"])
            allow_resp = response.get('allow_resp', settings["allow_resp"])
            show_total_score = response.get(
                'show_total_score', settings["show_total_score"])
            fomat = response.get('fomat', settings["fomat"])
            no_of_scales = int(response.get(
                'no_of_scales', settings["no_of_scales"]))
            fontstyle = response.get('fontstyle', settings["fontstyle"])
            event_ID = get_event_id()

            custom_emoji_format = {}
            image_label_format = {}
            if no_of_scales > 100 or no_of_scales < 1:
                return Response({"no_of_scales": "Out of range"}, status=status.HTTP_400_BAD_REQUEST)
            if fomat == "emoji":
                custom_emoji_format = response.get(
                    'custom_emoji_format', settings["custom_emoji_format"])
            elif fomat == "image":
                image_label_format = response.get(
                    'image_label_format', settings["image_label_format"])

                def save_image(key, image_data):
                    try:
                        # Decode the base64-encoded image data
                        image_bytes = base64.b64decode(image_data)
                    except ValueError:
                        # Handle invalid base64 data
                        return

                    # Determine the file extension based on the image format
                    image_format = imghdr.what('', h=image_bytes)
                    if image_format is None:
                        # Handle unsupported or unknown image formats
                        return

                    # Define a unique path for each image
                    image_path = f'images/{key}.{image_format}'
                    default_storage.save(image_path, image_bytes)
                    image_label_format[key] = image_path

                with ThreadPoolExecutor() as executor:
                    futures = [executor.submit(save_image, key, image_data) for key, image_data in
                               image_label_format.items()]
                    # Wait for all image saving tasks to complete
                    for future in futures:
                        future.result()

            update_field = {
                "event_id": event_ID,
                "settings": {
                    "user": response['user'],
                    "orientation": orientation,
                    "scalecolor": scalecolor,
                    "numberrating": 10,
                    "no_of_scales": no_of_scales,
                    "roundcolor": roundcolor,
                    "fontcolor": fontcolor,
                    "fomat": fomat,
                    "time": time,
                    "image_label_format": image_label_format,
                    "template_name": template_name,
                    "name": name,
                    "text": text,
                    "left": left,
                    "right": right,
                    "custom_emoji_format": custom_emoji_format,
                    "center": center,
                    "allow_resp": allow_resp,
                    "show_total_score": show_total_score,
                    "scale_category": "nps scale",
                    "fontstyle": fontstyle,
                    "date_created": settings["date_created"],
                    "date_updated": dowell_time_asian_culta().get("current_time")
                }
            }

            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE",
                                             "update", field_add, update_field)
            return Response({"success": response_data, "data": update_field})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        try:
            params = request.GET
            scale_id = params.get('scale_id')
            print("Yes",scale_id)
            if not scale_id:
                field_add = {"settings.scale_category": "nps scale"}
                response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                                 "ABCDE", "fetch", field_add, "nil")
                return Response({"data": json.loads(response_data)}, status=status.HTTP_200_OK)

            field_add = {"_id": scale_id,
                         "settings.scale_category": "nps scale"}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "find", field_add, "nil")
            settings_json = json.loads(x)
            if not settings_json.get('data'):
                return Response({"error": "scale not found"}, status=status.HTTP_404_NOT_FOUND)

            settings = settings_json['data']['settings']
            return Response({"success": settings})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST', 'GET', 'PUT'])
def error_response(request, message, status):
    return Response(message, status=status)


def redirect_view(request):
    api_key = request.GET.get('api_key')
    scaletype = request.GET.get('scale_type')
    scale_type = request.GET.get('type')
    scale_id = request.GET.get('scale_id')
    try:
        api_resp = processApikey(api_key)
        if api_resp['success'] is True:
            credit_count = api_resp['total_credits']
            if credit_count > 0:
                if scale_id is not None and request.method == "GET":
                    responses = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports","scale_reports","1094", "ABCDE", "fetch", {"scale_data.scale_id": scale_id.strip()},"nil")
                    setting_response = dowellconnection("dowellscale", "bangalore", "dowellscale",   "scale", "scale", "1093", "ABCDE", "find",{"_id": scale_id}, "nil")
                    if scale_type == "settings":
                        return error_response(request, {"success": True, "settings": json.loads(setting_response)['data']},status.HTTP_200_OK)
                    return error_response(request, {"success": True, "responses": json.loads(responses)['data']},status.HTTP_200_OK)
                elif api_key and scaletype is None and scale_type is None and request.method == "GET":
                    responses = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports","scale_reports","1094","ABCDE", "fetch",{"api_key": api_key.strip()},"nil")
                    return error_response(request, {"success": True, "response": json.loads(responses)['data']},status.HTTP_200_OK)
                if "nps_lite" in scaletype and "settings" in scale_type:
                    return nps_lite.settings_api_view_create(request)
                elif "nps_lite" in scaletype and "response" in scale_type:
                    return nps_lite.submit_response_view(request)
                elif "stapel" in scaletype and "settings" in scale_type:
                    return stapel.settings_api_view_create(request)
                elif "stapel" in scaletype and "response" in scale_type:
                    return stapel.stapel_response_view_submit(request)
                elif "likert" in scaletype and "settings" in scale_type:
                    return likert.settings_api_view_create(request)
                elif "likert" in scaletype and "response" in scale_type:
                    return likert.submit_response_view(request)
                elif "percent_sum" in scaletype and "settings" in scale_type:
                    return percent_sum.settings_api_view_create(request)
                elif "percent_sum" in scaletype and "response" in scale_type:
                    return percent_sum.percent_sum_response_submit(request)
                elif "nps" in scaletype and "settings" in scale_type:
                    return new_nps_create(request)
                elif "nps" in scaletype and "response" in scale_type:
                    return nps_response_view_submit(request, api_key)
                elif "percent" in scaletype and "settings" in scale_type:
                    return percent.settings_api_view_create(request)
                elif "percent" in scaletype and "response" in scale_type:
                    return percent.percent_response_view_submit(request)
                elif "ranking" in scaletype and "settings" in scale_type:
                    return ranking.settings_api_view_create(request)
                elif "ranking" in scaletype and "response" in scale_type:
                    return ranking.response_submit_api_view(request)
                elif "paired-comparison" in scaletype and "settings" in scale_type:
                    return paired_comparison.settings_api_view_create(request)
                elif "paired-comparison" in scaletype and "response" in scale_type:
                    return paired_comparison.scale_response_api_view(request)
                elif "qsort" in scaletype and "settings" in scale_type:
                    return Qsort.CreateScale(request)
                elif "qsort" in scaletype and "response" in scale_type:
                    return Qsort.ResponseAPI(request)
                elif "perceptual_mapping" in scale_type and "settings" in scale_type:
                    return perceptual_mapping.settings_api_view_create(request)
                elif "perceptual_mapping" in scale_type and "settings" in scale_type:
                    return perceptual_mapping.response_submit_api_view(request)
                else:
                    return error_response(request, {"success": False, "message": "Scale will be available soon."},
                                          status.HTTP_404_NOT_FOUND)
            else:
                error_message = api_resp['message']
                return error_response(request, {"success": False, "msg": error_message,
                                                "total credits": api_resp['total_credits']},
                                      status.HTTP_400_BAD_REQUEST)
        elif api_resp['success'] is False:
            error_message = api_resp['message']
            return error_response(request, {"success": False, "msg": error_message}, status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return error_response(request, {"success": False, "error": f"Provide required fields"}, status.HTTP_400_BAD_REQUEST)

def scales_plugins_function(request):
    try:
        scaletype = request.GET.get('scale_type')
        scale_type = request.GET.get('type')
        api_key = request.GET.get('api_key')
        api_resp = processApikey(api_key)
        if api_resp['success'] is True:
            credit_count = api_resp['total_credits']
            if credit_count > 0:
                if "nps" in scaletype and "settings" in scale_type:
                    return nps_plugins_create_settings(request, api_key)
                elif "nps" in scaletype and "response" in scale_type:
                    return nps_plugins_create_response(request)
            else:
                error_message = api_resp['message']
                return error_response(request, {"success": False, "msg": error_message,
                                                "total credits": api_resp['total_credits']},
                                      status.HTTP_400_BAD_REQUEST)
        elif api_resp['success'] is False:
            error_message = api_resp['message']
            return error_response(request, {"success": False, "msg": error_message}, status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return error_response(request, {"success": False, "error": f"Provide required fields"},
                              status.HTTP_400_BAD_REQUEST)


def instance_exists(scale_id, instance_id):
    # Check if the instance exists in the database
    field_add = {"scale_id": scale_id, "instance_id": instance_id}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                         "ABCDE", "find", field_add, "nil")

    data = json.loads(response_data)['data']
    if data:
        return data
    return False


def get_instance_score(scale_id, instance_id):
    # Retrieve the score for an existing instance
    field_add = {"scale_id": scale_id, "instance_id": instance_id}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                         "ABCDE", "find", field_add, "nil")
    return json.loads(response_data)['data']['score']


def get_scale_settings(scale_id):
    # Retrieve the scale settings
    field_add = {"_id": scale_id}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "plugin_data", "plugin_data",
                                     "1249001", "ABCDE", "find", field_add, "nil")
    return json.loads(response_data)['data']['settings']

@api_view(['POST', 'GET', 'PUT'])
def nps_plugins_create_settings(request, api_key):
    if request.method == 'POST':
        try:
            response = request.data
            username = response['username']
            user = response['user']
            left = response['left']
            center = response['center']
            fontstyle = response.get(
                'fontstyle', "Arial, Helvetica, sans-serif")
            right = response['right']
            text = f"{left}+{center}+{right}"
            rand_num = random.randrange(1, 10000)
            name = response['name']
            time = response.get('time', "")
            template_name = f"{name.replace(' ', '')}{rand_num}"
            fomat = response.get('fomat')
            no_of_scales = int(response.get('no_of_scales', 1))

            event_ID = get_event_id()
            field_add = {
                "event_id": event_ID,
                "settings": {
                    "user": user,
                    "orientation": response.get('orientation'),
                    "scalecolor": response.get('scalecolor'),
                    "numberrating": 10,
                    "no_of_scales": no_of_scales,
                    "roundcolor": response.get('roundcolor'),
                    "fontcolor": response.get('fontcolor'),
                    "fomat": fomat,
                    "time": time,
                    "fontstyle": fontstyle,
                    "template_name": template_name,
                    "name": name,
                    "text": text,
                    "left": left,
                    "right": right,
                    "center": center,
                    "allow_resp": response.get('allow_resp', True),
                    "scale_category": "nps scale",
                    "api_key": api_key,
                    "show_total_score": response.get('show_total_score', True),
                    "position": response.get('position', []),
                    "date_created": dowell_time_asian_culta().get("current_time"),
                }
            }

            if no_of_scales < 1:
                return Response({"no_of_scales": "Out of range"}, status=status.HTTP_400_BAD_REQUEST)

            if fomat == "emoji":
                field_add['settings']['custom_emoji_format'] = response.get('custom_emoji_format', {})
            elif fomat == "image":
                image_label_format = response.get('image_label_format', {})
                field_add['settings']['image_label_format'] = response.get('image_label_format', {})

                def save_image(key, image_data):
                    try:
                        # Decode the base64-encoded image data
                        image_bytes = base64.b64decode(image_data)
                    except ValueError:
                        # Handle invalid base64 data
                        return

                    # Determine the file extension based on the image format
                    image_format = imghdr.what('', h=image_bytes)
                    if image_format is None:
                        # Handle unsupported or unknown image formats
                        return

                    # Define a unique path for each image
                    image_path = f'images/{key}.{image_format}'
                    default_storage.save(image_path, image_bytes)
                    image_label_format[key] = image_path

                with ThreadPoolExecutor() as executor:
                    futures = [executor.submit(save_image, key, image_data) for key, image_data in
                               image_label_format.items()]
                    # Wait for all image saving tasks to complete
                    for future in futures:
                        future.result()


            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "plugin_data", "plugin_data",
                                     "1249001", "ABCDE", "insert", field_add, "nil")
            scale_id= json.loads(response_data)['inserted_id']
            # Should be inserted in a thread
            details = {"scale_id": scale_id, "event_id": event_ID, "username": username}
            user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                            "ABCDE",
                                            "insert", details, "nil")

            return Response({"success": True, "scale_id": scale_id,"scale_settings": field_add}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        try:
            response = request.data
            scale_id = response['scale_id']
            if not scale_id:
                return Response({"error": "Scale ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            field_add = {"_id": scale_id}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "plugin_data", "plugin_data",
                                     "1249001", "ABCDE", "find", field_add, "nil")
            settings_json = json.loads(x)
            if not settings_json['data']:
                return Response({"error": "Scale does not exist"}, status=status.HTTP_404_NOT_FOUND)

            settings = settings_json['data']['settings']
            if settings['user'].lower() == "no":
                return Response({"error": "Cannot modify scale settings"}, status=status.HTTP_401_UNAUTHORIZED)

            left = response.get('left', settings["left"])
            center = response.get('center', settings["center"])
            right = response.get('right', settings["right"])
            text = f"{left}+{center}+{right}"
            name = response.get('name', settings["name"])
            time = response.get('time', settings["time"])
            template_name = settings["template_name"]
            orientation = response.get('orientation', settings["orientation"])
            scalecolor = response.get('scalecolor', settings["scalecolor"])
            roundcolor = response.get('roundcolor', settings["roundcolor"])
            fontcolor = response.get('fontcolor', settings["fontcolor"])
            allow_resp = response.get('allow_resp', settings["allow_resp"])
            show_total_score = response.get(
                'show_total_score', settings["show_total_score"])
            fomat = response.get('fomat', settings["fomat"])
            no_of_scales = int(response.get(
                'no_of_scales', settings["no_of_scales"]))
            fontstyle = response.get('fontstyle', settings["fontstyle"])
            event_ID = get_event_id()

            update_field = {
                "event_id": event_ID,
                "settings": {
                    "user": response['user'],
                    "orientation": orientation,
                    "scalecolor": scalecolor,
                    "numberrating": 10,
                    "no_of_scales": no_of_scales,
                    "roundcolor": roundcolor,
                    "fontcolor": fontcolor,
                    "fomat": fomat,
                    "time": time,
                    "fontstyle": fontstyle,
                    "template_name": template_name,
                    "name": name,
                    "text": text,
                    "left": left,
                    "right": right,
                    "center": center,
                    "allow_resp": allow_resp,
                    "scale_category": "nps scale",
                    "api_key": api_key,
                    "show_total_score": show_total_score,
                    "position": response.get('position', []),
                    "date_created": dowell_time_asian_culta().get("current_time")
                }
            }

            if no_of_scales < 1:
                return Response({"no_of_scales": "Out of range"}, status=status.HTTP_400_BAD_REQUEST)
            if fomat == "emoji":
                update_field['settings']['custom_emoji_format'] = response.get(
                    'custom_emoji_format', settings["custom_emoji_format"])
            elif fomat == "image":
                update_field['settings']['image_label_format'] = response.get(
                    'image_label_format', settings["image_label_format"])
                image_label_format = response.get(
                                    'image_label_format', settings["image_label_format"])

                def save_image(key, image_data):
                    try:
                        # Decode the base64-encoded image data
                        image_bytes = base64.b64decode(image_data)
                    except ValueError:
                        # Handle invalid base64 data
                        return

                    # Determine the file extension based on the image format
                    image_format = imghdr.what('', h=image_bytes)
                    if image_format is None:
                        # Handle unsupported or unknown image formats
                        return

                    # Define a unique path for each image
                    image_path = f'images/{key}.{image_format}'
                    default_storage.save(image_path, image_bytes)
                    image_label_format[key] = image_path

                with ThreadPoolExecutor() as executor:
                    futures = [executor.submit(save_image, key, image_data) for key, image_data in
                               image_label_format.items()]
                    # Wait for all image saving tasks to complete
                    for future in futures:
                        future.result()

            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "plugin_data", "plugin_data",
                                     "1249001", "ABCDE", "update", field_add, update_field)
            return Response({"success": True, "data": update_field})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        try:
            api_key = request.GET.get('api_key', None)
            page_id = request.GET.get('page_id', None)
            block_id = request.GET.get('block_id', None)

            field_add = {}

            if api_key:
                field_add["settings.api_key"] = api_key

            if page_id is not None:
                field_add["settings.position"] = {"$elemMatch": {"page": page_id}}

            if block_id is not None:
                if "settings.position" in field_add:
                    field_add["settings.position"]["$elemMatch"]["block"] = block_id
                else:
                    field_add["settings.position"] = {
                        "$elemMatch": {"block": block_id}
                    }

            settings_data = json.loads(dowellconnection("dowellscale", "bangalore", "dowellscale", "plugin_data", "plugin_data","1249001", "ABCDE", "fetch", field_add, "nil"))

            if not settings_data['data']:
                return Response({"error": "scale not found"}, status=status.HTTP_404_NOT_FOUND)
            if len((settings_data)['data']) > 1:
                return Response({"scale_settings": settings_data['data']}, status=status.HTTP_200_OK)
            return Response({"scale_id": settings_data['data'][0]['_id'], "scale_settings":settings_data['data'][0]['settings']}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"Error": "Error occuered", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST', 'GET'])
def nps_plugins_create_response(request):
    if request.method == "POST":
        response = request.data
        serializer = ScalesPluginSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data

            position_data = response.get('position_data')
            event_id = get_event_id()

            scale_id = response.get('scale_id')
            instance_id = response.get('instance_id')
            score = response.get('score', '')
            if 0 < int(score) > 10:
                return Response({"Error": "Score limit exceeded"}, status=status.HTTP_400_BAD_REQUEST)
            # Check if the instance exists

            if instance_exists(scale_id, instance_id):
                return Response(
                    {"Error": "Response Exists", "score": get_instance_score(scale_id, instance_id)},
                    status=status.HTTP_400_BAD_REQUEST)
            # Get scale settings
            try:
                scale_settings = get_scale_settings(scale_id)
            except:
                return Response({"Error": f"Scale {scale_id} does not exist!"},
                                status=status.HTTP_400_BAD_REQUEST)

            no_of_scales = scale_settings['no_of_scales']

            if instance_id > no_of_scales:
                return Response({"Error": "Instance does not exist"}, status=status.HTTP_400_BAD_REQUEST)

            field_add = {
                "event_id": event_id,
                "username": response.get('username'),
                "scale_id": scale_id,
                "score": score,
                "instance_id": instance_id,
                "position_data": position_data
            }

            save_response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                         "ABCDE", "insert", field_add, "nil")

            inserted_id = json.loads(save_response)['inserted_id']
            return Response(
                {"success": True, "event_id": event_id, "scale_id": scale_id, "inserted_id": inserted_id,
                 "score": score}, status=status.HTTP_200_OK)
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "GET":

        scale_id = request.GET.get('scale_id')
        page_id = request.GET.get('page_id', None)
        block_id = request.GET.get('block_id', None)

        if scale_id:
            field_add = {"scale_id":scale_id}

            if scale_id and page_id:
                field_add = {"scale_id":scale_id,"position_data.page_id":int(page_id)}
            elif scale_id and block_id:
                field_add = {"scale_id":scale_id,"position_data.block_id":block_id}
            elif page_id and block_id:
                field_add = {"position_data.page_id":int(page_id),"position_data.block_id":block_id}
            elif page_id:
                field_add = {"position_data.page_id":int(page_id)}
            elif block_id:
               field_add = {"position_data.block_id":block_id}
        # if scale_id:
        #     field_add = {'scale_id': scale_id}
        #     print("fields to be fetched 1----->",field_add)
        #     if page_id is not None:
        #         field_add['position_data.page_id'] = page_id
        #         print("fields to be fetched 2----->",field_add)
        #     elif block_id is not None and page_id is not None:
        #         field_add['position_data.block_id'] = block_id
        #         field_add['position_data.page_id'] = page_id
        #     print("fields to be fetched 3----->",field_add)
            try:
                fetch_responses = json.loads(dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094","ABCDE", "fetch", field_add, "nil"))
                data = fetch_responses["data"]
            except:
                return Response({"Error": f"Responses do not exists for this scale {scale_id}!"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                scale_settings = get_scale_settings(scale_id)
            except:
                return Response({"Error": f"Scale {scale_id} does not exist!"},
                                status=status.HTTP_400_BAD_REQUEST)

            no_of_scales = scale_settings.get('no_of_scales')

            instance_ids = [i['instance_id'] for i in data]
            scores = [{i['instance_id']: i['score']} for i in data]

            return Response(
                {"success": True, "scale_id": scale_id, "no_of_scales": no_of_scales, "event_id": get_event_id(),
                 "instances_used": len(instance_ids), "instance_ids": instance_ids, "scores": scores}, status=status.HTTP_200_OK)
        else:
            return Response({"Error": "Invalid fields!"}, status=status.HTTP_400_BAD_REQUEST)



import concurrent
import random
import base64
import datetime
import json
import re

from .api_key import processApikey
from concurrent import futures
from django.http import JsonResponse
from django.shortcuts import redirect
import stapel.views as stapel
import likert.views as likert
import percent_sum.views as percent_sum
import percent.views as percent
import npslite.views as nps_lite
from nps.dowellconnection import dowellconnection
from nps.eventID import get_event_id
from dowellnps_scale_function.settings import public_url
from django.core.files.storage import default_storage
from concurrent.futures import ThreadPoolExecutor
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
import concurrent.futures
import imghdr


def compare_event_ids(arr1, arr2):
    print(arr1)
    print(arr2)
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
                "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
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
                "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
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
            field_add = {"settings.scale-category": "nps scale"}
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
                "scale-category": "nps scale",
                "show_total_score": 'true',
                "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
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
                "scale-category": "nps scale",
                "show_total_score": 'true',
                "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
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
    scale_type = settings['scale-category']

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
def nps_response_view_submit(request):
    if request.method == "POST":
        try:
            response = request.data
            try:
                user = response['username']
            except KeyError:
                return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

            if 'document_responses' in response:
                document_responses = response['document_responses']
                instance_id = response['instance_id']
                resp = []
                for x in document_responses:
                    scale_id = x['scale_id']
                    score = x['score']
                    success = response_submit_loop(
                        response, scale_id, instance_id, user, score)
                    resp.append(success.data)
                return Response({"data": resp}, status=status.HTTP_200_OK)
            else:
                scale_id = response['scale_id']
                score = response['score']
                instance_id = response['instance_id']
                return response_submit_loop(response, scale_id, instance_id, user, score)

        except Exception as e:
            return Response({"Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "GET":
        response = request.data
        try:
            if "scale_id" in response:
                id = response['scale_id']
                field_add = {"scale_data.scale_id": id,
                             "scale_data.scale_type": "nps scale"}
                response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                                 "scale_reports",
                                                 "1094", "ABCDE", "fetch", field_add, "nil")
                data = json.loads(response_data)
                print(data)
                return Response({"data": json.loads(response_data)})
            else:
                return Response({"data": "Scale Id must be provided"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"error": "Response does not exist!"}, status=status.HTTP_400_BAD_REQUEST)


def find_key_by_emoji(emoji_to_find, emoji_dict):
    for key, emoji in emoji_dict.items():
        if emoji == emoji_to_find:
            return key
    return None


def response_submit_loop(response, scale_id, instance_id, user, score):
    field_add = {"_id": scale_id, "settings.scale-category": "nps scale"}
    default_scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                     "find", field_add, "nil")
    data = json.loads(default_scale)
    if data['data'] is None:
        return Response({"Error": "Scale does not exist"})
    settings = data['data']['settings']
    number_of_scale = settings['no_of_scales']
    scale_id = data['data']['_id']
    if settings['fomat'] == 'emoji':
        try:
            if is_emoji(score):
                saved_emojis = settings["custom_emoji_format"]
                score = find_key_by_emoji(score, saved_emojis)
                if score is None:
                    return Response({"Error": "Provide an valid emoji from the scale!"})
            else:
                return Response({"Error": "Provide an emoji as the score value!"})
        except:
            return Response({"Error": "Provide an emoji as the score value!"})
    else:
        if is_emoji(f"{score}"):
            return Response({"Error": "Provide a valid value rating from the scale as the score value!"})
        elif 0 < int(score) > 10:
            return Response({"Error": "Score can only be 0 - 10!"})

    category = find_category(score)

    overall_category, _, _, _, _, existing_responses = total_score_fun(
        scale_id)
    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                    "ABCDE", "fetch",
                                    {"scale_id": scale_id, "username": user, "instance_id": instance_id}, "nil")
    user_dets = json.loads(user_details)
    if len(user_dets['data']) >= 1:
        b = [l['score'][0]['score'] for l in existing_responses if
             l['score'][0]['instance_id'].split("/")[0] == f"{instance_id}"]
        category = find_category(b[0])

        return Response({"error": "Scale Response Exists!", "current_score": b[0], "Category": category},
                        status=status.HTTP_405_METHOD_NOT_ALLOWED)
    event_id = get_event_id()
    score_data = {"instance_id": f"{instance_id}/{number_of_scale}",
                  "score": score, "category": category}

    print("This is my score data", score_data)
    if int(instance_id) > int(number_of_scale):
        return Response({"Instance doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
    field_add = {"event_id": event_id, "scale_data": {"scale_id": scale_id, "scale_type": "nps scale"},
                 "brand_data": {"brand_name": response["brand_name"], "product_name": response["product_name"]},
                 "score": [score_data]}
    z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                         "ABCDE", "insert", field_add, "nil")
    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                    "ABCDE", "insert",
                                    {"scale_id": scale_id, "event_id": event_id, "instance_id": instance_id,
                                     "username": user}, "nil")
    return Response({"success": z, "score": score_data, "payload": field_add, "Category": category})


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
            no_of_scales = int(response['no_of_scales'])
            custom_emoji_format = {}
            image_label_format = {}

            if no_of_scales > 100 or no_of_scales < 1:
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
                    "image_label_format": image_label_format,
                    "fontstyle": fontstyle,
                    "template_name": template_name,
                    "name": name,
                    "text": text,
                    "left": left,
                    "right": right,
                    "custom_emoji_format": custom_emoji_format,
                    "center": center,
                    "allow_resp": response.get('allow_resp', True),
                    "scale-category": "nps scale",
                    "show_total_score": response.get('show_total_score', True),
                    "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
            }
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE",
                                             "insert", field_add, "nil")

            # Should be inserted in a thread
            details = {"scale_id": json.loads(
                response_data)['inserted_id'], "event_id": event_ID, "username": username}
            user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                            "ABCDE",
                                            "insert", details, "nil")

            return Response({"success": response_data, "data": field_add}, status=status.HTTP_201_CREATED)
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
                    "scale-category": "nps scale",
                    "fontstyle": fontstyle,
                    "date_created": settings["date_created"],
                    "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
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
            response = request.data
            scale_id = response.get('scale_id')
            if not scale_id:
                field_add = {"settings.scale-category": "nps scale"}
                response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                                 "ABCDE", "fetch", field_add, "nil")
                return Response({"data": json.loads(response_data)}, status=status.HTTP_200_OK)

            field_add = {"_id": scale_id,
                         "settings.scale-category": "nps scale"}
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
    print("This is my status ", status)
    return Response({"error": message}, status=status)


def redirect_view(request):
    scaletype = request.GET.get('scale_type')
    scale_type = request.GET.get('type')

    if scale_type == "" or scaletype == "":
        return error_response(request, "scale_type and type should not be null!", status.HTTP_400_BAD_REQUEST)
    try:
        request_data = json.loads(request.body)
        if "api_key" in request_data:
            api_key = request_data.get('api_key')
            api_resp = processApikey(api_key)
            if api_resp['success'] is True:
                credit_count = api_resp['total_credits']
                if credit_count >= 0:
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
                        return nps_response_view_submit(request)
                    elif "percent" in scaletype and "settings" in scale_type:
                        return percent.settings_api_view_create(request)
                    elif "percent" in scaletype and "response" in scale_type:
                        return percent.percent_response_view_submit(request)
                    else:
                        return error_response(request, "Scale will be available soon.", status.HTTP_404_NOT_FOUND)
                else:
                    error_message = api_resp['message']
                    return error_response(request, {"success": False, "msg": error_message,
                                                    "total credits": api_resp['total_credits']},
                                          status.HTTP_400_BAD_REQUEST)
            elif api_resp['success'] is False:
                error_message = api_resp['message']
                return error_response(request, {"success": False, "msg": error_message}, status.HTTP_200_OK)
        else:
            return error_response(request, {"success": False, "msg": "Provide a valid API key"},
                                  status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return error_response(request, e, status.HTTP_400_BAD_REQUEST)

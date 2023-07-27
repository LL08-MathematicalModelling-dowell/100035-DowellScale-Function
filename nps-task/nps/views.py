import datetime
import random
import json
from django.shortcuts import render, redirect, HttpResponse
from .dowellconnection import dowellconnection
from .eventID import get_event_id
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from dowellnps_scale_function.settings import public_url
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
import concurrent.futures
from django.core.cache import cache




def generate_random_number():
    min_number = 10 ** 2
    max_number = 10 ** 6 - 1
    return random.randint(min_number, max_number)


def compare_event_ids(arr1, arr2):
    return bool(set(arr1) & set(arr2))  # returns True if there's a common element


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
    try:
        field_add = {"scale_data.scale_id": id}

        # Start ThreadPoolExecutor context
        with concurrent.futures.ThreadPoolExecutor() as executor:
            # Submit the dowellconnection task to the executor
            future = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale_reports",
                                     "scale_reports", "1094", "ABCDE", "fetch", field_add, "nil")
            response_data = future.result()

        data = json.loads(response_data)
    except Exception as e:
        raise RuntimeError("Error loading JSON data.") from e

    existing_responses = data["data"]

    total_score = sum(int(i['score'][0]['score']) for i in existing_responses)
    all_scores = [i['score'] for i in existing_responses]
    instance_ids = [int(i['score'][0]['instance_id'].split("/")[0]) for i in existing_responses]

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

import concurrent.futures

@api_view(['GET', 'POST', 'PUT'])
def custom_configuration_view(request):
    if request.method == 'GET':
        scale_id = request.data.get('scale_id')
        field_add = {"scale_id": scale_id}

        # Perform the API call using concurrent.futures
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data",
                                     "1181", "ABCDE", "find", field_add, "nil")
            response_data = future.result()

        return Response({"data": json.loads(response_data)})

    elif request.method == "POST":
        template_id = request.data.get('template_id')
        custom_input_groupings = request.data.get('custom_input_groupings')
        scale_id = request.data.get('scale_id')
        scale_label = request.data.get('scale_label')

        try:
            field_add = {"_id": scale_id}
            field_add1 = {
                "template_id": template_id,
                "custom_input_groupings": custom_input_groupings,
                "scale_id": scale_id,
                "scale_label": scale_label,
                "default_name": None,
                "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            with concurrent.futures.ThreadPoolExecutor() as executor:
                # future1 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                #                           "ABCDE", "find", field_add, "nil")
                future2 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                          "ABCDE", "update", field_add, {"settings.name": scale_label})

                # response_data1 = future1.result()
                response_data2 = future2.result()

            return Response({"message": json.loads(response_data2), "data": field_add1})
        except:
            return Response({"message": "Error Occurred. Try Again"}, status=status.HTTP_403_FORBIDDEN)

    elif request.method == "PUT":
        scale_id = request.data.get('scale_id')
        field_add = {"scale_id": scale_id}

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data",
                                     "1181", "ABCDE", "fetch", field_add, "nil")
            response_data = future.result()

        settings = json.loads(response_data)['data'][0]
        custom_input_groupings = request.data.get('custom_input_groupings', settings.get('custom_input_groupings'))
        scale_label = request.data.get('scale_label', settings.get('scale_label'))

        try:
            update_field = {
                "custom_input_groupings": custom_input_groupings,
                "scale_id": scale_id,
                "template_id": settings['template_id'],
                "scale_label": scale_label,
                "date_created": settings['date_created'],
                "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            return Response({"success": "Successfully Updated", "data": update_field})
        except:
            return Response({"message": "Error Occurred. Try Again!"}, status=status.HTTP_403_FORBIDDEN)

    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)



# CREATE SCALE SETTINGS
import concurrent.futures

@api_view(['POST', 'PUT', 'GET'])
def settings_api_view_create(request):
    if request.method == 'GET':
        response = request.data
        if "scale_id" in response:
            scale_id = response['scale_id']
            field_add = {"_id": scale_id}
            field_add_fetch = {"settings.template_name": field_add}

            with concurrent.futures.ThreadPoolExecutor() as executor:
                future1 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                         "ABCDE", "find", field_add_fetch, "nil")
                future2 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                                         "ABCDE", "fetch", field_add, "nil")

                response_data1 = future1.result()
                response_data2 = future2.result()

            if response_data1 is None or response_data2 is None:
                return Response({"error": "Error occurred while fetching data."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            settings = json.loads(response_data1)['data']['settings']
            template_name = settings["template_name"]
            urls = [f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor"]
            if int(settings["no_of_scales"]) > 1:
                urls = [f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor/{i}"
                        for i in range(1, int(settings["no_of_scales"]) + 1)]
            return Response({"data": json.loads(response_data1), "urls": urls})
        else:
            field_add = {"settings.scale-category": "nps scale"}

            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                         "ABCDE", "fetch", field_add, "nil")
                response_data = future.result()

            if response_data is None:
                return Response({"error": "Error occurred while fetching data."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({"data": json.loads(response_data)})

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

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale",
                                     "1093", "ABCDE",
                                     "insert", field_add, "nil")
            response_data = future.result()

        if response_data is None:
            return Response({"error": "Error occurred while inserting data."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"success": response_data, "data": field_add,
                         "scale_urls": f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor"})

    elif request.method == "PUT":
        response = request.data
        scale_id = response['scale_id']
        field_add = {"_id": scale_id}

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future1 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale",
                                      "1093",
                                      "ABCDE", "find", field_add, "nil")
            response_data1 = future1.result()

        if response_data1 is None:
            return Response({"error": "Error occurred while fetching data."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        settings = json.loads(response_data1)['data']['settings']
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

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future2 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale",
                                      "1093",
                                      "ABCDE", "update", field_add, update_field)
            response_data2 = future2.result()

        if response_data2 is None:
            return Response({"error": "Error occurred while updating data."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        urls = []
        if int(settings["no_of_scales"]) > 1:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                futures = [executor.submit(build_url, public_url, template_name, i) for i in
                           range(1, int(settings["no_of_scales"]) + 1)]
                for future in concurrent.futures.as_completed(futures):
                    urls.append(future.result())
        else:
            urls.append(f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor")

        return Response({"success": "Successful Updated", "data": update_field, "scale_urls": urls})

    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)

def build_url(public_url, template_name, scale_number):
    return f"{public_url}/nps-scale1/{template_name}?brand_name=WorkflowAI&product_name=editor/{scale_number}"



@api_view(['POST'])
def dynamic_scale_instances(request):
    response = request.data
    scale_id = response["scale_id"]
    field_add = {"_id": scale_id}

    with concurrent.futures.ThreadPoolExecutor() as executor:
        future1 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "fetch", field_add, "nil")
        x = future1.result()

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
            futures = [executor.submit(build_instance, public_url, name_url, template_name, x) for x in range(start, int(no_of_documents))]
            for future in concurrent.futures.as_completed(futures):
                instance = future.result()
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

        future2 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "update", field_add, update_field)
        z = future2.result()

        future3 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "fetch", field_add, "nil")
        x = future3.result()

    settings_json = json.loads(x)
    return Response({"success": z, "response": settings_json['data'][0]['settings']})

def build_instance(public_url, name_url, template_name, document_number):
    return {
        f"document{document_number}": f"{public_url}{name_url}{template_name}?brand_name=WorkflowAI&product_name=editor/{document_number}"
    }




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
        instance_id = response['instance_id']
        field_add = {"_id": scale_id, "settings.scale-category": "nps scale"}

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future1 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                      "find", field_add, "nil")
            default_scale = future1.result()

            data = json.loads(default_scale)
            if data['data'] is None:
                return Response({"Error": "Scale does not exist"})

            settings = data['data']['settings']
            number_of_scale = settings['no_of_scales']
            scale_id = data['data']['_id']
            overall_category, _, _, _, _, existing_responses = total_score_fun(scale_id)
            category = find_category(score)
            responses_id = [c['event_id'] for c in existing_responses if
                            int(c['score'][0]['instance_id'].split("/")[0]) == int(instance_id)]

            future2 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                      "ABCDE", "fetch", {"scale_id": scale_id, "username": user}, "nil")
            user_details = future2.result()

            user_dets = json.loads(user_details)
            user_ids = [i["event_id"] for i in user_dets['data']]
            check_existance = compare_event_ids(responses_id, user_ids)
            if check_existance:
                return Response({"error": "Scale Response Exists!", "current_score": score, "Category": category},
                                status=status.HTTP_405_METHOD_NOT_ALLOWED)
            event_id = get_event_id()
            score_data = {"instance_id": f"{instance_id}/{number_of_scale}", "score": score, "category": category}
            if int(instance_id) > int(number_of_scale):
                return Response({"Instance doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
            field_add = {"event_id": event_id, "scale_data": {"scale_id": scale_id, "scale_type": "nps scale"},
                         "brand_data": {"brand_name": response["brand_name"], "product_name": response["product_name"]},
                         "score": [score_data]}

            future3 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                                      "ABCDE", "insert", field_add, "nil")
            z = future3.result()

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

import concurrent.futures

@xframe_options_exempt
@csrf_exempt
def dowell_editor_admin(request, id):
    field_add = {"_id": id}
    context = {}

    with ThreadPoolExecutor() as executor:
        future1 = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                  "find", field_add, "nil")
        x = future1.result()

        settings_json = json.loads(x)
        settings = settings_json['data']['settings']
        context["settings"] = settings
        scale_type = settings['scale-category']

        if scale_type == "nps scale":
            if request.method == 'POST':
                name = settings["name"]
                orientation = request.POST['orientation']
                scalecolor = request.POST['scolor']
                roundcolor = request.POST['rcolor']
                fontcolor = request.POST['fcolor']
                fomat = request.POST['format']
                left = request.POST["left"]
                right = request.POST["right"]
                no_of_scales = request.POST["no_of_scales"]
                center = request.POST["center"]
                time = request.POST['time']
                show_total = request.POST['checkboxScores']
                allow_resp = False
                text = f"{left}+{center}+{right}"
                template_name = settings["template_name"]
                if time == "":
                    time = 0

                update_field = {"settings": {"orientation": orientation, "scalecolor": scalecolor, "numberrating": 10,
                                             "no_of_scales": no_of_scales, "roundcolor": roundcolor,
                                             "fontcolor": fontcolor, "fomat": fomat, "time": time,
                                             "allow_resp": allow_resp, "template_name": template_name, "name": name,
                                             "text": text, "left": left, "right": right, "center": center,
                                             "scale-category": "nps scale", "show_total_score": show_total,
                                             "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}}

                cache_key = f"api_cache:{id}"
                cached_response = cache.get(cache_key)
                if cached_response is None:
                    with executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                        field_add, update_field) as future2:
                        x = future2.result()
                        cache.set(cache_key, x, timeout=60)  # Cache response for 60 seconds

                urls = f"{public_url}/nps-scale1/{template_name}?brand_name=your_brand&product_name=product_name"
                context["settings"] = update_field["settings"]
            return render(request, 'nps/editor_scale_admin.html', context)

        elif scale_type == "stapel scale":
            if request.method == 'POST':
                name = settings["name"]
                orientation = request.POST['orientation']
                scale_upper_limit = request.POST['scale_upper_limit']
                spacing_unit = request.POST['spacing_unit']
                scalecolor = request.POST['scolor']
                roundcolor = request.POST['rcolor']
                fontcolor = request.POST['fcolor']
                left = request.POST["left"]
                right = request.POST["right"]
                no_of_scales = request.POST["no_of_scales"]
                time = request.POST['time']
                text = f"{left}+{right}"
                template_name = settings["name"]
            if time == "":
                time = 0
            scale = []
            for i in range(-int(scale_upper_limit), int(scale_upper_limit) + 1):
                if i % int(spacing_unit) == 0 and i != 0:
                    scale.append(i)
            update_field = {
                "settings": {"orientation": orientation, "scale_upper_limit": scale_upper_limit,
                             "scale_lower_limit": -int(scale_upper_limit),
                             "scalecolor": scalecolor, "spacing_unit": spacing_unit, "fomat": "numbers",
                             "no_of_scales": no_of_scales,
                             "roundcolor": roundcolor, "fontcolor": fontcolor,
                             "time": time,
                             "template_name": template_name, "name": name, "text": text,
                             "left": left,
                             "right": right, "scale": scale,
                             "scale-category": "stapel scale",
                             "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}}

            return render(request, 'nps/editor_stapel_scale.html', context)

        elif scale_type == "percent scale":
            if request.method == 'POST':
                name = request.POST['nameofscale']
                orientation = request.POST['orientation']
                scalecolor = request.POST['scolor']
                time = request.POST['time']
                number_of_scales = request.POST['numberofscale']
                rand_num = random.randrange(1, 10000)
                template_name = f"{name.replace(' ', '')}{rand_num}"
                eventID = get_event_id()
                if time == "":
                    time = 0
                update_field = {"event_id": eventID,
                                "settings": {"orientation": orientation, "scalecolor": scalecolor,
                                             "time": time, "template_name": template_name,
                                             "number_of_scales": number_of_scales, "name": name,
                                             "scale-category": "percent scale",
                                             "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}}

                cache_key = f"api_cache:{id}"
                cached_response = cache.get(cache_key)
                if cached_response is None:
                    with executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                        field_add, update_field) as future2:
                        x = future2.result()
                        cache.set(cache_key, x, timeout=60)  # Cache response for 60 seconds

                return render(request, 'nps/editor_percent_scale.html', context)



def dowell_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/nps-admin/settings/")
    context = {}
    context["public_url"] = public_url
    if request.method == 'POST':
        name = request.POST['nameofscale']
        orientation = request.POST['orientation']
        numberrating = 10
        scalecolor = request.POST['scolor']
        roundcolor = request.POST['rcolor']
        fontcolor = request.POST['fcolor']
        fomat = request.POST['format']
        left = request.POST["left"]
        right = request.POST["right"]
        no_of_scales = request.POST["no_of_scales"]
        center = request.POST["center"]
        time = request.POST['time']
        show_total = request.POST['checkboxScores']
        allow_resp = request.POST['checkboxResponse']
        text = f"{left}+{center}+{right}"
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        if time == "":
            time = 0
        if allow_resp == "false":
            allow_resp = False
        else:
            allow_resp = True
        try:
            eventID = get_event_id()
            field_add = {"event_id": eventID, "settings": {"orientation": orientation, "numberrating": numberrating,
                                                           "scalecolor": scalecolor, "roundcolor": roundcolor, "allow_resp": allow_resp,
                                                           "fontcolor": fontcolor, "fomat": fomat, "time": time,
                                                           "template_name": template_name, "name": name, "text": text,
                                                           "left": left, "right": right, "center": center,
                                                           "scale-category": "nps scale", "no_of_scales": no_of_scales,
                                                           "show_total_score": show_total, "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                                 field_add, "nil")
            # User details
            user_json = json.loads(x)
            details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
            return redirect(f"{public_url}/nps-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'nps/scale_admin.html', context)



from concurrent.futures import ThreadPoolExecutor, as_completed


@xframe_options_exempt
@csrf_exempt
def dowell_scale1(request, tname1):
    global response_saved
    context = {}
    context["public_url"] = public_url
    # Get url parameters
    brand_name = request.GET.get('brand_name', None)
    product_name = request.GET.get('product_name', None)
    ls = request.path
    url = request.build_absolute_uri()
    try:
        x, s = url.split('?')
        names_values_dict = dict(x.split('=') for x in s.split('&'))
        xy = x[1].replace('&', ',')
        y = xy.replace('=', ':')
        z = '{' + y + '}'
        pls = ls.split("/")
        tname = pls[1]
        context["brand_name"] = names_values_dict['brand_name']
        context["product_name"] = names_values_dict['product_name'].split('/')[0]
        context["scale_name"] = tname1
    except:
        f_path = request.get_full_path()
        response = redirect('nps:error_page')
        response.set_cookie('url', f_path)
        return response

    context["url"] = "../scaleadmin"
    context["urltext"] = "Create new scale"
    context["btn"] = "btn btn-dark"
    context["hist"] = "Scale History"
    context["bglight"] = "bg-light"
    context["left"] = "border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)"

    # scale settings call
    field_add = {"settings.template_name": tname1, }

    default = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "find",
        field_add, "nil")
    data = json.loads(default)
    id_scores = data['data']["_id"]
    context["scale_id"] = data['data']['_id']
    x = data['data']['settings']
    context['show_total'] = x['show_total_score']
    context["defaults"] = x
    context["text"] = x['text'].split("+")
    number_of_scale = x['no_of_scales']
    allow_resp = x['allow_resp']
    context["no_of_scales"] = number_of_scale
    context["total_score_scales"] = int(number_of_scale) * 10
    current_url = url.split('/')[-1]
    context['cur_url'] = current_url

    #check if the url has an instance of if allow response variable == True/False
    # if allow_resp == False or len(current_url) > 3:
    if allow_resp == False:
        context["dont_click"] = True
        return render(request, 'nps/single_scale.html', context)
    else:
        if len(current_url) > 3:
            current_url = 1
        user = request.session.get('user_name')
        context["dont_click"] = False
        existing_scale = False

        overall_category, category, all_scores, b, total_score, existing_responses = total_score_fun(context["scale_id"])
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                        "ABCDE", "fetch",
                                        {"scale_id": context['scale_id'], "username": user, "instance_id": current_url}, "nil")
        user_dets = json.loads(user_details)
        if len(user_dets['data']) >= 1:
            b = [l['score'][0]['score'] for l in existing_responses if
                 l['score'][0]['instance_id'].split("/")[0] == f"{current_url}"]
            category = find_category(b[0])
            existing_scale = True
            context['response_saved'] = b
            context['score'] = "show"
            context['all_scores'] = all_scores
            context['total_scores'] = total_score

    if request.method == 'POST':
        score = request.POST['scoretag']
        categ = find_category(score)
        context['response_saved'] = score
        eventID = get_event_id()

        score = {"instance_id": f"{current_url}/{context['no_of_scales']}", 'score': score, "category": categ}
        if existing_scale == False:
            overall_category, category, all_scores, b, total_score,existing_responses = total_score_fun(id_scores.strip())
            total_score_save = f"{total_score}/{context['total_score_scales']}"
            try:
                field_add = {"event_id": eventID,
                             "scale_data": {"scale_id": context["scale_id"], "scale_type": "nps scale"},
                             "brand_data": {"brand_name": context["brand_name"],
                                            "product_name": context["product_name"]}, "score": [score],
                             "total_score": total_score_save}
                z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                    "1094", "ABCDE", "insert", field_add, "nil")

                # User details
                user_json = json.loads(z)
                user = request.session.get('user_name')
                details = {"scale_id": context['scale_id'], "event_id": eventID, "username": user,"instance_id": current_url,}
                user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                    "ABCDE", "insert", details, "nil")
                context['score'] = "show"
                # calculate_total_score
                overall_category, category, all_scores, b, total_score ,existing_responses = total_score_fun(id_scores.strip())
                context['all_scores'] = all_scores
                context['total_scores'] = total_score
            except:
                context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'nps/single_scale.html', context)
import concurrent.futures

def brand_product_error(request):
    context = {}
    context["public_url"] = public_url
    url = request.COOKIES['url']
    template_name = url.split("/")[2]
    field_add = {"settings.template_name": template_name}
    default_scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                     "fetch", field_add, "nil")

    data = json.loads(default_scale)
    x = data['data'][0]['settings']
    context["defaults"] = x
    number_of_scale = x['no_of_scales']
    scale_id = data['data'][0]["_id"]

    context["no_scales"] = int(number_of_scale)
    context["no_of_scales"] = []
    for i in range(int(number_of_scale)):
        context["no_of_scales"].append(i)

    response_res = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                "scale_reports",
                                "1094", "ABCDE", "fetch", {"scale_data.scale_id": scale_id}, "nil")

    context['existing_scales'] = []
    data2 = json.loads(response_res)

    x2 = data2["data"]
    for i in x2:
        b = i['score'][0]['instance_id'].split("/")[0]
        context['existing_scales'].append(b)

    name = url.replace("'", "")
    context['template_url'] = f"{public_url}{name}?brand_name=your_brand&product_name=your_product"
    return render(request, 'nps/error_page.html', context)



def default_scale(request):
    context = {}
    context["public_url"] = public_url
    context["left"] = "border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    return render(request, 'nps/default.html', context)


def default_scale_admin(request):
    context = {}
    context["public_url"] = public_url
    context['user'] = 'admin'
    context[
        "left"] = "border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);height:300px;overflow-y: scroll;"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    field_add = {"settings.scale-category": "nps scale"}
    all_scales = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                                  field_add, "nil")
    data = json.loads(all_scales)
    context["npsall"] = sorted(
        data["data"], key=lambda d: d['_id'], reverse=True)
    return render(request, 'nps/default.html', context)

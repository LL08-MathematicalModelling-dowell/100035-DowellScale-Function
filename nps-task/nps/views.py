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


def find_category(score):
    if score <= 6:
        category = "Detractor"
    elif score <= 8:
        category = "Neutral"
    elif score < 0 or score > 10:
        return Response({"Error": "Score can be only from 1-10"})
    else:
        category = "Promoter"
    return category


def total_score_fun(id):
    b = 0
    field_add = {"scale_data.scale_id": id}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
        "1094",
        "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response_data)
    print(data)
    total_score = 0
    all_scores = []
    instanceID = 0

    if len(data['data']) != 0:
        score_data = data["data"]
        for i in score_data:
            b = i['score'][0]['score']
            all_scores.append(i['score'])
            # print("Score of scales-->", b)
            total_score += int(b)

            instanceID = int(i['score'][0]['instance_id'].split("/")[0])

    if total_score == 0 or len(all_scores) == 0:
        overall_category = "No response provided"
        category = "No response provided"
    else:
        overall_category = total_score / len(all_scores)
        category = find_category(overall_category)

    return overall_category, category, all_scores, instanceID, b, total_score


# Custom configuration api
@api_view(['POST', 'PUT', 'GET'])
def custom_configuration_view(request):
    if request.method == 'GET':
        response = request.data
        id = response['template_id']
        field_add = {"custom_input_id": id, }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data", "1181", "ABCDE",
            "fetch", field_add, "nil")
        return Response({"data": json.loads(x), })
    elif request.method == "POST":
        response = request.data
        custom_input_id = response['custom_input_id']
        custom_input_groupings = response['custom_input_groupings']

        if 'custom_input_3' in response:
            custom_input_3 = response['custom_input_3']
        else:
            custom_input_3 = ""
        if 'custom_input_4' in response:
            custom_input_4 = response['custom_input_4']
        else:
            custom_input_4 = ""
        if 'custom_input_5' in response:
            custom_input_5 = response['custom_input_5']
        else:
            custom_input_5 = ""
        if 'custom_input_6' in response:
            custom_input_6 = response['custom_input_6']
        else:
            custom_input_6 = ""
        if 'custom_input_7' in response:
            custom_input_7 = response['custom_input_7']
        else:
            custom_input_7 = ""
        if 'custom_input_8' in response:
            custom_input_8 = response['custom_input_8']
        else:
            custom_input_8 = ""
        field_add = {"custom_input_id": custom_input_id, "custom_input_groupings": custom_input_groupings,
                     "custom_input_3": custom_input_3, "custom_input_4": custom_input_4,
                     "custom_input_5": custom_input_5, "custom_input_6": custom_input_6,
                     "custom_input_7": custom_input_7, "custom_input_8": custom_input_8,
                     "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data", "1181", "ABCDE",
            "insert", field_add, "nil")
        return Response({"message": json.loads(x), "data": field_add})

    elif request.method == "PUT":
        response = request.data
        id = response['template_id']
        field_add = {"custom_input_id": id, }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data", "1181", "ABCDE",
            "fetch", field_add, "nil")
        settings = json.loads(x)
        settings = settings['data'][0]
        print(settings)

        if 'custom_input_groupings' in response:
            custom_input_groupings = response['custom_input_groupings']
        else:
            custom_input_groupings = settings["custom_input_groupings"]
        if 'custom_input_3' in response:
            custom_input_3 = response['custom_input_3']
        else:
            custom_input_3 = settings["custom_input_3"]
        if 'custom_input_4' in response:
            custom_input_4 = response['custom_input_4']
        else:
            custom_input_4 = settings["custom_input_4"]
        if 'custom_input_5' in response:
            custom_input_5 = response['custom_input_5']
        else:
            custom_input_5 = settings["custom_input_5"]
        if 'custom_input_6' in response:
            custom_input_6 = response['custom_input_6']
        else:
            custom_input_6 = settings["custom_input_6"]
        if 'custom_input_7' in response:
            custom_input_7 = response['custom_input_7']
        else:
            custom_input_7 = settings["custom_input_7"]
        if 'custom_input_8' in response:
            custom_input_8 = response['custom_input_8']
        else:
            custom_input_8 = settings["custom_input_8"]
        update_field = {"custom_input_groupings": custom_input_groupings,
                        "custom_input_3": custom_input_3, "custom_input_4": custom_input_4,
                        "custom_input_5": custom_input_5, "custom_input_6": custom_input_6,
                        "custom_input_7": custom_input_7, "custom_input_8": custom_input_8,
                        "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data", "1181", "ABCDE",
            "update", field_add, update_field)
        return Response({"success": "Successful Updated ", "data": update_field})

    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)


# CREATE SCALE SETTINGS
@api_view(['POST', 'PUT', 'GET'])
def settings_api_view_create(request):
    if request.method == 'GET':
        response = request.data
        if "scale_id" in response:
            id = response['scale_id']
            field_add = {"_id": id, }
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                "fetch", field_add, "nil")
            settings_json = json.loads(x)
            settings = settings_json['data'][0]['settings']
            template_name = settings["template_name"]
            urls = f"{public_url}/nps-scale1/{template_name}?brand_name=your_brand&product_name=product_name"
            if int(settings["no_of_scales"]) > 1:
                urls = []
                for i in range(1, int(settings["no_of_scales"]) + 1):
                    url = f"{public_url}/nps-scale1/{template_name}?brand_name=your_brand&product_name=product_name/{i}"
                    urls.append(url)
            return Response({"data": json.loads(x),"urls": urls})
        else:
            field_add = {"settings.scale-category": "nps scale"}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                field_add, "nil")
            return Response({"data": json.loads(x) })

    elif request.method == 'POST':
        response = request.data
        try:
            user = response['username']
        except:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

        left = response['left']
        center = response['center']
        right = response['right']
        # template_id = response['template_id']
        text = f"{left}+{center}+{right}"
        rand_num = random.randrange(1, 10000)
        name = response['name']

        time = response['time']
        template_name = f"{name.replace(' ', '')}{rand_num}"
        print(template_name)
        if time == "":
            time = 0

        eventID = get_event_id()
        field_add = {"event_id": eventID,
                     "settings": {"orientation": response['orientation'], "numberrating": 10,
                                  "scalecolor": response['scalecolor'], "numberrating": 10, "no_of_scales": 1,
                                  "roundcolor": response['roundcolor'], "fontcolor": response['fontcolor'],
                                  "fomat": response['fomat'], "time": time,
                                  "template_name": template_name, "name": response['name'], "text": text,
                                  "left": response['left'],
                                  "right": response['right'], "center": response['center'],
                                  "scale-category": "nps scale", "show_total_score": 'true',
                                  "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}}

        # print(field_add)
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
            field_add, "nil")

        user_json = json.loads(x)
        details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE",
            "insert", details, "nil")
        # urls = []
        # for i in range(1, response['no_of_scales'] + 1):
        urls = f"{public_url}/nps-scale1/{template_name}?brand_name=your_brand&product_name=product_name"
        # urls.append(url)
        return Response({"success": x, "data": field_add, "scale_urls": urls})

    # Edit existing scale settings
    elif request.method == "PUT":
        response = request.data
        id = response['scale_id']
        field_add = {"_id": id, }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
            "fetch", field_add, "nil")
        settings_json = json.loads(x)
        settings = settings_json['data'][0]['settings']
        if 'left' in response:
            left = response['left']
        else:
            left = settings["left"]
        if 'center' in response:
            center = response['center']
        else:
            center = settings["center"]
        if 'right' in response:
            right = response['right']
        else:
            right = settings["right"]

        text = f"{left}+{center}+{right}"


        name = settings["name"]
        if 'time' in response:
            time = response['time']
        else:
            time = settings["time"]
        template_name = settings["template_name"]
        if time == "":
            time = 0
        if 'orientation' in response:
            orientation = response['orientation']
        else:
            orientation = settings["orientation"]
        if 'scalecolor' in response:
            scalecolor = response['scalecolor']
        else:
            scalecolor = settings["scalecolor"]
        if 'roundcolor' in response:
            roundcolor = response['roundcolor']
        else:
            roundcolor = settings["roundcolor"]
        if 'fontcolor' in response:
            fontcolor = response['fontcolor']
        else:
            fontcolor = settings["fontcolor"]
        if 'fomat' in response:
            fomat = response['fomat']
        else:
            fomat = settings["fomat"]

        update_field = {
            "settings": {"orientation": orientation,
                         "scalecolor": scalecolor, "numberrating": 10, "no_of_scales": settings["no_of_scales"],
                         "roundcolor": roundcolor, "fontcolor": fontcolor,
                         "fomat": fomat, "time": time,
                         "template_name": template_name, "name": name, "text": text,
                         "left": left,
                         "right": right, "center": center,
                         "scale-category": "nps scale", "show_total_score": 'true',
                         "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}}
        # print(field_add)
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
            field_add, update_field)

        urls = f"{public_url}/nps-scale1/{template_name}?brand_name=your_brand&product_name=product_name"

        if int(settings["no_of_scales"]) > 1:
            urls = []
            for i in range(1,int(settings["no_of_scales"]) + 1):
                url = f"{public_url}/nps-scale1/{template_name}?brand_name=your_brand&product_name=product_name/{i}"
                urls.append(url)

        return Response({"success": "Successful Updated ", "data": update_field, "scale_urls": urls})
    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', ])
def dynamic_scale_instances(request):
    response = request.data
    scale_id = response["scale_id"]
    field_add = {"_id": scale_id}
    x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
        "fetch", field_add, "nil")
    settings_json = json.loads(x)
    settings = settings_json['data'][0]['settings']
    template_name = settings['template_name']
    scale_type = settings['scale-category']
    name_url = ""

    if scale_type == "stapel scale":
        name_url = "/stapel/stapel-scale1/"
    elif scale_type == "nps scale":
        name_url = "/nps-scale1/"
    else:
        return Response({"error": "Scale not intergrated yet"}, status=status.HTTP_400_BAD_REQUEST)

    start = 1
    instances = []
    if 'instances' in settings:
        start = len(settings['instances']) + 1
        print(start)
        for x in range(1, len(settings['instances']) + 1):
            instance = {f"document{x}": f"{public_url}{name_url}{template_name}?brand_name=your_brand&product_name=document/{x}"}
            instances.append(instance)
    if 'no_of_documents' in response:
        no_of_documents = response['no_of_documents'] + start
        for x in range(start, int(no_of_documents)):
            instance = {
                f"document{x}": f"{public_url}{name_url}{template_name}?brand_name=your_brand&product_name=document/{x}"}
            instances.append(instance)
    else:
        instance = {f"document{start}": f"{public_url}{name_url}{template_name}?brand_name=your_brand&product_name=document/{start}"}
        instances.append(instance)

    print(start)

    update_field = {
        "settings.no_of_scales": len(instances), "settings.instances": instances,
    }
    z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
        "update", field_add, update_field)

    x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
        "fetch", field_add, "nil")
    settings_json = json.loads(x)

    return Response({"success": z, "response": settings_json['data'][0]['settings']})

@api_view(['GET', ])
def calculate_total_score(request, id=None):
    try:
        field_add = {"settings.template_name": id, }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
            "fetch", field_add, "nil")

        settings_json = json.loads(x)
        id = settings_json['data'][0]["_id"]
        print("This is my settings", id)
        overall_category, category, all_scores, instanceID, b, total_score = total_score_fun(id.strip())
    except:
        return Response({"error": "Please try again"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"All_scores": all_scores, "Category": category}, status=status.HTTP_200_OK)


# SUMBIT SCALE RESPONSE
@api_view(['POST', ])
def nps_response_view_submit(request):
    if request.method == 'POST':
        response = request.data
        try:
            user = response['username']
        except:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

        # id = response['id']
        id = response['template_name']
        score = response['score']
        categ = find_category(score)
        instance_id = response['instance_id']
        field_add = {"settings.template_name": id, }
        # field_add = {"_id": id}
        default = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
            "fetch", field_add, "nil")
        data = json.loads(default)
        x = data['data'][0]['settings']
        number_of_scale = x['no_of_scales']
        id = data['data'][0]['_id']

        # find existing scale reports
        overall_category, o_category, all_scores, instanceID, b = total_score_fun(id)
        category = find_category(b)
        # print("This is my instance ID: ",instanceID)
        if instance_id == instanceID:
            return Response({"error": "Scale Response Exists!", "current_score": b, "Category": category},
                status=status.HTTP_405_METHOD_NOT_ALLOWED)
        eventID = get_event_id()
        score = {"instance_id": f"{instance_id}/{number_of_scale}", 'score': score, "category": categ}

        if int(instance_id) > int(number_of_scale):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        category = find_category(response["score"])

        field_add = {"event_id": eventID, "scale_data": {"scale_id": id, "scale_type": "nps scale"},
                     "brand_data": {"brand_name": response["brand_name"], "product_name": response["product_name"]},
                     "score": [score]}
        z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
            "ABCDE", "insert", field_add, "nil")
        user_json = json.loads(z)
        details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE",
            "insert", details, "nil")
        return Response({"success": z, "score": score, "payload": field_add,
                         "url": f"{public_url}/nps-scale1/{x['template_name']}?brand_name=your_brand&product_name=product_name/{response['instance_id']}",
                         "Category": category})
    # return Response({"success": z, "score": {score},"category": category,"payload": field_add, "url": f"{public_url}/nps-scale1/{x['template_name']}?brand_name=your_brand&product_name=product_name/{response['instance_id']}", "total score": f"{all_scores} \n TotalScore: {total_score} \n Category: {o_category}"})
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
        no_of_scales = settings['no_of_scales']
        template_name = settings['template_name']
        urls = []
        for i in range(1, no_of_scales + 1):
            url = f"{public_url}/nps-scale1/{template_name}?brand_name=your_brand&product_name=product_name/{i}"
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

@xframe_options_exempt
@csrf_exempt
def dowell_editor_admin(request, id):
    field_add = {"_id": id, }
    context = {}
    x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
        "fetch", field_add, "nil")
    settings_json = json.loads(x)
    settings = settings_json['data'][0]['settings']
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
            text = f"{left}+{center}+{right}"
            template_name = settings["template_name"]
            if time == "":
                time = 0

            update_field = {"settings": {"orientation": orientation,
                                         "scalecolor": scalecolor, "numberrating": 10, "no_of_scales": no_of_scales,
                                         "roundcolor": roundcolor, "fontcolor": fontcolor,
                                         "fomat": fomat, "time": time,
                                         "template_name": template_name, "name": name, "text": text,
                                         "left": left,
                                         "right": right, "center": center,
                                         "scale-category": "nps scale", "show_total_score": show_total,
                                         "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                field_add, update_field)
            urls = f"{public_url}/nps-scale1/{template_name}?brand_name=your_brand&product_name=product_name"

            # return HttpResponse(urls)

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
            print(field_add)
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                field_add, update_field)
        return render(request, 'nps/editor_stapel_scale.html', context)



def dowell_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/nps-admin/settings/")
    # print("+++++++++=>",user)
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
        text = f"{left}+{center}+{right}"
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        if time == "":
            time = 0
        try:
            eventID = get_event_id()
            field_add = {"event_id": eventID, "settings": {"orientation": orientation, "numberrating": numberrating,
                                                           "scalecolor": scalecolor, "roundcolor": roundcolor,
                                                           "fontcolor": fontcolor, "fomat": fomat, "time": time,
                                                           "template_name": template_name, "name": name, "text": text,
                                                           "left": left, "right": right, "center": center,
                                                           "scale-category": "nps scale", "no_of_scales": no_of_scales,
                                                           "show_total_score": show_total}}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                field_add, "nil")
            print("This is what is saved", field_add)
            # User details
            user_json = json.loads(x)
            details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
            user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                "ABCDE", "insert", details, "nil")
            return redirect(f"{public_url}/nps-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'nps/scale_admin.html', context)


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
        # return HttpResponse(names_values_dict['brand_name'])
        pls = ls.split("/")
        tname = pls[1]
        # resp = response.objects.all()
        # return HttpResponse(resp)
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
    default = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
        field_add, "nil")
    data = json.loads(default)
    id_scores = data['data'][0]["_id"]
    overall_category, category, all_scores, instanceID, b, total_score = total_score_fun(id_scores.strip())

    context["scale_id"] = data['data'][0]['_id']
    # print("+++++++++++++ Scale ID",context["scale_id"])
    x = data['data'][0]['settings']
    context['show_total'] = x['show_total_score']
    context["defaults"] = x
    context["text"] = x['text'].split("+")
    number_of_scale = x['no_of_scales']
    context["no_of_scales"] = number_of_scale
    context["total_score_scales"] = int(number_of_scale) * 10

    current_url = url.split('/')[-1]
    context['cur_url'] = current_url

    # find existing scale reports
    field_add = {"scale_data.scale_id": context["scale_id"]}
    response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
        "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response)

    existing_scale = False

    if len(data['data']) != 0:
        scale_data = data["data"][0]["scale_data"]
        score_data = data["data"]
        # score_data = data["data"][0]['score']

        total_score = 0
        for i in score_data:
            instance_id = i['score'][0]['instance_id'].split("/")[0]
            if len(instance_id) > 3:
                continue

            b = i['score'][0]['score']
            total_score += int(b)

        for i in score_data:
            # if data["data"][0]["scale_data"]["scale_id"] == "63b5ad4f571d55f21bab1ce6":
            #     break
            if len(instance_id) > 3:
                continue
            instance_id = i['score'][0]['instance_id'].split("/")[0]

            if instance_id == current_url:
                existing_scale = True
                context['response_saved'] = i['score'][0]['score']
                context['score'] = "show"
                context['all_scores'] = all_scores
                context['total_scores'] = total_score

            elif data["data"][0]["scale_data"]["scale_id"] == "63b5ad4f571d55f21bab1ce6":
                existing_scale = False
                # context['response_saved'] = i['score'][0]['score']
                context['score'] = ""

    if request.method == 'POST':
        score = request.POST['scoretag']
        categ = find_category(score)
        context['response_saved'] = score
        eventID = get_event_id()
        score = {"instance_id": f"{current_url}/{context['no_of_scales']}", 'score': score, category: categ}
        if len(data['data']) != 0:
            if data["data"][0]["scale_data"]["scale_id"] == "63b5ad4f571d55f21bab1ce6":
                score = {"instance_id": f"Default", 'score': score}

        if existing_scale == False:
            overall_category, category, all_scores, instanceID, b, total_score = total_score_fun(id_scores.strip())
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
                details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
                user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                    "ABCDE", "insert", details, "nil")
                context['score'] = "show"

                # calculate_total_score
                overall_category, category, all_scores, instanceID, b, total_score = total_score_fun(id_scores.strip())
                context['all_scores'] = all_scores
                context['total_scores'] = total_score

                print(field_add)
            except:
                context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'nps/single_scale.html', context)


def brand_product_error(request):
    context = {}
    context["public_url"] = public_url
    url = request.COOKIES['url']
    template_name = url.split("/")[2]
    field_add = {"settings.template_name": template_name}
    default = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
        field_add, "nil")
    data = json.loads(default)
    x = data['data'][0]['settings']
    context["defaults"] = x
    number_of_scale = x['no_of_scales']
    scale_id = data['data'][0]["_id"]

    context["no_scales"] = int(number_of_scale)
    context["no_of_scales"] = []
    for i in range(int(number_of_scale)):
        context["no_of_scales"].append(i)

    context['existing_scales'] = []
    field_add = {"scale_data.scale_id": scale_id}
    response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
        "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response)
    x = data["data"]
    for i in x:
        b = i['score'][0]['instance_id'].split("/")[0]
        print(b)
        context['existing_scales'].append(b)

    print("This are the existing scales", context['existing_scales'])
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
    context["npsall"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)
    return render(request, 'nps/default.html', context)

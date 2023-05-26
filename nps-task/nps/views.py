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


def generate_random_number():
    min_number = 10 ** 2
    max_number = 10 ** 6 - 1
    return random.randint(min_number, max_number)


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


@xframe_options_exempt
@csrf_exempt
def dowell_editor_admin(request, id):
    field_add = {"_id": id, }
    context = {}
    x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                         "find", field_add, "nil")
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

            update_field = {"settings": {"orientation": orientation,
                                         "scalecolor": scalecolor, "numberrating": 10, "no_of_scales": no_of_scales,
                                         "roundcolor": roundcolor, "fontcolor": fontcolor,
                                         "fomat": fomat, "time": time, "allow_resp": allow_resp,
                                         "template_name": template_name, "name": name, "text": text,
                                         "left": left,
                                         "right": right, "center": center,
                                         "scale-category": "nps scale", "show_total_score": show_total,
                                         "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                 field_add, update_field)
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
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                 field_add, update_field)
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
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                 field_add, update_field)
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
        print(allow_resp)
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
            details = {
                "scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
            user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                            "ABCDE", "insert", details, "nil")
            return redirect(f"{public_url}/nps-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'nps/scale_admin.html', context)


@xframe_options_exempt
@csrf_exempt
def dowell_scale1(request, tname1):
    url = request.build_absolute_uri()
    current_url = url.split('/')[-1]
    brand_name = request.GET.get('brand_name')
    product_name = request.GET.get('product_name')
    # ur = str(request.path_info.split('/'))
    # current_url = ur[len(ur) - 1]

    context = {
        "public_url": public_url,
        "brand_name": brand_name,
        "product_name": product_name.split('/')[0],
        "scale_name": tname1,
        "url": "../scaleadmin",
        "urltext": "Create new scale",
        "btn": "btn btn-dark",
        "hist": "Scale History",
        "bglight": "bg-light",
        "left": "border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)",
        "cur_url": current_url
    }

    # scale settings call
    field_add = {"settings.template_name": tname1, }
    default = dowellconnection("dowellscale", "bangalore", "dowellscale",
                               "scale", "scale", "1093", "ABCDE", "find", field_add, "nil")
    data = json.loads(default)
    id_scores = data['data']["_id"]
    context["scale_id"] = id_scores
    x = data['data']['settings']
    context['show_total'] = x['show_total_score']
    context["defaults"] = x
    context["text"] = x['text'].split("+")
    number_of_scale = x['no_of_scales']
    allow_resp = x['allow_resp']
    context["no_of_scales"] = number_of_scale
    context["total_score_scales"] = int(number_of_scale) * 10

    # check if the url has an instance of if allow response variable == True/False
    if not allow_resp or len(current_url) > 3:
        context["dont_click"] = True
        return render(request, 'nps/single_scale.html', context)

    user = request.session.get('user_name')
    context["dont_click"] = False

    overall_category, category, all_scores, instanceID, total_score, existing_responses = total_score_fun(
        id_scores)
    responses_id = [int(c['score'][0]['instance_id'].split("/")[0])
                    for c in existing_responses if int(c['score'][0]['instance_id'].split("/")[0]) == int(current_url)]

    details = {"scale_id": id_scores,
               "username": user}
    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                    "ABCDE", "fetch", details, "nil")
    user_dets = json.loads(user_details)
    user_ids = [i["event_id"] for i in user_dets["data"]]

    existing_scale = compare_event_ids(user_ids, responses_id)

    if existing_scale:
        context['response_saved'] = total_score
        context['score'] = "show"
        context['all_scores'] = all_scores
        context['total_scores'] = total_score
        return render(request, 'nps/single_scale.html', context)

    if request.method == 'POST':
        score = request.POST['scoretag']
        categ = find_category(score)
        context['response_saved'] = score
        eventID = get_event_id()

        score = {
            "instance_id": f"{current_url}/{context['no_of_scales']}", 'score': score, "category": categ}

        if not existing_scale:
            overall_category, category, all_scores, instanceID, total_score, existing_responses = total_score_fun(
                id_scores.strip())
            total_score_save = f"{total_score}/{context['total_score_scales']}"
            try:
                field_add = {"event_id": eventID,
                             "scale_data": {"scale_id": id_scores, "scale_type": "nps scale"},
                             "brand_data": {"brand_name": context["brand_name"],
                                            "product_name": context["product_name"]}, "score": [score],
                             "total_score": total_score_save}
                z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                     "1094", "ABCDE", "insert", field_add, "nil")

                # User details
                user_json = json.loads(z)
                user = request.session.get('user_name')
                details = {"scale_id": id_scores,
                           "event_id": eventID, "username": user}
                user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                                "ABCDE", "insert", details, "nil")
                context['score'] = "show"

                # calculate_total_score
                overall_category, category, all_scores, instanceID,  total_score, existing_responses = total_score_fun(
                    id_scores.strip())
                context['all_scores'] = all_scores
                context['total_scores'] = total_score
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

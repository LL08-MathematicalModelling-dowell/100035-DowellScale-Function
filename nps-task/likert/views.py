import random
import datetime
import json
import re

from rest_framework.decorators import api_view
from django.shortcuts import render, redirect, HttpResponse
from rest_framework.response import Response
from rest_framework import status
from nps.dowellconnection import dowellconnection
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from nps.eventID import get_event_id
from dowellnps_scale_function.settings import public_url
from .utils import assign_statement


@api_view(['POST', 'GET', 'PUT'])
def settings_api_view_create(request):
    if request.method == 'POST':
        custom_emoji_format = {}
        try:
            response = request.data
            try:
                user = response['username']
            except:
                return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)
            try:
                time = response['time']
                if time == "":
                    time = 0
                name = response['scale_name']
                number_of_scales = response['no_of_scales']
                orientation = response['orientation']
                fontstyle = response["fontstyle"]
                font_color = response['font_color']
                round_color = response['round_color']
                fomat = response['fomat']
                user = response['user']
                label_selection = response['label_scale_selection']
                if fomat == "emoji":
                    custom_emoji_format = response.get('custom_emoji_format', {})
                label_input = response['label_scale_input']
            except KeyError as error:
                return Response({"error": f"{error.args[0]} missing or mispelt"}, status=status.HTTP_400_BAD_REQUEST)

            if fomat != "text" and fomat != "emoji":
                return Response({"error": "Label type should be text or emoji"}, status=status.HTTP_400_BAD_REQUEST)

            if 2 < label_selection > 9 or label_selection == 6:
                return Response({"error": "Label selection should be between 2 to 5 and 7 to 9"},
                                status=status.HTTP_400_BAD_REQUEST)
            if len(label_input) != label_selection:
                return Response({"error": "Label selection and number of label input count should be same"},
                                status=status.HTTP_400_BAD_REQUEST)

            eventID = get_event_id()
            field_add = {"event_id": eventID,
                         "settings": {"orientation": orientation, "font_color": font_color,
                                      "no_of_scales": number_of_scales,
                                      "time": time, "name": name, "scale_category": "likert scale", "user": user,
                                      "round_color": round_color, "fomat": fomat, "label_selection": label_selection,
                                      "fontstyle": fontstyle, 
                                      "label_input": label_input, "user": user,
                                      "custom_emoji_format": custom_emoji_format,
                                      "allow_resp": response.get('allow_resp', True),
                                      "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                                      }
                         }

            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                                 field_add, "nil")

            user_json = json.loads(x)
            details = {
                "scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
            user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                            "ABCDE",
                                            "insert", details, "nil")
            return Response({"success": x, "data": field_add})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        try:
            params = request.GET
            scale_id = params.get('scale_id')
            if not scale_id:
                field_add = {"settings.scale_category": "likert scale"}
                response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                                 "ABCDE", "fetch", field_add, "nil")
                return Response({"data": json.loads(response_data)}, status=status.HTTP_200_OK)

            field_add = {"_id": scale_id,
                         "settings.scale_category": "likert scale"}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "find", field_add, "nil")
            settings_json = json.loads(x)
            if not settings_json.get('data'):
                return Response({"error": "scale not found"}, status=status.HTTP_404_NOT_FOUND)

            settings = settings_json['data']['settings']
            return Response({"success": settings})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "PUT":
        try:
            response = request.data
            if "scale_id" not in response:
                return Response({"error": "scale_id missing or mispelt"}, status=status.HTTP_400_BAD_REQUEST)
            if response["fomat"] != "text" and response["fomat"] != "emoji":
                return Response({"error": "Label type should be text or emoji"}, status=status.HTTP_400_BAD_REQUEST)
            if "label_input" in response:
                label_selection = response["label_scale_selection"]
                label_input = response["label_scale_input"]
                if 2 < label_selection > 9 or label_selection == 6:
                    return Response({"error": "Label selection should be between 2 to 5 and 7 to 9"},
                                    status=status.HTTP_400_BAD_REQUEST)
                if len(label_input) != label_selection:
                    return Response({"error": "Label selection and number of label input count should be same"},
                                    status=status.HTTP_400_BAD_REQUEST)
            id = response['scale_id']
            field_add = {"_id": id, }
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "fetch", field_add, "nil")
            settings_json = json.loads(x)
            settings = settings_json['data'][0]['settings']
            for key in settings.keys():
                if key in response:
                    settings[key] = response[key]
            settings['name'] = response.get('scale_name', settings["name"])
            settings["scale_category"] = "likert scale"
            settings["date_updated"] = datetime.datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S")
            update_field = {"settings": settings}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                 field_add, update_field)
            return Response({"success": "Successfully Updated ", "data": settings})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'GET'])
def submit_response_view(request):
    if request.method == "POST":
        try:
            response_data = request.data
            try:
                username = response_data['username']
                brand_name = response_data['brand_name']
                product_name = response_data['product_name']
            except KeyError as e:
                return Response({"error": f"Missing required parameter {e}"}, status=status.HTTP_400_BAD_REQUEST)
            if "document_responses" in response_data:
                document_responses = response_data["document_responses"]
                all_results = []
                instance_id = response_data['instance_id']
                process_id = response_data["process_id"]
                if not isinstance(process_id, str):
                    return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)
                for single_response in document_responses:
                    score = single_response["score"]
                    scale_id = single_response['scale_id']

                    document_data = {"details": {"action": response_data.get('action', ""), "authorized": response_data.get('authorized',""), "cluster": response_data.get('cluster', ""), "collection": response_data.get('collection',""), "command": response_data.get('command',""), "database": response_data.get('database', ""), "document": response_data.get('document', ""), "document_flag":response_data.get('document_flag',""), "document_right": response_data.get('document_right', ""), "field": response_data.get('field',""), "flag": response_data.get('flag', ""), "function_ID": response_data.get('function_ID', ""),"metadata_id": response_data.get('metadata_id', ""), "process_id": response_data['process_id'], "role": response_data.get('role', ""), "team_member_ID": response_data.get('team_member_ID', ""), "update_field": {"content": response_data.get('content', ""), "document_name": response_data.get('document_name', ""), "page": response_data.get('page', "")}, "user_type": response_data.get('user_type', ""), "id": response_data['_id']}, "product_name": response_data.get('product_name', "")}
                    success = response_submit_loop(username, scale_id, score, brand_name, product_name, instance_id, process_id, document_data)
                    all_results.append(success.data)
                return Response({"data": all_results}, status=status.HTTP_200_OK)
            else:
                process_id = response_data["process_id"]
                if not isinstance(process_id, str):
                    return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)
                scale_id = response_data['scale_id']
                score = response_data["score"]
                instance_id = response_data['instance_id']
                return response_submit_loop(username, scale_id, score, brand_name, product_name, instance_id, process_id)
        except Exception as e:
            return Response({"Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "GET":
        response = request.data
        try:
            if "scale_id" in response:
                id = response['scale_id']
                field_add = {"scale_data.scale_id": id,
                             "scale_data.scale_type": "likert scale"}
                response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                                 "scale_reports",
                                                 "1094", "ABCDE", "fetch", field_add, "nil")
                data = json.loads(response_data)
                return Response({"data": json.loads(response_data)})
            else:
                return Response({"data": "Scale Id must be provided"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"error": "Response does not exist!"}, status=status.HTTP_400_BAD_REQUEST)

def is_emoji(character):
    # Use a regular expression to check if the character is an emoji
    emoji_pattern = re.compile("[\U00010000-\U0010ffff]", flags=re.UNICODE)
    return bool(emoji_pattern.match(character))

def find_key_by_emoji(emoji_to_find, emoji_dict):
    for key, emoji in emoji_dict.items():
        if emoji == emoji_to_find:
            return int(key)
    return None

def response_submit_loop(username, scale_id, score, brand_name, product_name, instance_id, process_id=None, document_data=None):
    field_add = {"username": username, "scale_data.scale_id": scale_id}
    previous_response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094", "ABCDE", "fetch",
                            field_add, "nil")
    previous_response = json.loads(previous_response)
    previous_response = previous_response.get('data')            
    if len(previous_response) > 0 :
        return Response({"error": "You have already submitted a response for this scale."}, status=status.HTTP_400_BAD_REQUEST)
    field_add = {"_id": scale_id, "settings.scale_category": "likert scale"}
    default_scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                     "ABCDE",
                                     "find", field_add, "nil")
    data = json.loads(default_scale)
    settings = data['data']['settings']

    if data['data'] is None:
        return Response({"Error": "Scale does not exist"}, status=status.HTTP_404_NOT_FOUND)
    elif settings['allow_resp'] == False:
        return Response({"Error": "Scale response submission restricted!"}, status=status.HTTP_401_UNAUTHORIZED)

    number_of_scale = settings['no_of_scales']
    label_selection = settings['label_selection']

    event_id = get_event_id()
    if data['data']['settings'].get('fomat') == "text":
        if score not in data['data']['settings'].get('label_input'):
            return Response({"error": "Invalid response."}, status=status.HTTP_400_BAD_REQUEST)

    if data['data']['settings'].get('fomat') == "emoji":
        try:
            if is_emoji(score):
                saved_emojis = data['data']['settings']["custom_emoji_format"]
                score = find_key_by_emoji(score, saved_emojis)
                score = assign_statement(label_selection, score)
                if score is None:
                    return Response({"Error": "Provide an valid emoji from the scale!"})
            else:
                score = assign_statement(label_selection, int(score))
        except:
            score = assign_statement(label_selection, int(score))

    score_data = {"instance_id": f"{instance_id}/{number_of_scale}",
                  "score": score}
    if int(instance_id) > int(number_of_scale):
        return Response({"Error":"Instance doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
    # Insert new response into database
    response = {
            "username": username,
            "event_id": event_id,
            "scale_data": {"scale_id": scale_id, "scale_type": "likert scale"},
            "brand_data": {"brand_name": brand_name, "product_name": product_name},
            "score": score_data,
            "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    if process_id:
        response["process_id"] = process_id
    if document_data:
        response["docuemnt_data"] = document_data

    response_id = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                                   "ABCDE", "insert", response, "nil")

    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                    "ABCDE", "insert",
                                    {"scale_id": scale_id, "event_id": event_id, "instance_id": instance_id,
                                     "username": username}, "nil")

    return Response({"success": response_id, "payload": response})


@api_view(['GET'])
def get_response_view(request, id=None):
    try:
        field_add = {"_id": id}
        scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                 "scale_reports", "1094", "ABCDE", "fetch", field_add, "nil")
        scale_data = json.loads(scale)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        response = scale_data['data'][0]
        return Response({"payload": response})


@api_view(['GET', ])
def scale_response_api_view(request):
    try:
        field_add = {"scale_data.scale_type": "likert scale", }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                             "1094", "ABCDE", "fetch", field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response(json.loads(x))


def dowell_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/likert/likert-admin/settings/")
    context = {}
    context["public_url"] = public_url
    scales = {}
    if request.session.get("userinfo"):
        username = request.session["user_name"]
        if request.method == 'POST':
            name = request.POST['nameofscale']
            number_of_scales = request.POST['numberofscale']
            orientation = request.POST['orientation']
            roundcolor = request.POST['rcolor']
            fontcolor = request.POST['fcolor']
            labelscale = request.POST['likert']
            labeltype = request.POST['labeltype']
            time = request.POST['time']
            scales = [request.POST.get('scale_choice 0', "None"),
                      request.POST.get('scale_choice 1', "None"),
                      request.POST.get('scale_choice 2', "None"),
                      request.POST.get('scale_choice 3', "None"),
                      request.POST.get('scale_choice 4', "None"),
                      request.POST.get('scale_choice 5', "None"),
                      request.POST.get('scale_choice 6', "None"),
                      request.POST.get('scale_choice 7', "None"),
                      request.POST.get('scale_choice 8', "None")
                      ]

            eventID = get_event_id()
            rand_num = random.randrange(1, 10000)
            template_name = f"{name.replace(' ', '')}{rand_num}"
            if time == "":
                time = 0
            try:
                field_add = {"event_id": eventID,
                             "settings": {"orientation": orientation, "roundcolor": roundcolor, "fontcolor": fontcolor,
                                          "labelscale": labelscale,
                                          "number_of_scales": number_of_scales, "time": time,
                                          "template_name": template_name, "name": name, "scales": scales,
                                          "labeltype": labeltype, "scale_category": "likert scale"}}
                x = dowellconnection("dowellscale", "bangalore", "dowellscale",
                                     "scale", "scale", "1093", "ABCDE", "insert", field_add, "nil")

                # User details
                user_json = json.loads(x)
                details = {
                    "scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
                user_details = dowellconnection(
                    "dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE", "insert", details,
                    "nil")
                return redirect(f"{public_url}/likert/likert-scale1/{template_name}")
            except:
                context["Error"] = "Error Occurred while save the custom pl contact admin"
        return render(request, 'likert/scale_admin.html', context)


def dowell_likert(request):
    if request.method == "POST":
        scale_selected = request.POST['likert']
        scoretag = request.POST.get('scoretag', 'None')
        context = {"context": scale_selected}
        context["public_url"] = public_url
        return render(request, 'likert/default.html', context=context)
    return render(request, 'likert/likert.html')


@xframe_options_exempt
@csrf_exempt
def dowell_scale1(request, tname1):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={{public_url}}/likert/likert-admin/default/")
    context = {}
    context["public_url"] = public_url
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
        context["product_name"] = names_values_dict['product_name']
        context["scale_name"] = tname1
    except:
        f_path = request.get_full_path()
        response = redirect('likert:preview_page')
        response.set_cookie('url', f_path)
        return response

    context["url"] = "../scaleadmin"
    context["urltext"] = "Create new scale"
    context["btn"] = "btn btn-dark"
    context["hist"] = "Scale History"
    context["bglight"] = "bg-light"
    context["left"] = "border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)"

    field_add = {"settings.template_name": tname1, }
    default = dowellconnection("dowellscale", "bangalore", "dowellscale",
                               "scale", "scale", "1093", "ABCDE", "fetch", field_add, "nil")
    data = json.loads(default)
    context["scale_id"] = data['data'][0]['_id']
    x = data['data'][0]['settings']
    context["defaults"] = x

    context['labelscale'] = x["labelscale"]
    context['labeltype'] = x["labeltype"]
    number_of_scale = x['number_of_scales']
    for j in x["scales"]:
        if j == "None":
            x["scales"].remove(j)

    context['scale'] = x['scales']
    context["no_of_scales"] = number_of_scale
    num = url.split('/')
    url_id = num[-1]

    field_add = {"scale_data.scale_id": context["scale_id"]}
    response = dowellconnection("dowellscale", "bangalore", "dowellscale",
                                "scale_reports", "scale_reports", "1094", "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response)
    datas = data["data"]
    context["recorded_score"] = 101

    existing_scale = False
    if len(data['data']) != 0:
        score_data = data["data"]

        for i in score_data:
            if url_id == i['score'][0]['instance_id'].split("/")[0]:
                existing_scale = True
                recorded_score = (i['score'][0]['score'])
                context["recorded_score"] = recorded_score
                context['score'] = "show"

    if request.method == 'POST':
        current_url = url.split('/')[-1]
        score = request.POST['scoretag']
        eventID = get_event_id()
        score = {
            "instance_id": f"{current_url}/{context['no_of_scales']}", 'score': score}
        if existing_scale == False:
            try:
                field_add = {"event_id": eventID,
                             "scale_data": {"scale_id": context["scale_id"], "scale_type": "likert scale"},
                             "brand_data": {
                                 "brand_name": context["brand_name"], "product_name": context["product_name"]},
                             "score": [score]}
                x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                     "scale_reports", "1094", "ABCDE", "insert", field_add, "nil")

                # User details
                user_json = json.loads(x)
                details = {
                    "scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
                user_details = dowellconnection(
                    "dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE", "insert", details,
                    "nil")
                context["score"] = "show"
                return redirect(f"{url}")
            except:
                context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'likert/single_scale.html', context)


def brand_product_preview(request):
    context = {}
    context["public_url"] = public_url
    url = request.COOKIES['url']
    template_name = url.split("/")[-1]
    field_add = {"settings.template_name": template_name}
    default = dowellconnection("dowellscale", "bangalore", "dowellscale",
                               "scale", "scale", "1093", "ABCDE", "fetch", field_add, "nil")
    data = json.loads(default)
    x = data['data'][0]['settings']
    context["defaults"] = x
    number_of_scale = x['number_of_scales']
    scale_id = data['data'][0]["_id"]
    context["no_scales"] = int(number_of_scale)
    context["no_of_scales"] = []
    for i in range(int(number_of_scale)):
        context["no_of_scales"].append(i)

    context['existing_scales'] = []
    field_add = {"scale_data.scale_id": scale_id}
    response = dowellconnection("dowellscale", "bangalore", "dowellscale",
                                "scale_reports", "scale_reports", "1094", "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response)
    x = data["data"]
    for i in x:
        b = i['score'][0]['instance_id'].split("/")[0]
        context['existing_scales'].append(b)

    name = url.replace("'", "")
    context['template_url'] = f"{public_url}{name}?brand_name=your_brand&product_name=your_product"
    # context['template_url']= f"http://127.0.0.1:8000/{name}?brand_name=your_brand&product_name=your_product"
    return render(request, 'likert/preview_page.html', context)


def default_scale(request):
    context = {}
    context["public_url"] = public_url
    context["left"] = "border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    # context["likertall"] = system_settings.objects.all().order_by('-id')
    return render(request, 'likert/default.html', context)


def default_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/likert/likert-admin/default/")
    username = request.session["user_name"]
    context = {}
    context["public_url"] = public_url
    context['user'] = 'admin'
    context[
        "left"] = "border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);height:300px;overflow-y: scroll;"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    context["username"] = username
    field_add = {"settings.scale_category": "likert scale"}
    all_scales = dowellconnection("dowellscale", "bangalore", "dowellscale",
                                  "scale", "scale", "1093", "ABCDE", "fetch", field_add, "nil")
    data = json.loads(all_scales)
    context["likertall"] = sorted(
        data["data"], key=lambda d: d['_id'], reverse=True)

    return render(request, 'likert/default.html', context)

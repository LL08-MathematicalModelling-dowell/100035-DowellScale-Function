import random
import json
import requests
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, HttpResponse
from nps.dowellconnection import dowellconnection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import datetime
from nps.login import get_user_profile
import urllib
from django.views.decorators.clickjacking import xframe_options_exempt
from nps.eventID import get_event_id
from django.views.decorators.csrf import csrf_exempt
from dowellnps_scale_function.settings import public_url

from api.utils import dowell_time_asian_culta


@api_view(['POST', 'GET', 'PUT'])
def settings_api_view_create(request):
    if request.method == 'POST':
        response = request.data

        try:
            username = response['username']
            orientation = response['orientation']
            scalecolor = response['scalecolor']
            fontcolor = response['fontcolor']
            fontstyle = response['fontstyle']
            time = response['time']
            rand_num = random.randrange(1, 10000)
            template_name = response.get('template_name', f"{response['name'].replace(' ', '')}{rand_num}")
            fomat = response.get('fomat')
            name = response['name']
            center = response['center']
            left = response['left']
            right = response['right']
            no_of_scales = response['no_of_scales']
            label_selection = [center, right, left]
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or misspelt"}, status=status.HTTP_400_BAD_REQUEST)

        custom_emoji_format = {}

        print(fomat)
        if fomat == "emoji":
            custom_emoji_format = response.get('custom_emoji_format', {})
        eventID = get_event_id()
        field_add = {
            "event_id": eventID,
            "username": username,
            "settings": {
                "orientation": orientation,
                "scalecolor": scalecolor,
                "fontcolor": fontcolor,
                "fontstyle": fontstyle,
                "time": time,
                "template_name": template_name,
                "fomat": fomat,
                "label_selection": label_selection,
                "custom_emoji_format": custom_emoji_format,
                "name": name,
                "center": center,
                "left": left,
                "right": right,
                "scale-category": "npslite scale",
                "allow_resp": response.get('allow_resp', True),
                "no_of_scales": no_of_scales,
                "date_created": dowell_time_asian_culta().get("current_time")
            }
        }

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                             field_add, "nil")

        user_json = json.loads(x)
        details = {
            "scale_id": user_json['inserted_id'], "event_id": eventID, "username": username}
        field_add['scale_id'] = user_json['inserted_id']
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE",
                                        "insert", details, "nil")
        return Response({"success": True, "data": field_add})

    elif request.method == 'GET':
        param = request.GET
        scale_id = param.get('scale_id', None)
        if scale_id:
            try:
                field_add = {"_id": scale_id}
                x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                                    field_add, "nil")
                return Response(json.loads(x)['data'], status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": "response does not exist"}, status=status.HTTP_404_NOT_FOUND)
        else:
            field_add = {"settings.scale-category": "npslite scale"}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                                 field_add, "nil")
            return Response(json.loads(x)['data'], status=status.HTTP_200_OK)

    elif request.method == "PUT":
        response = request.data

        try:
            username = response['username']
            scale_id = response['scale_id']
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or misspelt"}, status=status.HTTP_400_BAD_REQUEST)
        
        field_add = {"_id": scale_id, "username": username, "settings.scale-category": "npslite scale"}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                             field_add, "nil")
        scale_data = json.loads(x)
        if scale_data['data'] is None:
            return Response({"Error": "Scale does not exist"}, status=status.HTTP_404_NOT_FOUND)
        settings = scale_data['data'][0]['settings']
        for key in response:
            if key in settings:
                settings[key] = response[key]
        settings['date_updated'] = dowell_time_asian_culta().get("current_time")
        update_field = {"settings": settings}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                             "ABCDE", "update",
                             field_add, update_field)

        return Response({"success": "Successfully Updated", "data": settings})

    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)


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
                process_id = response_data['process_id']
                if not isinstance(process_id, str):
                    return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)
                for single_response in document_responses:
                    score = single_response["score"]
                    scale_id = single_response['scale_id']
                    document_data = {"details": {"action": response_data.get('action', ""),
                                                 "authorized": response_data.get('authorized', ""),
                                                 "cluster": response_data.get('cluster', ""),
                                                 "collection": response_data.get('collection', ""),
                                                 "command": response_data.get('command', ""),
                                                 "database": response_data.get('database', ""),
                                                 "document": response_data.get('document', ""),
                                                 "document_flag": response_data.get('document_flag', ""),
                                                 "document_right": response_data.get('document_right', ""),
                                                 "field": response_data.get('field', ""),
                                                 "flag": response_data.get('flag', ""),
                                                 "function_ID": response_data.get('function_ID', ""),
                                                 "metadata_id": response_data.get('metadata_id', ""),
                                                 "process_id": response_data['process_id'],
                                                 "role": response_data.get('role', ""),
                                                 "team_member_ID": response_data.get('team_member_ID', ""),
                                                 "product_name": response_data.get('product_name', ""),
                                                 "update_field": {"content": response_data.get('content', ""),
                                                                  "document_name": response_data.get('document_name',
                                                                                                     ""),
                                                                  "page": response_data.get('page', "")},
                                                 "user_type": response_data.get('user_type', ""),
                                                 "id": response_data.get('_id')}
                                     }
                    success = response_submit_loop(username, scale_id, score, brand_name, product_name, instance_id,
                                                   process_id, document_data)
                    all_results.append(success.data)
                return Response({"data": all_results}, status=status.HTTP_200_OK)
            else:
                process_id = response_data['process_id']
                if not isinstance(process_id, str):
                    return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)
                scale_id = response_data['scale_id']
                score = response_data["score"]
                instance_id = response_data['instance_id']
                return response_submit_loop(username, scale_id, score, brand_name, product_name, instance_id,
                                            process_id)
        except Exception as e:
            return Response({"Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "GET":
        params = request.GET
        id = params.get("id")
        try:
            field_add = {"scale_data.scale_type": "npslite scale"}
            if id != None:
                field_add["_id"] = id
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                                "scale_reports",
                                                "1094", "ABCDE", "fetch", field_add, "nil")
            data = json.loads(response_data)
            if data.get("data") == []:
                return Response({"error": "Scale response not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response({"data": json.loads(response_data)})
        except:
            return Response({"error": "Response does not exist!"}, status=status.HTTP_400_BAD_REQUEST)


def response_submit_loop(username, scale_id, score, brand_name, product_name, instance_id, process_id=None,
                         document_data=None):
    field_add = {"scale_data.scale_id": scale_id}
    previous_response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                         "1094", "ABCDE", "fetch",
                                         field_add, "nil")
    previous_response = json.loads(previous_response)["data"]

    # Check if scale exists
    field_add = {"_id": scale_id, "settings.scale-category": "npslite scale"}
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

    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                    "ABCDE", "fetch",
                                    {"scale_id": scale_id, "username": username, "instance_id": instance_id}, "nil")
    user_dets = json.loads(user_details)
    if len(user_dets['data']) >= 1:
        print(previous_response)
        b = [l['score']['score'] for l in previous_response if
             l['score']['instance_id'].split("/")[0] == f"{instance_id}" and l['event_id'] == user_dets['data'][0]['event_id']]

        return Response({"error": "Scale Response Exists!", "current_score": b[0]},
                        status=status.HTTP_405_METHOD_NOT_ALLOWED)

    event_id = get_event_id()
    if data['data']['settings'].get('fomat') == "text":
        if score not in data['data']['settings'].get('label_selection'):
            return Response({"error": "Invalid response."}, status=status.HTTP_400_BAD_REQUEST)
    if data['data']['settings'].get('fomat') == "emoji":
        upper_boundary = data['data']['settings'].get('custom_emoji_format')
        if type(score) != int or 0 < score > len(upper_boundary) - 1:
            return Response({"error": "Emoji response must be an integer within label selection range."},
                            status=status.HTTP_400_BAD_REQUEST)


    score_data = {"instance_id": f"{instance_id}/{number_of_scale}",
                  "score": score}
    if int(instance_id) > int(number_of_scale):
        return Response({"Error": "Instance doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
    # Insert new response into database
    response = {
        "event_id": event_id,
        "scale_data": {"scale_id": scale_id, "scale_type": "npslite scale", "instance_id": instance_id},
        "brand_data": {"brand_name": brand_name, "product_name": product_name},
        "score": score_data,
        "date_created": dowell_time_asian_culta().get("current_time")
    }
    if process_id:
        response['process_id'] = process_id

    if document_data:
        response["document_data"] = document_data
    field_add = {"username": username}
    field_add.update(response)
    response_id = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                                   "ABCDE", "insert", field_add, "nil")
    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                    "ABCDE", "insert",
                                    {"scale_id": scale_id, "event_id": event_id, "instance_id": instance_id,
                                     "username": username}, "nil")
    response['inserted_id'] = json.loads(response_id)['inserted_id']
    return Response({"success": True, "payload": response})


@api_view(['GET'])
def npslite_response_view(request, id=None):
    if request.method == 'GET':
        response = request.data
        scale_id = response['scale_id']
        try:
            field_add = {"_id": scale_id}
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE", "fetch", field_add, "nil")
            response_data = json.loads(response_data)
            try:
                response = response_data['data'][0]
            except:
                response = response_data['data']
            return Response({"payload": response})
        except:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"error": response_data})


@api_view(['GET', ])
def scale_response_api_view(request):
    try:
        field_add = {"scale_data.scale_type": "npslite scale", }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                             "1094", "ABCDE", "fetch", field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response(json.loads(x))


def npslite_home_admin(request):
    context = {}
    context["public_url"] = public_url
    context['user'] = 'admin'
    try:
        field_add = {"settings.scale-category": "npslite scale"}
        all_scales = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                      "fetch", field_add, "nil")
        data = json.loads(all_scales)
        context["npslite_all"] = sorted(
            data["data"], key=lambda d: d['_id'], reverse=True)
    except:
        print("No scales found")
    return render(request, 'lite/nps-lite.html', context)


def npslite_home(request):
    context = {}
    context["public_url"] = public_url
    context['user'] = 'user'
    return render(request, 'lite/nps-lite.html', context)


def brand_product_error(request):
    context = {}
    context["public_url"] = public_url
    url = request.COOKIES['url']
    template_name = url.split("/")[3]
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

    print("+++++++++++++ Scale ID", context["no_of_scales"])
    context['existing_scales'] = []
    field_add = {"scale_data.scale_id": scale_id}
    response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                                "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response)
    x = data["data"]
    for i in x:
        b = i['category'][0]['instance_id'].split("/")[0]
        print(b)
        context['existing_scales'].append(b)

    name = url.replace("'", "")
    context['template_url'] = f"{public_url}{name}?brand_name=your_brand&product_name=your_product"
    print("This are the existing scales", context['existing_scales'])
    return render(request, 'lite/embed_page.html', context)


def dowell_npslite_scale_settings(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/nps-lite-admin/settings/")
    # print("+++++++++=>",user)
    context = {}
    context["public_url"] = public_url
    if request.method == 'POST':
        name = request.POST['nameofscale']
        question = request.POST['questionofscale']
        orientation = request.POST['orientation']
        scalecolor = request.POST['scolor']
        fontcolor = request.POST['fcolor']
        left = request.POST["left"]
        center = request.POST["center"]
        right = request.POST["right"]
        time = request.POST['time']
        no_of_scales = request.POST["no_of_scales"]
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        if time == "":
            time = 0
        try:
            eventID = get_event_id()
            field_add = {"eventId": eventID,
                         "settings": {"question": question, "orientation": orientation, "scalecolor": scalecolor,
                                      "fontcolor": fontcolor, "time": time, "template_name": template_name,
                                      "name": name, "center": center, "left": left, "right": right,
                                      "scale-category": "npslite scale", "no_of_scales": no_of_scales}}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                                 field_add, "nil")
            print("This is what is saved", x)
            # User details
            user_json = json.loads(x)
            details = {
                "scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
            user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                            "ABCDE", "insert", details, "nil")
            print("+++++++++++++", user_details)
            return redirect(f"{public_url}/nps-lite/nps-lite-scale/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'lite/settings_page.html', context)


@xframe_options_exempt
@csrf_exempt
def dowell_npslite_scale(request, tname):
    user = request.session.get('user_name')
    if user == None:
        user = "Anonymous"

    print("___+++_+ USER", user)
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
        # return HttpResponse(names_values_dict['brand_name'])
        pls = ls.split("/")
        tname1 = pls[1]
        # resp = response.objects.all()
        # return HttpResponse(resp)
        context["brand_name"] = names_values_dict['brand_name']
        context["product_name"] = names_values_dict['product_name'].split(
            '/')[0]
        context["scale_name"] = tname
    except:
        f_path = request.get_full_path()
        response = redirect('nps_lite:display_embed_page')
        # response.delete_cookie('url')
        response.set_cookie('url', f_path)
        return response

    context["url"] = "../scaleadmin"
    context["urltext"] = "Create new scale"
    context["btn"] = "btn btn-dark"
    context["hist"] = "Scale History"
    context["bglight"] = "bg-light"
    context["left"] = "border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)"
    # context["npsall"]=system_settings.objects.all().order_by('-id')
    # scale settings call
    field_add = {"settings.template_name": tname, }
    default = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                               field_add, "nil")
    data = json.loads(default)

    context["scale_id"] = data['data'][0]['_id']
    x = data['data'][0]['settings']
    context["defaults"] = x
    number_of_scale = x['no_of_scales']
    context["no_of_scales"] = number_of_scale
    current_url = url.split('/')[-1]
    context['cur_url'] = current_url

    # find existing scale reports
    field_add = {"scale_data.scale_id": context["scale_id"]}
    response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                                "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response)

    existing_scale = False
    if len(data['data']) != 0 and data['data'][0]['_id'] != '642f1f98b85416d087c3ac57':
        score_data = data["data"]

        for i in score_data:
            instance_id = i['category'][0]['instance_id'].split("/")[0]
            if instance_id == current_url:
                existing_scale = True
                context['response_saved'] = i['category'][0]['category']
                context['score'] = "show"
        if data["data"][0]["scale_data"]["scale_id"] == "63b7ccac0175aa060a42b554":
            existing_scale = False
            # context['response_saved'] = i['score'][0]['score']
            context['score'] = ""

    if request.method == 'POST':
        category = request.POST['scoretag']
        eventID = get_event_id()
        category = {
            "instance_id": f"{current_url}/{context['no_of_scales']}", 'category': category}
        if len(data['data']) != 0:
            if data["data"][0]["scale_data"]["scale_id"] == "63b7ccac0175aa060a42b554":
                category = {"instance_id": f"Default", 'category': category}

        if existing_scale == False:
            try:
                field_add = {"event_id": eventID,
                             "scale_data": {"scale_id": context["scale_id"], "scale_type": "nps scale"},
                             "brand_data": {"brand_name": context["brand_name"],
                                            "product_name": context["product_name"]}, "category": [category]}
                x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                     "1094", "ABCDE", "insert", field_add, "nil")
                print("Nps Lite Scale Response---->", x)
                # User details
                user_json = json.loads(x)
                details = {
                    "scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
                user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                                "ABCDE", "insert", details, "nil")
                context['score'] = "show"
                print("++++++++++", user_details)
                # return redirect(f"https://100014.pythonanywhere.com/main")
            except:
                context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'lite/single_scale.html', context)

import imghdr
import random
import base64
import datetime
import json
import re

from django.shortcuts import render, redirect
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from nps.dowellconnection import dowellconnection
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from nps.eventID import get_event_id
from dowellnps_scale_function.settings import public_url
from django.core.files.storage import default_storage
from concurrent.futures import ThreadPoolExecutor


# CREATE SCALE SETTINGS
@api_view(['POST', 'PUT', 'GET'])
def settings_api_view_create(request):
    global image_label_format
    if request.method == 'POST':
        try:
            response = request.data
            try:
                user = response['username']
            except:
                return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)
            left = response['left']
            right = response['right']
            text = f"{left}+{right}"
            time = response.get('time', 0)
            no_of_scales = response.get('no_of_scales', 1)
            spacing_unit = int(response['spacing_unit'])
            scale_lower_limit = int(response['scale_upper_limit'])
            scale = []
            scale = [i for i in range(-scale_lower_limit, int(response['scale_upper_limit']) + 1) if
                     i % response['spacing_unit'] == 0 and i != 0]
            if int(response['scale_upper_limit']) > 10 or int(
                    response['scale_upper_limit']) < 0 or spacing_unit > 5 or spacing_unit < 1:
                raise Exception("Check scale limits and spacing_unit")

            rand_num = random.randrange(1, 10000)
            name = response['name']
            template_name = response.get('template_name', f"{name.replace(' ', '')}{rand_num}")
            custom_emoji_format = {}
            image_label_format = {}

            eventID = get_event_id()
            fomat = response.get('fomat')
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

                    image_path = f'images/{key}.{image_format}'  # Define a unique path for each image
                    default_storage.save(image_path, image_bytes)
                    image_label_format[key] = image_path

                with ThreadPoolExecutor() as executor:
                    futures = [executor.submit(save_image, key, image_data) for key, image_data in
                               image_label_format.items()]
                    # Wait for all image saving tasks to complete
                    for future in futures:
                        future.result()

            field_add = {"event_id": eventID,
                         "settings": {
                             "orientation": response['orientation'],
                             "spacing_unit": spacing_unit,
                             "scale_upper_limit": response['scale_upper_limit'],
                             "scale_lower_limit": -scale_lower_limit,
                             "scalecolor": response['scalecolor'],
                             "roundcolor": response['roundcolor'],
                             "fontcolor": response['fontcolor'],
                             "fomat": fomat,
                             "time": time,
                             "image_label_format": image_label_format,
                             "custom_emoji_format": custom_emoji_format,
                             "template_name": template_name,
                             "name": name, "text": text,
                             "left": response['left'],
                             "right": response['right'],
                             "scale": scale,
                             "scale-category": "stapel scale",
                             "allow_resp": response.get('allow_resp', True),
                             "no_of_scales": no_of_scales,
                             "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                         }
                         }

            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                                 field_add, "nil")

            user_json = json.loads(x)
            details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
            user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                            "ABCDE",
                                            "insert", details, "nil")
            return Response({"success": x, "data": field_add}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        try:
            response = request.data
            id = response['scale_id']
            field_add = {"_id": id}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "fetch", field_add, "nil")
            settings_json = json.loads(x)
            settings = settings_json['data'][0]['settings']

            left = response.get('left', settings["left"])
            scale_upper_limit = int(response.get('scale_upper_limit', settings["scale_upper_limit"]))
            right = response.get('right', settings["right"])
            text = f"{left}+{right}"
            name = settings["name"]
            time = response.get('time', settings["time"])
            template_name = settings["template_name"]
            if time == "":
                time = 0
            orientation = response.get('orientation', settings["orientation"])
            scalecolor = response.get('scalecolor', settings["scalecolor"])
            allow_resp = response.get('allow_resp', settings["allow_resp"])
            roundcolor = response.get('roundcolor', settings["roundcolor"])
            fontcolor = response.get('fontcolor', settings["fontcolor"])
            spacing_unit = response.get('spacing_unit', settings["spacing_unit"] or 1)
            scale_lower_limit = int(response.get('scale_upper_limit'))

            scale = [i for i in range(-scale_lower_limit, scale_upper_limit + 1) if
                     i % int(spacing_unit) == 0 and i != 0]

            update_field = {"settings": {"orientation": orientation,
                                         "scale_upper_limit": scale_upper_limit,
                                         "scale_lower_limit": -scale_lower_limit,
                                         "scalecolor": scalecolor,
                                         "spacing_unit": spacing_unit,
                                         "no_of_scales": settings["no_of_scales"],
                                         "roundcolor": roundcolor,
                                         "fontcolor": fontcolor,
                                         "fomat": response["fomat"],
                                         "time": time,
                                         "template_name": template_name,
                                         "name": name,
                                         "text": text,
                                         "left": left,
                                         "right": right,
                                         "scale": scale,
                                         "allow_resp": allow_resp,
                                         "scale-category": "stapel scale",
                                         "date_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                                         }
                            }

            if response.get('fomat') == "image":
                image_label_format = settings.get('image_label_format', {})
                update_field["settings"]["fomat"] = "image"
                if 'image_label_format' in response:
                    image_label_format.update(response.get('image_label_format', {}))
                update_field["settings"]["image_label_format"] = image_label_format

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

                    image_path = f'images/{key}.{image_format}'  # Define a unique path for each image
                    default_storage.save(image_path, image_bytes)
                    image_label_format[key] = image_path

                with ThreadPoolExecutor() as executor:
                    futures = [executor.submit(save_image, key, image_data) for key, image_data in
                               image_label_format.items()]
                    # Wait for all image saving tasks to complete
                    for future in futures:
                        future.result()

            elif response.get('fomat') == "emoji":
                custom_emoji_format = settings.get('custom_emoji_format', {})
                update_field["settings"]["fomat"] = "emoji"
                if 'custom_emoji_format' in response:
                    custom_emoji_format.update(response.get('custom_emoji_format', {}))
                update_field["settings"]["custom_emoji_format"] = custom_emoji_format

            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                 field_add, update_field)

            return Response({"success": "Successful Updated ", "data": update_field})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        try:
            response = request.data
            scale_id = response.get('scale_id')
            if not scale_id:
                field_add = {"settings.scale-category": "stapel scale"}
                response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                                 "ABCDE", "fetch", field_add, "nil")
                return Response({"data": json.loads(response_data)}, status=status.HTTP_200_OK)

            field_add = {"_id": scale_id, "settings.scale-category": "stapel scale"}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "find", field_add, "nil")
            settings_json = json.loads(x)
            if not settings_json.get('data'):
                return Response({"error": "scale not found"}, status=status.HTTP_404_NOT_FOUND)

            settings = settings_json['data']['settings']
            return Response({"success": settings})
        except Exception as e:
            return Response({"Error": "Invalid fields!", "Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# SUMBIT SCALE RESPONSE
@api_view(['POST', 'GET'])
def stapel_response_view_submit(request):
    if request.method == 'POST':
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
                    success = response_submit_loop(response, scale_id, instance_id, user, score)
                    resp.append(success.data)
                return Response({"data": resp}, status=status.HTTP_200_OK)
            else:
                scale_id = response['scale_id']
                score = response.get('score', '0')
                instance_id = response['instance_id']
                return response_submit_loop(response, scale_id, instance_id, user, score)
        except Exception as e:
            return Response({"Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)


    elif request.method == "GET":
        response = request.data
        try:
            if "scale_id" in response:
                id = response['scale_id']
                field_add = {"scale_data.scale_id": id, "scale_data.scale_type": "stapel scale"}
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
            return key
    return None


def response_submit_loop(response, scale_id, instance_id, user, score):
    field_add = {"_id": scale_id, "settings.scale-category": "stapel scale"}
    default = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                               "fetch", field_add, "nil")
    data = json.loads(default)
    if data['data'] is None:
        return Response({"Error": "Scale does not exist"})

    x = data['data'][0]['settings']
    number_of_scale = x['no_of_scales']


    if x['fomat'] == 'emoji':
        try:
            if is_emoji(score):
                print("Hello Ambrose")
                saved_emojis = x["custom_emoji_format"]
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
        elif score not in x['scale']:
            return Response({"error": "Invalid Selection.", "Options": x['scale']}, status=status.HTTP_400_BAD_REQUEST)

    # find existing scale reports
    field_add = {"scale_data.scale_id": scale_id}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                     "1094",
                                     "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response_data)
    total_score = 0

    score_data = data.get("data", [])
    total_score = sum(int(i['score'][0]['score']) for i in score_data)

    if any(int(i['score'][0]['instance_id'].split("/")[0]) == instance_id for i in score_data):
        return Response({"error": "Scale Response Exists!", "total score": total_score},
                        status=status.HTTP_405_METHOD_NOT_ALLOWED)
    eventID = get_event_id()
    score = {"instance_id": f"{instance_id}/{number_of_scale}", 'score': score}

    if int(instance_id) > int(number_of_scale):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    field_add = {"event_id": eventID, "scale_data": {"scale_id": scale_id, "scale_type": "stapel scale"},
                 "brand_data": {"brand_name": response["brand_name"], "product_name": response["product_name"]},
                 "score": [score]}
    z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                         "ABCDE", "insert", field_add, "nil")
    user_json = json.loads(z)
    details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "instance_id": instance_id,
               "username": user}
    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE",
                                    "insert", details, "nil")

    return Response({"success": z, "payload": field_add, "total score": total_score})


# GET ALL SCALES
@api_view(['GET', ])
def scale_settings_api_view(request):
    try:
        field_add = {"settings.scale-category": "stapel scale"}
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
        field_add = {"_id": id}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                             "fetch", field_add, "nil")
        settings_json = json.loads(x)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({"payload": settings_json})


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
        field_add = {"scale_data.scale_type": "stapel scale", }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                             "1094", "ABCDE", "fetch", field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(json.loads(x))


def dowell_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(
            f"https://uxlivinglab.pythonanywhere.com/?redirect_url={public_url}/stapel/stapel-admin/settings/")
    context = {}
    context["public_url"] = public_url
    if request.method == 'POST':
        name = request.POST['nameofscale']
        orientation = request.POST['orientation']
        scale_upper_limit = int(request.POST['scale_upper_limit'])
        scalecolor = request.POST['scolor']
        roundcolor = request.POST['rcolor']
        fontcolor = request.POST['fcolor']
        fomat = "numbers"
        left = request.POST["left"]
        right = request.POST["right"]
        no_of_scales = request.POST["no_of_scales"]
        time = request.POST['time']
        spacing_unit = int(request.POST['spacing_unit'])
        text = f"{left}+{right}"
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        scale = []
        context['scale'] = scale
        scale = [i for i in range(-(scale_upper_limit), scale_upper_limit + 1) if i % spacing_unit == 0 and i != 0]
        if scale_upper_limit > 10 or scale_upper_limit < 0 or spacing_unit > 5 or spacing_unit < 1:
            raise Exception("Check scale limits and spacing_unit")

        if time == "":
            time = 0
        try:
            eventID = get_event_id()
            field_add = {"event_id": eventID, "settings": {"orientation": orientation, "spacing_unit": spacing_unit,
                                                           "scale_upper_limit": scale_upper_limit,
                                                           "scale_lower_limit": -scale_upper_limit,
                                                           "scalecolor": scalecolor, "roundcolor": roundcolor,
                                                           "fontcolor": fontcolor, "fomat": fomat, "time": time,
                                                           "template_name": template_name, "name": name, "text": text,
                                                           "left": left, "right": right, "scale": scale,
                                                           "scale-category": "stapel scale",
                                                           "no_of_scales": no_of_scales}}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                                 field_add, "nil")
            # User details
            user_json = json.loads(x)
            details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
            user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                            "ABCDE", "insert", details, "nil")
            return redirect(f"{public_url}/stapel/stapel-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'stapel/scale_admin.html', context)


@xframe_options_exempt
@csrf_exempt
def dowell_scale1(request, tname1):
    user = request.session.get('user_name')
    if user == None:
        user = "Anonymous"
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
        tname = pls[1]
        # resp = response.objects.all()
        # return HttpResponse(resp)
        context["brand_name"] = names_values_dict['brand_name']
        context["product_name"] = names_values_dict['product_name'].split('/')[0]
        context["scale_name"] = tname1
    except:
        f_path = request.get_full_path()
        response = redirect('stapel:error_page')
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
    context["scale_id"] = data['data'][0]['_id']
    x = data['data'][0]['settings']
    context["defaults"] = x
    context["scale"] = x['scale']
    context["text"] = x['text'].split("+")
    number_of_scale = x['no_of_scales']
    context["no_of_scales"] = number_of_scale
    url = request.build_absolute_uri()
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
        total_score = sum(
            int(i['score'][0]['score']) for i in score_data if len(i['score'][0]['instance_id'].split("/")[0]) <= 3)

        existing_scale = any(i['score'][0]['instance_id'].split("/")[0] == current_url for i in score_data)
        if existing_scale:
            context['response_saved'] = next(
                i['score'][0]['score'] for i in score_data if i['score'][0]['instance_id'].split("/")[0] == current_url)
            context['score'] = "show"

    if request.method == 'POST':
        score = request.POST['scoretag']
        eventID = get_event_id()
        score = {"instance_id": f"{current_url}/{context['no_of_scales']}", 'score': score}
        if existing_scale == False:
            try:
                field_add = {"event_id": eventID,
                             "scale_data": {"scale_id": context["scale_id"], "scale_type": "stapel scale"},
                             "brand_data": {"brand_name": context["brand_name"],
                                            "product_name": context["product_name"]},
                             "score": [score]}
                z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                     "1094", "ABCDE", "insert", field_add, "nil")

                # User details
                user_json = json.loads(z)
                details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
                user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                                "ABCDE", "insert", details, "nil")
                context['score'] = "show"

            except:
                context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'stapel/single_scale.html', context)


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
    context["no_of_scales"] = list(range(int(number_of_scale)))

    context['existing_scales'] = []
    field_add = {"scale_data.scale_id": scale_id}
    response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
                                "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response)
    x = data["data"]
    existing_scales = [i['score'][0]['instance_id'].split("/")[0] for i in x]
    context['existing_scales'].extend(existing_scales)

    name = url.replace("'", "")
    context['template_url'] = f"{public_url}{name}?brand_name=your_brand&product_name=your_product"
    return render(request, 'stapel/error_page.html', context)


def default_scale(request):
    context = {}
    context["public_url"] = public_url
    context["left"] = "border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    # context["npsall"] = system_settings.objects.all().order_by('-id')
    return render(request, 'stapel/default.html', context)


def default_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/stapel/stapel-admin/default/")

    # if role != owner:
    #     return redirect("https://100035.pythonanywhere.com/nps-scale/default/")

    context = {}
    context["public_url"] = public_url
    context['user'] = 'admin'
    context[
        "left"] = "border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);height:300px;overflow-y: scroll;"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    try:
        field_add = {"settings.scale-category": "stapel scale"}
        all_scales = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                      "fetch", field_add, "nil")
        data = json.loads(all_scales)
        context["stapelall"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)
    except:
        pass
    return render(request, 'stapel/default.html', context)

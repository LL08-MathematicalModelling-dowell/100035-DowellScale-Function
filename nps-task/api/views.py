import random
import json
from nps.dowellconnection import dowellconnection
from nps.eventID import get_event_id
from dowellnps_scale_function.settings import public_url

from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

# CREATE SCALE SETTINGS
@api_view(['POST',])
def settings_api_view_create(request):
    if request.method == 'POST':
        response = request.data
        try:
            user = response['username']
        except:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

        rand_num = random.randrange(1, 10000)
        name = response['name']
        template_name = f"{name.replace(' ', '')}{rand_num}"
        scales=[response.get('scale_choice 0', "None"),
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
                                  "scales":scales}}

        print(field_add)
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
            field_add, "nil")

        user_json = json.loads(x)
        details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE",
            "insert", details, "nil")
        urls = []
        for i in range(1, response['no_of_scales'] + 1):
            url = f"{public_url}/likert/likert-scale1/{template_name}?brand_name=your_brand&product_name=product_name/{i}"
            urls.append(url)
        return Response({"success": x, "payload": field_add, "scale_urls": urls})
    return Response({"error": "Invalid data provided."},status=status.HTTP_400_BAD_REQUEST)

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

        # # find existing scale reports
        # field_add = {"scale_data.scale_id": id}
        # response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
        #     "ABCDE", "fetch", field_add, "nil")
        # data = json.loads(response)
        # print(data)
        # if len(data['data']) != 0:
        #     score_data = data["data"]
        #     instance_id = response['instance_id']
        #     print(instance_id)
        #     for i in score_data:
        #         if instance_id == i['score'][0]['instance_id'].split("/")[0]:
        #             return Response({"error": "Scale Response Exists!"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        eventID = get_event_id()
        score = {"instance_id": f"{response['instance_id']}/{number_of_scale}", 'score': response['score']}

        if int(response['instance_id']) > int(number_of_scale):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        field_add = {"event_id": eventID, "scale_data": {"scale_id": id, "scale_type": "nps scale"},
                     "brand_data": {"brand_name": response["brand_name"], "product_name": response["product_name"]},
                     "score": [score]}
        z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
            "ABCDE", "insert", field_add, "nil")
        user_json = json.loads(z)
        details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
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
        field_add = {"_id": id }
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
        field_add = {"_id": id }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
            "1094", "ABCDE", "fetch", field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({"payload":json.loads(x)})

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
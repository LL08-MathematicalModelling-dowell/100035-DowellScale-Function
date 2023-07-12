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
from .eventID import get_event_id
from django.views.decorators.csrf import csrf_exempt
from dowellnps_scale_function.settings import public_url



@api_view(['POST','GET','PUT'])
def settings_api_view_create(request):
    if request.method == 'POST':
        response = request.data
        try:
            user = response['user']
        except:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            name = response['name']
            low_label = response['low_label']
            high_label = response['high_label']
            scale_category = response['scale_category']
            scale_type = response['scale_type']
            orientation = response['orientation']
            font_color = response['font_color']
            round_color = response['round_color']
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or misspelt"}, status=status.HTTP_400_BAD_REQUEST)
        
        event_id = str(datetime.datetime.now().timestamp()).replace(".", "")
        field_add = {
            "event_id": event_id,
            "user": user,
            "name": name,
            "low_label": low_label,
            "high_label": high_label,
            "scale_category": scale_category,
            "scale_type": scale_type,
            "orientation": orientation,
            "font_color": font_color,
            "round_color": round_color,
            "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        x = dowellconnection("dowell_npslite_scale", "bangalore", "dowell_npslite_scale", "scale", "scale", "1093", "ABCDE", "insert",
            field_add, "nil")

        user_json = json.loads(x)
        details = {"scale_id": user_json['inserted_id'], "event_id": event_id, "user": user}
        user_details = dowellconnection("dowell_npslite_scale", "bangalore", "dowell_npslite_scale", "users", "users", "1098", "ABCDE",
            "insert", details, "nil")
        return Response({"success": x, "data": field_add})

    elif request.method == 'GET':
        response = request.data
        if "scale_id" in response:
            scale_id = response['scale_id']
            field_add = {"_id": scale_id}
            x = dowellconnection("dowell_npslite_scale", "bangalore", "dowell_npslite_scale", "scale", "scale", "1093", "ABCDE",
                "fetch", field_add, "nil")
            return Response({"data": json.loads(x)})
        else:
            field_add = {"scale_category": "npslite scale"}
            x = dowellconnection("dowell_npslite_scale", "bangalore", "dowell_npslite_scale", "scale", "scale", "1093", "ABCDE", "fetch",
                field_add, "nil")
            return Response({"data": json.loads(x)})

    elif request.method == "PUT":
        response = request.data
        if "scale_id" not in response:
            return Response({"error": "scale_id missing or misspelt"}, status=status.HTTP_400_BAD_REQUEST)
        scale_id = response["scale_id"]
        field_add = {"_id": scale_id}
        x = dowellconnection("dowell_npslite_scale", "bangalore", "dowell_npslite_scale", "scale", "scale", "1093", "ABCDE",
            "fetch", field_add, "nil")
        scale_data = json.loads(x)['data'][0]
        for key in response:
            if key in scale_data:
                scale_data[key] = response[key]
        scale_data['date_updated'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        update_field = {"$set": scale_data}
        x = dowellconnection("dowell_npslite_scale", "bangalore", "dowell_npslite_scale", "scale", "scale", "1093", "ABCDE",
            "update", field_add, update_field)
        return Response({"success": "Successfully Updated", "data": scale_data})

    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def submit_response_view(request):
    response_data = request.data
    try:
        user = response_data['user']
        scale_id = response_data['scale_id']
        event_id = response_data['event_id']
        response = response_data['response']
    except KeyError as e:
        return Response({"error": f"Missing required parameter {e}"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user is authorized to submit response
    user_data = dowellconnection("dowell_npslite_scale", "bangalore", "dowell_npslite_scale", "users", "users", "1098", "ABCDE", "fetch", {"user": user}, "nil")
    if not user_data:
        return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Check if scale exists
    scale = dowellconnection("dowell_npslite_scale", "bangalore", "dowell_npslite_scale", "scale", "scale", "1093", "ABCDE", "fetch", {"_id": scale_id}, "nil")
    if not scale:
        return Response({"error": "Scale not found."}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if scale is of type "npslite scale"
    scale_settings = json.loads(scale)
    if scale_settings['data'][0]['scale_category'] != 'npslite scale':
        return Response({"error": "Invalid scale type."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if response already exists for this event
    existing_response = dowellconnection("dowell_npslite_scale", "bangalore", "dowell_npslite_scale", "responses", "responses", "1095", "ABCDE", "fetch", {"event_id": event_id}, "nil")    
    existing_response = json.loads(existing_response)    
    if isinstance(existing_response, dict) and existing_response['data']:
        return Response({"error": "Response already exists."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Insert new response into database
    response = {
        "event_id": event_id,
        "user": user,
        "scale_id": scale_id,
        "response": response,
        "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    response_id = dowellconnection("dowell_npslite_scale", "bangalore", "dowell_npslite_scale", "responses", "responses", "1094", "ABCDE", "insert", response, "nil")
    
    return Response({"success": True, "response_id": response_id})


@api_view(['GET'])
def npslite_response_view(request, id=None):
    try:
        field_add = {"_id": id}
        response_data = dowellconnection("dowell_npslite_scale", "bangalore", "dowell_npslite_scale", "responses", "responses", "1094", "ABCDE", "fetch", field_add, "nil")
        response_data = json.loads(response_data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET' and 'data' in response_data and response_data['data']:
        response = response_data['data'][0]
        return Response({"payload": response})
    else:
        return Response(status=status.HTTP_404_NOT_FOUND, data={"error": response_data})



def npslite_home_admin(request):
    context = {}
    context["public_url"] = public_url
    context['user'] = 'admin'
    try:
        field_add = {"settings.scale-category": "npslite scale"}
        all_scales = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
        data = json.loads(all_scales)
        context["npslite_all"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)
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

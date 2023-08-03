import random
import datetime
import json
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from nps.dowellconnection import dowellconnection
from nps.login import get_user_profile
import urllib
from django.views.decorators.clickjacking import xframe_options_exempt
from nps.eventID import get_event_id
from dowellnps_scale_function.settings import public_url

# CREATE SCALE SETTINGS
@api_view(['POST','GET','PUT'])
def settings_api_view_create(request):
    if request.method == 'POST':
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
            number_of_scales = response['no_of_scale']
            orientation = response['orientation']
            scale_color = response['scale_color']
            product_count = response['product_count']
            product_names = response['product_names']
            user = response['user']
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or mispelt"}, status=status.HTTP_400_BAD_REQUEST)
        if len(product_names) != int(product_count):
            return Response({"error": "Product count and number of product names count should be same"},
                                status=status.HTTP_400_BAD_REQUEST)
        if len(product_names) != len(set(product_names)):
            return Response({"error": "Product names must be unique"}, status=status.HTTP_400_BAD_REQUEST)
        eventID = get_event_id()
        field_add = {"event_id": eventID,
                         "settings": {"orientation": orientation, "scale_color": scale_color,
                                      "number_of_scales": number_of_scales,
                                      "left" : "0%", "right" : "100%",
                                      "time": time, "name": name, "scale-category": "percent scale", "user": user,
                                      "product_names": product_names, "product_count": product_count,
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
        return Response({"success": x, "data": field_add})
    elif request.method == 'GET':
        try:
            response = request.data
            scale_id = response.get('scale_id')
            if not scale_id:
                field_add = {"settings.scale-category": "percent scale"}
                response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                                 "ABCDE", "fetch", field_add, "nil")
                return Response({"data": json.loads(response_data)}, status=status.HTTP_200_OK)

            field_add = {"_id": scale_id, "settings.scale-category": "percent scale"}
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
            if ("product_count" or "product_names") in response:
                product_count = response['product_count']
                product_names = response['product_names']
                if len(product_names) != int(product_count):
                    return Response({"error": "Product count and number of product names count should be same"},
                                    status=status.HTTP_400_BAD_REQUEST)
                if len(product_names) != len(set(product_names)):
                    return Response({"error": "Product names must be unique"}, status=status.HTTP_400_BAD_REQUEST)
            id = response['scale_id']
            field_add = {"_id": id, }
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                                 "fetch", field_add, "nil")
            settings_json = json.loads(x)
            settings = settings_json['data'][0]['settings']
            name = settings["name"]
            for key in settings.keys():
                if key in response:
                    settings[key] = response[key]
            settings["name"] = name
            settings["scale-category"] = "percent_sum scale"
            settings["date_updated"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            update_field = {"settings": settings}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
                                 field_add, update_field)
            return Response({"success": "Successfully Updated ", "data": settings})
        except Exception as e:
            return Response({"Error": "Invalid fields!","Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# SUMBIT SCALE RESPONSE
@api_view(['POST',])
def percent_response_view_submit(request):
    if request.method == 'POST':
        try:
            response_data = request.data
            try:
                username = response_data['username']
                scale_id = response_data['scale_id']
            except KeyError as e:
                return Response({"error": f"Missing required parameter {e}"}, status=status.HTTP_400_BAD_REQUEST)
             # Check if user is authorized to submit response
            user = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE", "fetch",
                                    {"username": username}, "nil")
            if not user:
                return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

            # Check if scale exists
            scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                                     {"_id": scale_id}, "nil")
            if not scale:
                return Response({"error": "Scale not found."}, status=status.HTTP_404_NOT_FOUND)

            # Check if scale is of type "percent scale"
            scale = json.loads(scale)
            if scale['data'][0]['settings'].get('scale-category') != 'percent scale':
                return Response({"error": "Invalid scale type."}, status=status.HTTP_400_BAD_REQUEST)
            if "document_responses" in response_data:
                document_responses = response_data["document_responses"]
                all_results = []
                for single_response in document_responses:
                    responses = single_response["responses"]
                    success = response_submit_loop(responses, scale_id, scale, username)
                    all_results.append(success.data)
                return Response({"data": all_results}, status=status.HTTP_200_OK)
            else:
                responses = response_data['responses']
                return response_submit_loop(responses, scale_id, scale, username)
        except Exception as e:
            return Response({"Exception": str(e)}, status=status.HTTP_400_BAD_REQUEST)

def response_submit_loop(responses, scale_id, scale, username):
    event_id = get_event_id()
    # Check if all required responses are present
    expected_responses = scale['data'][0]['settings']['ProductCount']
    if int(expected_responses) != len(responses):
        return Response({"error": "Incorrect number of responses."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if all responses are valid numbers between 0 and 100
    for response in responses:
        if not isinstance(response, (int, float)) or response < 0 or response > 100:
            return Response({"error": "Invalid response."}, status=status.HTTP_400_BAD_REQUEST)
    # Check if response already exists for this event
    existing_response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                            "scale_reports",
                                            "1095", "ABCDE", "fetch", {"event_id": event_id}, "nil")

    existing_response = json.loads(existing_response)

    if isinstance(existing_response, dict) and existing_response['data']:
        return Response(
            {"error": "Response already exists.", "percent_sum": existing_response['data'][0]['percent_sum']},
            status=status.HTTP_405_METHOD_NOT_ALLOWED)

    # Insert new response into database
    response = {
        "event_id": event_id,
        "username": username,
        "scale_id": scale_id,
        "responses": responses,
        "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    response_id = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                    "1095",
                                    "ABCDE", "insert", response, "nil")

    return Response({"success": True, "response_id": response_id})

# GET SINGLE SCALE RESPONSE
@api_view(['GET',])
def single_scale_response_api_view(request, id=None):
    try:
        field_add = {"_id": id}
        scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                                 field_add, "nil")
        scale_data = json.loads(scale)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        settings = scale_data['data'][0]['settings']
        if settings.get('scale-category') != 'percent scale':
            return Response({"error": "Invalid scale type."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"payload": scale_data['data']})
    
@api_view(['GET', ])
def scale_response_api_view(request):
    try:
        field_add = {"scale_data.scale_type": "percent scale", }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                             "1094", "ABCDE", "fetch", field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response(json.loads(x))



def dowell_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/percent/percent-admin/settings/")
    context={}
    context["public_url"] = public_url

    if request.method == 'POST':
        name = request.POST['nameofscale']
        orientation = request.POST['orientation']
        scalecolor = request.POST['scolor']
        time = request.POST['time']
        number_of_scales=request.POST['numberofscale']
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        eventID = get_event_id()
        scale_type="percent scale"
        try:
            field_add={"event_id":eventID,"settings":{"orientation":orientation,"scalecolor":scalecolor,"time":time,"template_name":template_name,"number_of_scales":number_of_scales, "name":name, "scale-category": "percent scale","scale_type":scale_type,} }
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
            #return redirect(f"http://127.0.0.1:8000/percent/percent-scale1/{template_name}")

            # User details
            user_json = json.loads(x)
            details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
            user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")
            return redirect(f"{public_url}/percent/percent-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'percent/scale_admin.html', context)

@xframe_options_exempt
def dowell_scale1(request, tname1):
    user = request.session.get('user_name')
    if user == None:
        user = "Anonymous"
    context={}
    context["public_url"] = public_url
    brand_name = request.GET.get('brand_name', None)
    product_name = request.GET.get('product_name', None)
    ls = request.path
    url = request.build_absolute_uri()
    #print(url)
    try:
        x,s = url.split('?')
        names_values_dict = dict(x.split('=') for x in s.split('&'))
        xy = x[1].replace('&', ',')
        y = xy.replace('=', ':')
        z = '{'+y+'}'
        pls = ls.split("/")
        tname = pls[1]
        context["brand_name"] = names_values_dict['brand_name']
        context["product_name"] = names_values_dict['product_name']
        context["scale_name"] = tname1
    except:
        f_path = request.get_full_path()
        response = redirect('percent:preview_page')
        response.set_cookie('url', f_path)
        return response

    context["url"]="../scaleadmin"
    context["urltext"]="Create new scale"
    context["btn"]="btn btn-dark"
    context["hist"]="Scale History"
    context["bglight"]="bg-light"
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)"
    
    field_add={"settings.template_name":tname1}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    #print(data)
    context["scale_id"] = data['data'][0]['_id']
    x= data['data'][0]['settings']
    context["defaults"]=x
    number_of_scale=x['number_of_scales']

    context["no_of_scales"]=number_of_scale
    num = url.split('/')
    url_id = num[-1]
    field_add={"scale_data.scale_id":context["scale_id"]}
    response=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","fetch",field_add,"nil")
    data=json.loads(response)
    datas=data["data"]
    #print(datas)
    existing_scale=False
    context["recorded_score"]=101
    if len(datas) != 0:
        for i in datas:
            if url_id == i["score"][0]["instance_id"].split('/')[0]:
                existing_scale = True
                recorded_score=(i["score"][0]["score"])
                context["recorded_score"]=recorded_score
                context['score'] = "show"


    if request.method == 'POST':
        current_url = url.split('/')[-1]
        score = request.POST['scoretag']
        eventID = get_event_id()
        score = {'instance_id': f"{current_url}/{context['no_of_scales']}", 'score':score}
        #print("Testing... 1", score)
        if existing_scale == False:
            try:
                field_add={"event_id":eventID,"scale_data":{"scale_id":context["scale_id"],"scale_type":"percent scale"}, "brand_data":{"brand_name":context["brand_name"],"product_name":context["product_name"]},"score":[score]}
                x=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","insert",field_add,"nil")

                # User details
                user_json = json.loads(x)
                details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
                user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")
                context["score"] = "show"

                return redirect(f"{url}")
            except:
                context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request,'percent/single_scale.html',context)

def brand_product_preview(request):
    context = {}
    context["public_url"] = public_url
    url = request.COOKIES['url']
    template_name = url.split("/")[-1]
    field_add={"settings.template_name":template_name}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    #print(data)
    x= data["data"][0]['settings']
    #print(x)
    context["defaults"]=x
    """for i in x:
        number_of_scale=i['number_of_scales']    """
    number_of_scale=x["number_of_scales"]
    scale_id = data['data'][0]["_id"]
    context["no_scales"]=int(number_of_scale)
    context["no_of_scales"]=[]
    for i in range(int(number_of_scale)):
        context["no_of_scales"].append(i)
        
    context['existing_scales'] = []
    field_add = {"scale_data.scale_id": scale_id}
    response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094","ABCDE", "fetch", field_add, "nil")
    data = json.loads(response)
    x = data["data"]
    for i in x:
        b = i['score'][0]['instance_id'].split("/")[0]
        #print(b)
        context['existing_scales'].append(b)
    name=url.replace("'","")
    context['template_url']= f"{public_url}{name}?brand_name=your_brand&product_name=your_product"
    #context['template_url']= f"http://127.0.0.1:8000/{name}?brand_name=your_brand&product_name=your_product"
    return render(request, 'percent/preview_page.html', context)

def default_scale(request):
    context = {}
    context["public_url"] = public_url
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    return render(request, 'percent/default.html', context)

def default_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}onanywhere.com/percent/percent-admin/default/")
    # print("++++++++++ USER DETAILS", user)
    username= request.session["user_name"]
    context = {}
    context["public_url"] = public_url
    context['user'] = 'admin'
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);height:300px;overflow-y: scroll;"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    context["username"]=username
    field_add = {"settings.scale-category": "percent scale"}
    all_scales = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data = json.loads(all_scales)
    #print(data)
    context["percentall"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)

    return render(request, 'percent/default.html', context)




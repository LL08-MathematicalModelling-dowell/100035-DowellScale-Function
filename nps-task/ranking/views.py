import random
import datetime
import json
import requests
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from nps.dowellconnection import dowellconnection
from rest_framework import status
from nps.login import get_user_profile
import urllib
from django.views.decorators.clickjacking import xframe_options_exempt
from nps.eventID import get_event_id
from dowellnps_scale_function.settings import public_url
import uuid


# CREATE SCALE SETTINGS API
@api_view(['POST', 'GET', 'PUT'])
def settings_api_view_create(request):
    if request.method == 'POST':
        data = request.data
        try:
            user = data['user']
        except KeyError:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            scale_name = data['scale_name']
            products = data['products']
            orientation = data['orientation']
            scale_color = data['scale_color']
            shuffling = data.get('shuffling', 'Random') # default value is 'Random'
            units = data.get('units', 'Unique Ranking') # default value is 'Unique Ranking'
            time = data.get('time', 0) # default value is 0
        except KeyError as error:
            return Response({"error": f"{error.args[0]} missing or misspelled"}, status=status.HTTP_400_BAD_REQUEST)

        # Check that all products have 'name' attribute
        for product in products:
            if 'name' not in product:
                return Response({"error": "Each product should have a 'name' attribute."},
                                status=status.HTTP_400_BAD_REQUEST)

        # Generate unique IDs for products that do not have one
        for product in products:
            if 'id' not in product:
                product['id'] = str(uuid.uuid4())

        # Sort products based on selected shuffling
        if shuffling == 'Random':
            random.shuffle(products)
        elif shuffling == 'Ascending Alphabetically':
            products = sorted(products, key=lambda x: x['name'])
        elif shuffling == 'Programmer\'s Choice':
            # Your code to sort products here
            pass
        elif shuffling == 'Using ID Number':
            products = sorted(products, key=lambda x: int(x['ID'].replace('-', ''), 16))

        # Rank products based on selected units
        if units == 'Unique Ranking':
            for i, product in enumerate(products):
                product['rank'] = i + 1
        elif units == 'Tied Ranking':
            # Your code to assign tied ranks here
            pass

        settings = {
            "scale_name": scale_name,
            "scale_category": "ranking scale",
            "products": products,
            "orientation": orientation,
            "scale_color": scale_color,
            "shuffling": shuffling,
            "units": units,
            "time": time,
            "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        event_id = get_event_id()
        field_add = {
            "event_id": event_id,
            "settings": settings,
            "user": user
        }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
                field_add, "nil")

        scale_id = str((json.loads(x)['inserted_id']))

        user_details = {
            "scale_id": scale_id,
            "event_id": event_id,
            "username": user
        }
        dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE",
            "insert", user_details, "nil")

        return Response({"success": "Settings created successfully.", "data": settings, "scale_id": scale_id})

    elif request.method == 'GET':
        data = request.data
        if "scale_id" in data:
            scale_id = data['scale_id']
            field_add = {"_id": scale_id}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                "fetch", field_add, "nil")
            settings = json.loads(x)['data'][0]['settings']
            return Response({"data": settings})
        else:
            field_add = {"settings.scale-category": "ranking scale"}
            x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
                field_add, "nil")
            settings_list = []
            for item in json.loads(x)['data']:
                settings_list.append(item['settings'])
            return Response({"data": settings_list})

    elif request.method == "PUT":
        data = request.data
        if "scale_id" not in data:
            return Response({"error": "scale_id missing or misspelled"}, status=status.HTTP_400_BAD_REQUEST)

        scale_id = data['scale_id']
        field_add = {"_id": scale_id}
        x = dowellconnection("dowellscale","bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch", field_add, "nil")
        settings = json.loads(x)['data'][0]['settings']

        for key in settings.keys():
            if key in data:
                settings[key] = data[key]

        # Sort products based on selected shuffling
        if 'shuffling' in data:
            shuffling = data['shuffling']
            if shuffling == 'Random':
                random.shuffle(settings['products'])
            elif shuffling == 'Ascending Alphabetically':
                settings['products'] = sorted(settings['products'], key=lambda x: x['name'])
            elif shuffling == 'Programmer\'s Choice':
                # Your code to sort products here
                pass
            elif shuffling == 'Using ID Number':
                settings['products'] = sorted(settings['products'], key=lambda x: int(x['id'].replace('-', ''), 16))

        # Rank products based on selected units
        if 'units' in data:
            units = data['units']
            if units == 'Unique Ranking':
                for i, product in enumerate(settings['products']):
                    product['rank'] = i + 1
            elif units == 'Tied Ranking':
                # Your code to assign tied ranks here
                pass

        settings["scale-category"] = "ranking scale"
        settings["date_updated"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        update_field = {"settings": settings}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update",
            field_add, update_field)
        return Response({"success": "Settings updated successfully.", "data": settings, "scale_id": scale_id})

    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def response_submit_api_view(request):
    try:
        scale_id = request.data['scale_id']
        response = request.data['response']
        username = request.data['username']

        # Check if scale exists
        field_add = {"_id": scale_id}
        default = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
            "fetch", field_add, "nil")
        data = json.loads(default)
        if data['data'] is None:
            return Response({"Error": "Scale does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if response is valid
        products = data['data'][0]['settings']['products']
        product_names = [product['name'] for product in products]
        for product in response:
            print(product,' >>>>>>>>>>>')
            if product['name'] not in product_names:
                return Response({"error": f"Invalid product name: {name}"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if ranking is unique
        units = data['data'][0]['settings']['units']
        if units == "Unique Ranking":
            ranks = [product['rank'] for product in response]
            if len(set(ranks)) != len(ranks):
                return Response({"error": "Ranking is not unique."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"products": products})

        # Update ranking in database
        field_add = {"_id": scale_id}
        update = {"$set": {"settings.products": response}}
        dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update", field_add, update)

        # Insert ranking response in scale_reports collection
        event_id = get_event_id()
        scale_data = {"scale_id": scale_id, "scale_type": "ranking scale"}
        field_add = {"event_id": event_id, "scale_data": scale_data}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094", "ABCDE", "insert", field_add, "nil")

        # Insert user details in users collection
        details = {"scale_id": scale_id, "event_id": event_id, "username": username}
        dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE", "insert", details, "nil")

        return Response({"success": "Ranking submitted successfully."})
    except:
        return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)






def dowell_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/ranking/ranking-admin/settings/")
    context={}
    context["public_url"] = public_url

    if request.method == 'POST':
        name = request.POST['nameofscale']
        orientation = request.POST['orientation']
        scalecolor = request.POST['scolor']
        time = request.POST['time']
        number_of_scales=request.POST['numberofscale']
        number_of_product=request.POST['number_of_product']
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        eventID = get_event_id()
        product_name=[request.POST.get(' 0', "None"),
            request.POST.get(' 1', "None"),
            request.POST.get(' 2', "None"),
            request.POST.get(' 3', "None"),
            request.POST.get(' 4', "None"),
            request.POST.get(' 5', "None"),
            request.POST.get(' 6', "None"),
            request.POST.get(' 7', "None"),
            request.POST.get(' 8', "None"),
            request.POST.get(' 9', "None"),
            request.POST.get(' 10', "None")] 
        product_names = []
        [product_names.append(x) for x in product_name if x not in product_names]
        product_names.remove("None")
        
        
        try:
            field_add={"event_id":eventID,"settings":{"orientation":orientation,"scalecolor":scalecolor,"time":time,"template_name":template_name,"number_of_scales":number_of_scales, "name":name, "scale-category": "ranking scale","NumberofProduct":number_of_product,"productnames":product_names} }
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")

            # User details
            user_json = json.loads(x)
            details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
            user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")
            return redirect(f"{public_url}/ranking/ranking-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'ranking/scale_admin.html', context)

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
        response = redirect('ranking:preview_page')
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
    print(data)
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
                field_add={"event_id":eventID,"scale_data":{"scale_id":context["scale_id"],"scale_type":"ranking scale"}, "brand_data":{"brand_name":context["brand_name"],"product_name":context["product_name"]},"score":[score]}
                x=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","insert",field_add,"nil")

                # User details
                user_json = json.loads(x)
                details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
                user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")
                context["score"] = "show"

                return redirect(f"{url}")
            except:
                context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request,'ranking/single_scale.html',context)

def brand_product_preview(request):
    context = {}
    context["public_url"] = public_url
    url = request.COOKIES['url']
    template_name = url.split("/")[-1]
    field_add={"settings.template_name":template_name}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    x= data["data"][0]['settings']
    context["defaults"]=x
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
    return render(request, 'ranking/preview_page.html', context)

def default_scale(request):
    context = {}
    context["public_url"] = public_url
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    return render(request, 'ranking/default.html', context)

def default_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}onanywhere.com/ranking/ranking-admin/default/")
    # print("++++++++++ USER DETAILS", user)
    username= request.session["user_name"]
    context = {}
    context["public_url"] = public_url
    context['user'] = 'admin'
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);height:500px;overflow-y: scroll;"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    context["username"]=username
    field_add = {"settings.scale-category": "ranking scale"}
    all_scales = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data = json.loads(all_scales)
    #print(data)
    context["rankingall"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)
    print(context["rankingall"])

    return render(request, 'ranking/default.html', context)


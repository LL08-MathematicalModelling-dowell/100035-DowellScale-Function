import random
import json
import requests
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, HttpResponse
from nps.dowellconnection import dowellconnection
from nps.login import get_user_profile
import urllib
from django.views.decorators.clickjacking import xframe_options_exempt
from .eventID import get_event_id
from django.views.decorators.csrf import csrf_exempt
from dowellnps_scale_function.settings import public_url


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
    context['template_url'] = f"{public_url}{name}?brand_name=your_brand&product_name=your_product"
    print("This are the existing scales", context['existing_scales'] )
    return render(request, 'lite/embed_page.html', context)

def dowell_npslite_scale_settings(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/nps-lite-admin/settings/")
    # print("+++++++++=>",user)
    context={}
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
        try:
            eventID=get_event_id()
            field_add={"eventId":eventID,"settings":{"question":question,"orientation":orientation,"scalecolor":scalecolor,"fontcolor":fontcolor,"time":time,"template_name":template_name,"name":name,"center":center, "left":left,"right":right, "scale-category": "npslite scale", "no_of_scales":no_of_scales}}
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
            print("This is what is saved", x)
            # User details
            user_json = json.loads(x)
            details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
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
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/nps-lite-default-admin/")

    context={}
    context["public_url"] = public_url
    brand_name = request.GET.get('brand_name', None)
    product_name = request.GET.get('product_name', None)
    ls = request.path
    url = request.build_absolute_uri()
    try:
        x,s = url.split('?')
        names_values_dict = dict(x.split('=') for x in s.split('&'))
        xy = x[1].replace('&', ',')
        y = xy.replace('=', ':')
        z = '{'+y+'}'
        # return HttpResponse(names_values_dict['brand_name'])
        pls = ls.split("/")
        tname1 = pls[1]
        # resp = response.objects.all()
        # return HttpResponse(resp)
        context["brand_name"] = names_values_dict['brand_name']
        context["product_name"] = names_values_dict['product_name'].split('/')[0]
        context["scale_name"] = tname
    except:
        f_path = request.get_full_path()
        response = redirect('nps_lite:display_embed_page')
        # response.delete_cookie('url')
        response.set_cookie('url', f_path)
        return response

    context["url"]="../scaleadmin"
    context["urltext"]="Create new scale"
    context["btn"]="btn btn-dark"
    context["hist"]="Scale History"
    context["bglight"]="bg-light"
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)"
    # context["npsall"]=system_settings.objects.all().order_by('-id')
    # scale settings call
    field_add = {"settings.template_name": tname, }
    default = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
        field_add, "nil")
    data = json.loads(default)

    context["scale_id"] = data['data'][0]['_id']
    x = data['data'][0]['settings']
    context["defaults"] = x
    print("+++++++++++++", x['time'])
    number_of_scale = x['no_of_scales']
    context["no_of_scales"] = number_of_scale
    current_url = url.split('/')[-1]
    context['cur_url'] = current_url

    # find existing scale reports
    field_add = {"scale_data.scale_id": context["scale_id"]}
    response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
        "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response)
    print("This is my scale_data", data)

    existing_scale = False
    if len(data['data']) != 0:
        score_data = data["data"]

        for i in score_data:
            instance_id = i['category'][0]['instance_id'].split("/")[0]
            print("instance_id[[[[[[[[[", instance_id)
            print("current[[[[[[[[[", current_url)
            if instance_id == current_url:
                existing_scale = True
                context['response_saved'] = i['category'][0]['category']
                context['score'] = "show"
                print("Scale exists--------->", existing_scale)

        print("Scale exists--------->", existing_scale)

    if request.method == 'POST':
        category = request.POST['scoretag']
        eventID = get_event_id()
        category = {"instance_id": f"{current_url}/{context['no_of_scales']}", 'category': category}
        print("Scale exists--------->", existing_scale)
        print("Nps Lite Category Choice--->",category)

        if existing_scale == False:
            try:
                field_add={"event_id":eventID,"scale_data":{"scale_id":context["scale_id"],"scale_type":"nps scale"}, "brand_data":{"brand_name":context["brand_name"],"product_name":context["product_name"]},"category":[category]}
                x = dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","insert",field_add,"nil")
                print("Nps Lite Scale Response---->",x)
                # User details
                user_json = json.loads(z)
                details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
                user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                    "ABCDE", "insert", details, "nil")
                context['score'] = "show"
                print("++++++++++", user_details)
                # return redirect(f"https://100014.pythonanywhere.com/main")
            except:
                context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request,'lite/single_scale.html',context)



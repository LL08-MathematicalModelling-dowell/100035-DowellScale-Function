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



def npslite_home_admin(request):
    context = {}
    context['user'] = 'admin'
    try:
        field_add = {"scale-category": "npslite scale"}
        all_scales = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
        data = json.loads(all_scales)
        context["npslite_all"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)
    except:
        print("No scales found")
    return render(request, 'lite/nps-lite.html', context)

def npslite_home(request):
    context = {}
    context['user'] = 'user'
    return render(request, 'lite/nps-lite.html', context)


def brand_product_error(request):
    return render(request, 'lite/embed_page.html')

def dowell_npslite_scale_settings(request):
    context={}
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
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        eventID=get_event_id()
        try:
            user = request.COOKIES['user']
            field_add={"question":question,"orientation":orientation,"scalecolor":scalecolor,"fontcolor":fontcolor,"time":time,"template_name":template_name,"name":name,"center":center, "left":left,"right":right,"eventId":eventID, "scale-category": "npslite scale", "user": user}
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
            print(field_add)
            return redirect(f"https://100035.pythonanywhere.com/nps-lite/nps-lite-scale/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'lite/settings_page.html', context)

@xframe_options_exempt
@csrf_exempt
def dowell_npslite_scale(request, tname):
    context={}
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
        context["product_name"] = names_values_dict['product_name']
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
    field_add={"template_name":tname}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    x= data["data"]
    context["defaults"]=x
    # print(default)

    if request.method == 'POST':
        category = request.POST['scoretag']
        print("Nps Lite Category Choice--->",category)
        try:
            field_add={"category":category,"scale_name":context["scale_name"],"brand_name":context["brand_name"],"product_name":context["product_name"]}
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","insert",field_add,"nil")
            print("Nps Lite Scale Response---->",x)
            context["score"] = "show"
            # return redirect(f"https://100014.pythonanywhere.com/main")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request,'lite/single_scale.html',context)

def rolescreen(request):
    return render(request, 'lite/landing_page.html')

def login(request):
    url = request.GET.get('session_id', None)
    if url == None:
        return redirect("https://100014.pythonanywhere.com/")
    user=get_user_profile(url)
    try:
        if user["username"]:
            if user["role"]=='Client_Admin' or user["role"]=='TeamMember':
                response = redirect("nps_lite:admin_default_page")
                response.set_cookie('user', user['username'])
                return response
            else:
                response = redirect("nps_lite:default_page")
                response.set_cookie('user', user["username"])
                return response
    except:
        return redirect("https://100014.pythonanywhere.com/")


from django.http import JsonResponse
from django.shortcuts import render
import random
import json
import requests
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, HttpResponse
from nps.dowellconnection import dowellconnection
from nps.login import get_user_profile
import urllib
from django.views.decorators.clickjacking import xframe_options_exempt
from stapel.eventID import get_event_id
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
def reroute(request):
    
    return render(request, 'route/home.html')

@csrf_exempt
def dowell_stapel_scale_admin_api(request):
    context={}
    if request.method == 'POST':
        request_data=json.loads(request.body)
        name = request_data['nameofscale']
        orientation = request_data['orientation']
        scale_upper_limit = int(request_data['scale_upper_limit'])
        scalecolor = request_data['scolor']
        roundcolor = request_data['rcolor']
        fontcolor =request_data['fcolor']
        fomat = "numbers"
        left = request_data["left"]
        right = request_data["right"]
        time = request_data['time']
        spacing_unit = int(request_data['spacing_unit'])
        text = f"{left}+{right}"
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        scale = []
        context['scale'] = scale
        for i in range(-(scale_upper_limit), scale_upper_limit + 1):
            if i % spacing_unit == 0 and i != 0:
                scale.append(i)
        if scale_upper_limit > 10 or scale_upper_limit < 0 or spacing_unit > 5 or spacing_unit < 1:
            raise Exception("Check scale limits and spacing_unit")

        try:
            user  = "couzy"
            eventID = "etc"#get_event_id()
            field_add={"orientation":orientation,"scale_upper_limit":scale_upper_limit,"scale_lower_limit":-scale_upper_limit,"scalecolor":scalecolor,"roundcolor":roundcolor,"fontcolor":fontcolor,"fomat":fomat,"time":time,"template_name":template_name,"name":name,"text":text, "left":left,"right":right,"scale":scale, "scale-category": "stapel scale", "user": user, "eventId":eventID}
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
            context["data"]=x
            context["name"]=template_name
            context["link"]=(f"https://100035.pythonanywhere.com/stapel/stapel-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return JsonResponse(context)

@csrf_exempt
def dowell_nps_scale_admin_api(request):
    context={}
    if request.method == 'POST':
        request_data=json.loads(request.body)
        name = request_data['nameofscale']
        orientation = request_data['orientation']
        numberrating="10"
        scalecolor = request_data['scolor']
        roundcolor = request_data['rcolor']
        fontcolor =request_data['fcolor']
        fomat = "numbers"
        left = request_data["left"]
        right = request_data["right"]
        center = request_data["center"]
        time = request_data['time']
        spacing_unit = int(request_data['spacing_unit'])
        text = f"{left}+{right}"
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        scale = [1,2,3,4,5,6,7,8,9,10]
        context['scale'] = scale

        try:
            user  = "couzy"
            eventID = "etc"#get_event_id()
            field_add={"orientation":orientation,"numberrating":numberrating,"scalecolor":scalecolor,"roundcolor":roundcolor,"fontcolor":fontcolor,"fomat":fomat,"time":time,"template_name":template_name,"name":name,"text":text, "left":left,"right":right,"center":center, "scale-category": "nps scale", "user": user}
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
            context["data"]=x
            context["name"]=template_name
            context["link"]=(f"https://100035.pythonanywhere.com/nps-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return JsonResponse(context)

@csrf_exempt
def dowell_likert_scale_admin_api(request):
    context={}
    if request.method == 'POST':
        request_data=json.loads(request.body)
        name = request_data['nameofscale']
        orientation = request_data['orientation']
        labelscale = request_data['labelscale']
        labeltype=request_data['labeltype']
        roundcolor = request_data['rcolor']
        fontcolor =request_data['fcolor']
        scales=request_data["scale"]
    
        time = request_data['time']
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        context['scale'] = scales

        try:
            user  = "couzy"
            eventID = "etc"#get_event_id()
            field_add={"orientation":orientation,"roundcolor":roundcolor,"fontcolor":fontcolor,"labelscale":labelscale,"time":time,"template_name":template_name,"name":name,"scales":scales,"labeltype":labeltype,"eventId":eventID,"scale-category": "likert scale"}
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
            context["data"]=x
            context["name"]=template_name
            context["link"]=(f"http://127.0.0.1:8000/likert/likert-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return JsonResponse(context)

@xframe_options_exempt
def dowell_scale1(request, tname1):
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
        tname = pls[1]
        # resp = response.objects.all()
        # return HttpResponse(resp)
        context["brand_name"] = names_values_dict['brand_name']
        context["product_name"] = names_values_dict['product_name']
        context["scale_name"] = tname1
    except:
        f_path = request.get_full_path()
        response = redirect('stapel:error_page')
        response.set_cookie('url', f_path)
        return response

    context["url"]="../scaleadmin"
    context["urltext"]="Create new scale"
    context["btn"]="btn btn-dark"
    context["hist"]="Scale History"
    context["bglight"]="bg-light"
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)"
    # context["npsall"]=system_settings.objects.all().order_by('-id')
    field_add={"template_name":tname1}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    x= data["data"]
    context["defaults"]=x
    for i in x:
        context["text"]=i['text'].split("+")
        context["scale"]=i['scale']

    if request.method == 'POST':
        score = request.POST['scoretag']
        try:
            field_add={"score":score,"scale_name":context["scale_name"],"brand_name":context["brand_name"],"product_name":context["product_name"]}
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","insert",field_add,"nil")
            # print(x)
            return redirect(f"https://100014.pythonanywhere.com/main")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request,'stapel/single_scale.html',context)
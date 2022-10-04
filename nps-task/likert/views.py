import random
import json
import requests
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, HttpResponse
#from .models import system_settings, response
from nps.dowellconnection import dowellconnection
from nps.login import get_user_profile
import urllib
from django.views.decorators.clickjacking import xframe_options_exempt

def dowell_scale_admin(request):
    context={}
    scales = {}
    if request.method == 'POST':
        name = request.POST['nameofscale']
        orientation = request.POST['orientation']
        scalecolor = request.POST['scolor']
        roundcolor = request.POST['rcolor']
        fontcolor = request.POST['fcolor']
        labelscale = request.POST['likert']
        labeltype = request.POST['labeltype']
        time = request.POST['time']
        scales=[request.POST.get('scale_choice 0', "None"),
        request.POST.get('scale_choice 1', "None"),
        request.POST.get('scale_choice 2', "None"),
        request.POST.get('scale_choice 3', "None"),
        request.POST.get('scale_choice 4', "None"),
        request.POST.get('scale_choice 5', "None")
        ]
        print(labelscale)
        print(labeltype)
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"


        try:
            field_add={"orientation":orientation,"scalecolor":scalecolor,"roundcolor":roundcolor,"fontcolor":fontcolor,"labelscale":labelscale,"time":time,"template_name":template_name,"name":name,"scales":scales,"labeltype":labeltype,"scale-category": "likert scale"}
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
            return redirect(f"https://100035.pythonanywhere.com/likert/likert-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'likert/scale_admin.html', context)

def dowell_likert(request):
    if request.method =="POST":
        scale_selected = request.POST['likert']
        context={"context":scale_selected}
        return render(request, 'likert/default.html', context=context)
    return render(request, 'likert/likert.html')

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
        response = redirect('likert:preview_page')
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
    print(data)
    x= data["data"]
    context["defaults"]=x
    for i in x:
        #context["text"]=i['text'].split("+")
        context['labelscale']=i["labelscale"]
        context['labeltype']=i["labeltype"]
        for j in i["scales"]:
            if j == "None":
                i["scales"].remove(j)

        context['scale']=i['scales']



    if request.method == 'POST':
        score = request.POST['scoretag']
        print(score)
        try:
            field_add={"score":score,"scale_name":context["scale_name"],"brand_name":context["brand_name"],"product_name":context["product_name"]}
            dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","insert",field_add,"nil")
            return redirect(f"http://100014.pythonanywhere.com/main")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request,'likert/single_scale.html',context)

def brand_product_preview(request):
    return render(request, 'likert/preview_page.html')

def default_scale(request):
    context = {}
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    # context["likertall"] = system_settings.objects.all().order_by('-id')
    return render(request, 'likert/default.html', context)

def default_scale_admin(request):
    context = {}
    context['user'] = 'admin'
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);height:300px;overflow-y: scroll;"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    field_add = {"scale-category": "likert scale"}
    all_scales = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data = json.loads(all_scales)
    context["likertall"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)

    return render(request, 'likert/default.html', context)


def rolescreen(request):
    return render(request, 'likert/landing_page.html')

def login(request):
    url = request.GET.get('session_id', None)
    if url == None:
        return redirect("https://100014.pythonanywhere.com/")
    user=get_user_profile(url)
    if user["username"]:
        if user["role"]=='Client_Admin' or user["role"]=='TeamMember':
            response = redirect("likert:default_page_admin")
            response.set_cookie('role', user['username'])
            return response
        else:
            response = redirect("likert:default_page")
            response.set_cookie('role', user['username'])
            return response
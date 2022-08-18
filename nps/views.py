import random
import json
import requests
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, HttpResponse
from rest_framework import viewsets
from .serializer import SystemSettingsSerializer, ResponseSerializer
from .models import system_settings, response
from rest_framework.permissions import IsAuthenticated,IsAdminUser, AllowAny
from rest_framework.authentication import TokenAuthentication
from .dowellconnection import dowellconnection
from .login import get_user_profile
import urllib
from django.views.decorators.clickjacking import xframe_options_exempt

class SystemSettings(viewsets.ModelViewSet):
    serializer_class = SystemSettingsSerializer
    queryset = system_settings.objects.all()
    permission_classes = (AllowAny,)
    # authentication_classes = (TokenAuthentication,)

class Response(viewsets.ModelViewSet):
    serializer_class = ResponseSerializer
    queryset = response.objects.all()

def dowell_scale_admin(request):
    context={}
    if request.method == 'POST':
        name = request.POST['nameofscale']
        orientation = request.POST['orientation']
        numberrating = 10
        scalecolor = request.POST['scolor']
        roundcolor = request.POST['rcolor']
        fontcolor = request.POST['fcolor']
        fomat = request.POST['format']
        left = request.POST["left"]
        right = request.POST["right"]
        center = request.POST["center"]
        time = request.POST['time']
        text = f"{left}+{center}+{right}"
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        # objcolor = system_settings.objects.create(orientation=orientation,numberrating=numberrating,scalecolor=scalecolor,roundcolor=roundcolor,fontcolor=fontcolor,fomat=fomat,time=time,template_name=template_name,name=name,text=text, left=left,right=right,center=center)
        # objcolor.save()
        try:
            field_add={"orientation":orientation,"numberrating":numberrating,"scalecolor":scalecolor,"roundcolor":roundcolor,"fontcolor":fontcolor,"fomat":fomat,"time":time,"template_name":template_name,"name":name,"text":text, "left":left,"right":right,"center":center}
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
            print(x)
            return redirect(f"https://100035.pythonanywhere.com/nps-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'nps/scale_admin.html', context)


def dowell_scale(request,tname):
    context={}
    context={}
    url = request.COOKIES['text']
    if url == None:
        user = ''
    else:
        user = get_user_profile(url)
        if user["role"] == 'Client_admin' or user["role"] == 'TeamMember':
            user = 'Client_Admin'
    context['user'] = user
    context["url"]="../scaleadmin"
    context["urltext"]="Create new scale"
    context["btn"]="btn btn-dark"
    context["hist"]="Scale History"
    context["bglight"]="bg-light"
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)"
    context["npsall"]=system_settings.objects.all().order_by('-id')
    default=system_settings.objects.filter(template_name=tname)
    context["defaults"]=default
    for i in default:
        context["text"]=i.text.split('+')
    return render(request,'nps/scale.html',context)

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
        response = redirect('nps:error_page')
        response.set_cookie('url', f_path)
        return response

    context["url"]="../scaleadmin"
    context["urltext"]="Create new scale"
    context["btn"]="btn btn-dark"
    context["hist"]="Scale History"
    context["bglight"]="bg-light"
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)"
    context["npsall"]=system_settings.objects.all().order_by('-id')
    # field_add={"template_name":"AmbroseTest2966",}
    field_add={"template_name":tname1,}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    x= data["data"]
    context["defaults"]=x
    for i in x:
        context["text"]=i['text'].split("+")

    if request.method == 'POST':
        score = request.POST['scoretag']
        try:
            field_add={"score":score,"scale_name":context["scale_name"],"brand_name":context["brand_name"],"product_name":context["product_name"]}
            x=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","insert",field_add,"nil")
            return redirect(f"http://100014.pythonanywhere.com/main")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request,'nps/single_scale.html',context)

def brand_product_error(request):
    return render(request, 'nps/error_page.html')

def default_scale(request):
    context = {}
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    context["npsall"] = system_settings.objects.all().order_by('-id')
    return render(request, 'nps/default.html', context)

def default_scale_admin(request):
    context = {}
    context['user'] = 'admin'
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    field_add = {}
    all_scales = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data = json.loads(all_scales)
    context["npsall"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)
    # context["npsall"] = system_settings.objects.all().order_by('-id')
    return render(request, 'nps/default.html', context)


def rolescreen(request):
    return render(request, 'nps/landing_page.html')

def login(request):
    url = request.GET.get('session_id', None)
    if url == None:
        return redirect("https://100014.pythonanywhere.com/")
    user=get_user_profile(url)
    if user["username"]:
        if user["role"]=='Client_Admin' or user["role"]=='TeamMember':
            response = redirect("nps:default_page_admin")
            # response.set_cookie('role', user['role'])
            return response
        else:
            response = redirect("nps:default_page")
            # response.set_cookie('role', user['role'])
            return response



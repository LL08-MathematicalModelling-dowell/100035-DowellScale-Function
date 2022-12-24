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
from .eventID import get_event_id
from dowellnps_scale_function.settings import public_url

def dowell_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/likert/likert-admin/settings/")
    # # print("+++++++++++++", request.session.get('user_name'))
    context={}
    context["public_url"] = public_url
    scales = {}
    if request.session.get("userinfo"):
        username= request.session["user_name"]
        if request.method == 'POST':
            name = request.POST['nameofscale']
            number_of_scales=request.POST['numberofscale']
            orientation = request.POST['orientation']
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
            request.POST.get('scale_choice 5', "None"),
            request.POST.get('scale_choice 6', "None"),
            request.POST.get('scale_choice 7', "None"),
            request.POST.get('scale_choice 8', "None")
            ]
            eventID = get_event_id()
            rand_num = random.randrange(1, 10000)
            template_name = f"{name.replace(' ', '')}{rand_num}"
            try:
                field_add={"orientation":orientation,"roundcolor":roundcolor,"fontcolor":fontcolor,"labelscale":labelscale,"number_of_scales":number_of_scales,"time":time,"template_name":template_name,"name":name,"scales":scales,"labeltype":labeltype,"event_id":eventID,"scale-category": "likert scale"}
                x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")


                # User details
                user_json = json.loads(x)
                details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
                user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")
                return redirect(f"{public_url}/likert/likert-scale1/{template_name}")
            except:
                context["Error"] = "Error Occurred while save the custom pl contact admin"
        return render(request, 'likert/scale_admin.html', context)

def dowell_likert(request):
    if request.method =="POST":
        scale_selected = request.POST['likert']
        scoretag=request.POST.get('scoretag', 'None')
        #print(scoretag)
        context={"context":scale_selected}
        context["public_url"] = public_url
        return render(request, 'likert/default.html', context=context)
    return render(request, 'likert/likert.html')

@xframe_options_exempt
def dowell_scale1(request, tname1):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={{public_url}}/likert/likert-admin/default/")
    # # print("+++++++++++++", request.session.get('user_name'))
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
        pls = ls.split("/")
        tname = pls[1]
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
    field_add={"template_name":tname1}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    x= data["data"]
    context["defaults"]=x
    for i in x:
        context['labelscale']=i["labelscale"]
        context['labeltype']=i["labeltype"]
        number_of_scale=i['number_of_scales']
        for j in i["scales"]:
            if j == "None":
                i["scales"].remove(j)

        context['scale']=i['scales']
    context["no_of_scales"]=number_of_scale
    num = url.split('/')
    url_id = num[-1]
    field_add={"scale_name":context["scale_name"]}
    response=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","fetch",field_add,"nil")
    data=json.loads(response)
    datas=data["data"]
    context["recorded_score"]=101
    if len(datas) > 0:
        for i in datas:
            if url_id == i["score"]["id"]:
                recorded_score=(i["score"]["score"])

                context["recorded_score"]=recorded_score




    if request.method == 'POST':
        score=""
        url = request.build_absolute_uri()
        current_url = url.split('/')[-1]
        score = request.POST['scoretag']
        eventID = get_event_id()
        score = {'id': current_url, 'score':score}
        try:
            field_add={"scale_name":context["scale_name"], "scale_type":"likert"}
            response=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","fetch",field_add,"nil")
            data=json.loads(response)
            x = data["data"]
            for i in x:
                b = i['score']['id']
                if b == current_url:
                    context["score"]="show"
            field_add={"score":score,"scale_name":context["scale_name"],"brand_name":context["brand_name"],"product_name":context["product_name"],"event_id":eventID}
            x=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","insert",field_add,"nil")

            # User details
            user_json = json.loads(x)
            details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
            user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")
            context["score"] = "show"
            return redirect(f"{url}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request,'likert/single_scale.html',context)

def brand_product_preview(request):
    context = {}
    context["public_url"] = public_url
    url = request.COOKIES['url']
    template_name = url.split("/")[-1]
    field_add={"template_name":template_name}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    x= data["data"]
    context["defaults"]=x
    for i in x:
        number_of_scale=i['number_of_scales']
    context["no_scales"]=int(number_of_scale)
    context["no_of_scales"]=[]
    for i in range(int(number_of_scale)):
        context["no_of_scales"].append(i)

    name=url.replace("'","")
    context['template_url']= f"{public_url}{name}?brand_name=your_brand&product_name=your_product"
    print(context['template_url'])
    #context['template_url']= f"http://127.0.0.1:8000/{name}?brand_name=your_brand&product_name=your_product"
    return render(request, 'likert/preview_page.html', context)

def default_scale(request):
    context = {}
    context["public_url"] = public_url
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    # context["likertall"] = system_settings.objects.all().order_by('-id')
    return render(request, 'likert/default.html', context)

def default_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/likert/likert-admin/default/")
    # # print("++++++++++ USER DETAILS", user)
    if request.session.get("userinfo"):
        username= request.session["user_name"]
        context = {}
        context["public_url"] = public_url
        context['user'] = 'admin'
        context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);height:300px;overflow-y: scroll;"
        context["hist"] = "Scale History"
        context["btn"] = "btn btn-dark"
        context["urltext"] = "Create new scale"
        context["username"]=username
        field_add = {"scale-category": "likert scale"}
        all_scales = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
        data = json.loads(all_scales)
        context["likertall"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)

        return render(request, 'likert/default.html', context)
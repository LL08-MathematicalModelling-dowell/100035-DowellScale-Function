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
from nps.eventID import get_event_id

def dowell_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect("https://100014.pythonanywhere.com/?redirect_url=https://100035.pythonanywhere.com/percent/percent-admin/settings/")
    # print("+++++++++++++", request.session.get('user_name'))
    context={}

    if request.method == 'POST':
        name = request.POST['nameofscale']
        orientation = request.POST['orientation']
        scalecolor = request.POST['scolor']
        time = request.POST['time']
        number_of_scales=request.POST['numberofscale']
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        eventID = get_event_id()
       # user = "test"
        scale_type="percent"
        try:
            field_add={"scale_type":scale_type,"orientation":orientation,"scalecolor":scalecolor,"time":time,"template_name":template_name,"number_of_scales":number_of_scales, "name":name, "scale-category": "percent scale","eventID":eventID, "created_by": user }
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
            #return redirect(f"http://127.0.0.1:8000/percent/percent-scale1/{template_name}")
            return redirect(f"https://100035.pythonanywhere.com/percent/percent-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'percent/scale_admin.html', context)

@xframe_options_exempt
def dowell_scale1(request, tname1):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url=https://100035.pythonanywhere.com/percent/percent-admin/default/")
    # print("+++++++++++++", request.session.get('user_name'))
    context={}

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
        response = redirect('percent:preview_page')
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
   #print(data)
    x= data["data"]
    context["defaults"]=x
    for i in x:
        number_of_scale=i['number_of_scales']

    context["no_of_scales"]=number_of_scale
    num = url.split('/')
    url_id = num[-1]
    field_add={"scale_name":context["scale_name"]}
    response=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","fetch",field_add,"nil")
    data=json.loads(response)
    datas=data["data"]
    #print(datas)
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
        #print("Testing... 1", score)
        try:
            field_add={"scale_name":context["scale_name"], "scale_type":"percent"}
            response=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","fetch",field_add,"nil")
            data=json.loads(response)
            x = data["data"]
            for i in x:
                b = i['score']['id']
                if b == current_url:
                    #print("Already exists")
                    context["score"]="show"
                    #return redirect(f"https://100014.pythonanywhere.com/main")
            field_add={"score":score,"scale_name":context["scale_name"],"brand_name":context["brand_name"],"product_name":context["product_name"],"eventID":eventID, "response_by": user}
            x=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","insert",field_add,"nil")

            context["score"] = "show"

            return redirect(f"{url}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request,'percent/single_scale.html',context)

def brand_product_preview(request):
    context = {}
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
    context['template_url']= f"https://100035.pythonanywhere.com{name}?brand_name=your_brand&product_name=your_product"
    #context['template_url']= f"http://127.0.0.1:8000/{name}?brand_name=your_brand&product_name=your_product"
    return render(request, 'percent/preview_page.html', context)

def default_scale(request):
    context = {}
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    return render(request, 'percent/default.html', context)

def default_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect("https://100014.pythonanywhere.com/?redirect_url=https://100035.pythonanywhere.com/percent/percent-admin/default/")
    # print("++++++++++ USER DETAILS", user)
    context = {}
    context['user'] = 'admin'
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);height:300px;overflow-y: scroll;"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    field_add = {"scale-category": "percent scale"}
    all_scales = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data = json.loads(all_scales)
    context["percentall"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)

    return render(request, 'percent/default.html', context)




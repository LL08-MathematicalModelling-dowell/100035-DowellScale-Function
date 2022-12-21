import random
import json
import requests
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, HttpResponse
from nps.dowellconnection import dowellconnection
from nps.login import get_user_profile
import urllib
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from .eventID import get_event_id


def dowell_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect("https://100014.pythonanywhere.com/?redirect_url=https://100035.pythonanywhere.com/stapel/stapel-admin/settings/")
    # # print("+++++++++++++", request.session.get('user_name'))
    context={}
    if request.method == 'POST':
        name = request.POST['nameofscale']
        orientation = request.POST['orientation']
        scale_upper_limit = int(request.POST['scale_upper_limit'])
        scalecolor = request.POST['scolor']
        roundcolor = request.POST['rcolor']
        fontcolor = request.POST['fcolor']
        fomat = "numbers"
        left = request.POST["left"]
        right = request.POST["right"]
        no_of_scales = request.POST["no_of_scales"]
        time = request.POST['time']
        spacing_unit = int(request.POST['spacing_unit'])
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
            eventID = get_event_id()
            field_add={"orientation":orientation,"scale_upper_limit":scale_upper_limit,"scale_lower_limit":-scale_upper_limit,"scalecolor":scalecolor,"roundcolor":roundcolor,"fontcolor":fontcolor,"fomat":fomat,"time":time,"template_name":template_name,"name":name,"text":text, "left":left,"right":right,"scale":scale, "scale-category": "stapel scale", "event_id":eventID, "no_of_scales":no_of_scales}
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
            print(x)

            # User details
            user_json = json.loads(x)
            details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
            user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")

            return redirect(f"https://100035.pythonanywhere.com/stapel/stapel-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'stapel/scale_admin.html', context)

@xframe_options_exempt
@csrf_exempt
def dowell_scale1(request, tname1):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url=https://100035.pythonanywhere.com/stapel/stapel-admin/default/")
    # # print("+++++++++++++", request.session.get('user_name'))
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
        context["product_name"] = names_values_dict['product_name'].split('/')[0]
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
        number_of_scale=i['no_of_scales']

    context["no_of_scales"]=number_of_scale
    url = request.build_absolute_uri()
    current_url = url.split('/')[-1]
    context['cur_url'] = current_url

    field_add={"scale_name":context["scale_name"]}
    response=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","fetch",field_add,"nil")
    data=json.loads(response)
    y = data["data"]
    total_score = 0
    for i in y:
        if len(i['score']['id']) > 3:
            continue
        b = i['score']['score']
        total_score += int(b)

    for i in y:
        b = i['score']['id']
        if b == current_url:
            context['response_saved'] = i['score']['score']
            context['score'] = "show"
            print("Already Exists")

    print("This are the scores of this scale",y)

    print("Total scores of this scale",total_score)

    if request.method == 'POST':
        score = request.POST['scoretag']
        eventID = get_event_id()
        score = {'id': current_url, 'score':score}
        print("This is the score selected---->", score)
        try:
            field_add={"score":score,"scale_name":context["scale_name"],"brand_name":context["brand_name"],"product_name":context["product_name"],"event_id":eventID}
            z = dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","insert",field_add,"nil")
            print('Scale NEW added successfully', z)

            # User details
            user_json = json.loads(z)
            details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
            user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")
            context['score'] = "show"
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request,'stapel/single_scale.html',context)

def brand_product_error(request):
    context = {}
    url = request.COOKIES['url']
    template_name = url.split("/")[3]
    field_add={"template_name":template_name}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    x= data["data"]
    context["defaults"]=x
    for i in x:
        number_of_scale=i['no_of_scales']

    context["no_scales"]=int(number_of_scale)
    context["no_of_scales"]=[]
    for i in range(int(number_of_scale)):
        context["no_of_scales"].append(i)

    print('This is my templane name--->', context["no_of_scales"])

    context['existing_scales'] = []
    field_add={"scale_name":template_name}
    response=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","fetch",field_add,"nil")
    data=json.loads(response)
    x = data["data"]
    for i in x:
        b = i['score']['id']
        print(b)
        context['existing_scales'].append(b)



    print("This are the existing scales", context['existing_scales'])
    name=url.replace("'","")
    context['template_url']= f"https://100035.pythonanywhere.com{name}?brand_name=your_brand&product_name=your_product"
    print(context['template_url'])
    return render(request, 'stapel/error_page.html', context)

def default_scale(request):
    context = {}
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    # context["npsall"] = system_settings.objects.all().order_by('-id')
    return render(request, 'stapel/default.html', context)

def default_scale_admin(request):
    role = request.session.get('role')
    if role == None:
        return redirect("https://100014.pythonanywhere.com/?redirect_url=https://100035.pythonanywhere.com/stapel/stapel-admin/default/")

    # if role != owner:
    #     return redirect("https://100035.pythonanywhere.com/nps-scale/default/")

    context = {}
    context['user'] = 'admin'
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);height:300px;overflow-y: scroll;"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    try:
        field_add = {"scale-category": "stapel scale"}
        all_scales = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
        data = json.loads(all_scales)
        context["stapelall"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)
    except:
        print("No scales found")
    return render(request, 'stapel/default.html', context)
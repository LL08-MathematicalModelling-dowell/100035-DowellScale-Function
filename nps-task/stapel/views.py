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
from dowellnps_scale_function.settings import public_url


def dowell_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/stapel/stapel-admin/settings/")
    # # print("+++++++++++++", request.session.get('user_name'))
    context={}
    context["public_url"] = public_url
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
        print(time)
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
            field_add={"event_id":eventID,"settings":{"orientation":orientation,"scale_upper_limit":scale_upper_limit,"scale_lower_limit":-scale_upper_limit,"scalecolor":scalecolor,"roundcolor":roundcolor,"fontcolor":fontcolor,"fomat":fomat,"time":time,"template_name":template_name,"name":name,"text":text, "left":left,"right":right,"scale":scale, "scale-category": "stapel scale","no_of_scales":no_of_scales}}
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
            print(x)
            # User details
            user_json = json.loads(x)
            details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
            user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")
            print("+++++++++++++", user_details)
            return redirect(f"{public_url}/stapel/stapel-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'stapel/scale_admin.html', context)

@xframe_options_exempt
@csrf_exempt
def dowell_scale1(request, tname1):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/stapel/stapel-admin/default/")
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

    # scale settings call
    field_add={"settings.template_name":tname1,}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    print("+++++++++++++", data)
    context["scale_id"] = data['data'][0]['_id']
    x= data['data'][0]['settings']
    context["defaults"] = x
    print("+++++++++++++", x['time'])
    context["scale"] = x['scale']
    context["text"] = x['text'].split("+")
    number_of_scale = x['no_of_scales']
    context["no_of_scales"] = number_of_scale
    url = request.build_absolute_uri()
    current_url = url.split('/')[-1]
    context['cur_url'] = current_url

    # find existing scale reports
    field_add = {"scale_data.scale_id": context["scale_id"]}
    response=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","fetch",field_add,"nil")
    data=json.loads(response)
    print("This is my scale_data", data)

    existing_scale = False
    if len(data['data']) != 0:
        scale_data = data["data"][0]["scale_data"]
        score_data = data["data"]
        # score_data = data["data"][0]['score']

        print("This is my scale_data", scale_data, score_data)

        total_score = 0
        for i in score_data:
            instance_id = i['score'][0]['instance_id'].split("/")[0]
            print("Instance_id --->", instance_id)
            if len(instance_id) > 3:
                continue
            b = i['score'][0]['score']
            print("Score of scales-->", b)
            total_score += int(b)

        for i in score_data:
            instance_id = i['score'][0]['instance_id'].split("/")[0]
            print("instance_id[[[[[[[[[", instance_id)
            print("current[[[[[[[[[", current_url)
            if instance_id == current_url:
                existing_scale = True
                context['response_saved'] = i['score'][0]['score']
                context['score'] = "show"
                print("Scale exists--------->", existing_scale)

        print("Scale exists--------->", existing_scale)

        print("Total scores of this scale", total_score)

    if request.method == 'POST':
        score = request.POST['scoretag']
        eventID = get_event_id()
        score = {"instance_id": f"{current_url}/{context['no_of_scales']}", 'score': score}
        print("This is the score selected---->", score)
        if existing_scale == False:
            try:
                field_add = {"event_id": eventID,
                             "scale_data": {"scale_id": context["scale_id"], "scale_type": "stapel scale"},
                             "brand_data": {"brand_name": context["brand_name"], "product_name": context["product_name"]},
                             "score": [score]}
                z = dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","insert",field_add,"nil")
                print('Scale NEW added successfully', z)

                # User details
                user_json = json.loads(z)
                details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
                user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")
                context['score'] = "show"
                print("++++++++++", user_details)
            except:
                context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request,'stapel/single_scale.html',context)

def brand_product_error(request):
    context = {}
    context["public_url"] = public_url
    url = request.COOKIES['url']
    template_name = url.split("/")[3]
    field_add={"settings.template_name":template_name}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    x = data['data'][0]['settings']
    context["defaults"] = x
    number_of_scale = x['no_of_scales']
    scale_id = data['data'][0]["_id"]

    context["no_scales"] = int(number_of_scale)
    context["no_of_scales"] = []
    for i in range(int(number_of_scale)):
        context["no_of_scales"].append(i)

    context['existing_scales'] = []
    field_add = {"scale_data.scale_id": scale_id}
    response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
        "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response)
    x = data["data"]
    for i in x:
        b = i['score'][0]['instance_id'].split("/")[0]
        print(b)
        context['existing_scales'].append(b)

    print("This are the existing scales", context['existing_scales'])
    name=url.replace("'","")
    context['template_url']= f"{public_url}{name}?brand_name=your_brand&product_name=your_product"
    # print(context['template_url'])
    return render(request, 'stapel/error_page.html', context)

def default_scale(request):
    context = {}
    context["public_url"] = public_url
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    # context["npsall"] = system_settings.objects.all().order_by('-id')
    return render(request, 'stapel/default.html', context)

def default_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/nps-admin/default/")
    # print("++++++++++ USER DETAILS", user)
    # if role != owner:
    #     return redirect("https://100035.pythonanywhere.com/nps-scale/default/")

    context = {}
    context["public_url"] = public_url
    context['user'] = 'admin'
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);height:300px;overflow-y: scroll;"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    try:
        field_add = {"settings.scale-category": "stapel scale"}
        all_scales = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
        data = json.loads(all_scales)
        print("+++++++++++++", data)
        context["stapelall"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)
    except:
        print("No scales found")
    return render(request, 'stapel/default.html', context)
import random
import json
from django.shortcuts import render, redirect, HttpResponse
from nps.dowellconnection import dowellconnection
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from nps.eventID import get_event_id
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
            if time == "":
                time = 0
            try:
                field_add={"event_id":eventID,"settings":{"orientation":orientation,"roundcolor":roundcolor,"fontcolor":fontcolor,"labelscale":labelscale,"number_of_scales":number_of_scales,"time":time,"template_name":template_name,"name":name,"scales":scales,"labeltype":labeltype,"scale-category": "likert scale"}}
                x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
                print("This is what is saved", x)

                # User details
                user_json = json.loads(x)
                details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
                user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")
                print("+++++++++++++", user_details)
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
@csrf_exempt
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

    field_add = {"settings.template_name": tname1, }
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    context["scale_id"] = data['data'][0]['_id']
    x= data['data'][0]['settings']
    context["defaults"]=x

    context['labelscale']=x["labelscale"]
    context['labeltype']=x["labeltype"]
    number_of_scale=x['number_of_scales']
    for j in x["scales"]:
        if j == "None":
            x["scales"].remove(j)

    context['scale']=x['scales']
    context["no_of_scales"]=number_of_scale
    num = url.split('/')
    url_id = num[-1]


    field_add={"scale_data.scale_id":context["scale_id"]}
    response=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","fetch",field_add,"nil")
    data=json.loads(response)
    datas=data["data"]
    context["recorded_score"]=101

    existing_scale = False
    if len(data['data']) != 0:
        score_data = data["data"]

        for i in score_data:
            if url_id == i['score'][0]['instance_id'].split("/")[0]:
                existing_scale = True
                recorded_score = (i['score'][0]['score'])
                context["recorded_score"] = recorded_score
                context['score'] = "show"

    if request.method == 'POST':
        current_url = url.split('/')[-1]
        score = request.POST['scoretag']
        eventID = get_event_id()
        score = {"instance_id": f"{current_url}/{context['no_of_scales']}", 'score':score}
        if existing_scale == False:
            try:
                field_add={"event_id":eventID,"scale_data":{"scale_id":context["scale_id"],"scale_type":"likert scale"}, "brand_data":{"brand_name":context["brand_name"],"product_name":context["product_name"]},"score":[score]}
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
    field_add={"settings.template_name":template_name}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    print(data)
    x= data['data'][0]['settings']
    context["defaults"]=x
    number_of_scale=x['number_of_scales']
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
        print(b)
        context['existing_scales'].append(b)

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
    username= request.session["user_name"]
    context = {}
    context["public_url"] = public_url
    context['user'] = 'admin'
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);height:300px;overflow-y: scroll;"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    context["username"]=username
    field_add = {"settings.scale-category": "likert scale"}
    all_scales = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data = json.loads(all_scales)
    context["likertall"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)

    return render(request, 'likert/default.html', context)
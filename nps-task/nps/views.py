import random
import json
from django.shortcuts import render, redirect, HttpResponse
from .dowellconnection import dowellconnection
from .eventID import get_event_id
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from dowellnps_scale_function.settings import public_url

from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response


def find_category(score):
    if score <= 6:
        category = "Detractor"
    elif score <= 8:
        category = "Neutral"
    elif score < 0 or score > 10:
        return Response({"Error": "Score can be only from 1-10"})
    else:
        category = "Promoter"
    return category
def total_score_fun(id):
    b = 0
    field_add = {"scale_data.scale_id": id}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
        "1094",
        "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response_data)
    print(data)
    total_score = 0
    all_scores = []
    instanceID = 0

    if len(data['data']) != 0:
        score_data = data["data"]
        for i in score_data:
            b = i['score'][0]['score']
            all_scores.append(i['score'])
            print("Score of scales-->", b)
            total_score += int(b)

            instanceID = int(i['score'][0]['instance_id'].split("/")[0])

    if total_score == 0 or len(all_scores) == 0:
        overall_category = "No response provided"
        category = "No response provided"
    else:
        overall_category = total_score / len(all_scores)
        category = find_category(overall_category)

    return overall_category, category,all_scores, instanceID, b

# CREATE SCALE SETTINGS
@api_view(['POST',])
def settings_api_view_create(request):
    if request.method == 'POST':
        response = request.data
        try:
            user = response['username']
        except:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

        left = response['left']
        center = response['center']
        right = response['right']
        text = f"{left}+{center}+{right}"
        rand_num = random.randrange(1, 10000)
        name = response['name']
        template_name = f"{name.replace(' ', '')}{rand_num}"
        print(template_name)

        eventID = get_event_id()

        field_add = {"event_id": eventID,
                     "settings": {"orientation": response['orientation'], "numberrating": response['numberrating'], "scalecolor": response['scalecolor'],
                                  "roundcolor": response['roundcolor'], "fontcolor": response['fontcolor'], "fomat": response['fomat'], "time": response['time'],
                                  "template_name": template_name, "name": response['name'], "text": text, "left": response['left'],
                                  "right": response['right'], "center": response['center'], "scale-category": "nps scale",
                                  "no_of_scales": response['no_of_scales']}}

        # print(field_add)
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "insert",
            field_add, "nil")

        user_json = json.loads(x)
        details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE",
            "insert", details, "nil")
        urls = []
        for i in range(1, response['no_of_scales'] + 1):
            url = f"{public_url}/nps-scale1/{template_name}?brand_name=your_brand&product_name=product_name/{i}"
            urls.append(url)
        return Response({"success": x, "payload": field_add, "scale_urls": urls})
    return Response({"error": "Invalid data provided."},status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET',])
def calculate_total_score(request, id=None):
    try:
        field_add = {"settings.template_name": id, }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
            "fetch", field_add, "nil")

        settings_json = json.loads(x)
        id = settings_json['data'][0]["_id"]
        print("This is my settings",id)
        overall_category, category, all_scores, instanceID, b = total_score_fun(id.strip())
    except:
        return Response({"error": "Please try again"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"All_scores": all_scores, "Category": category},status=status.HTTP_200_OK)


# SUMBIT SCALE RESPONSE
@api_view(['POST',])
def nps_response_view_submit(request):
    if request.method == 'POST':
        response = request.data
        try:
            user = response['username']
        except:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

        # id = response['id']
        id = response['template_name']
        score = response['score']
        instance_id = response['instance_id']
        field_add = {"settings.template_name": id, }
        # field_add = {"_id": id}
        default = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
            "fetch", field_add, "nil")
        data = json.loads(default)
        x = data['data'][0]['settings']
        number_of_scale = x['no_of_scales']
        id = data['data'][0]['_id']

        # find existing scale reports
        overall_category, o_category, all_scores, instanceID, b = total_score_fun(id)
        category = find_category(b)
        # print("This is my instance ID: ",instanceID)
        if instance_id == instanceID:
            return Response({"error": "Scale Response Exists!", "current_score": b,"Category": category}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        eventID = get_event_id()
        score = {"instance_id": f"{instance_id}/{number_of_scale}", 'score': score}

        if int(instance_id) > int(number_of_scale):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        category = find_category(response["score"])

        field_add = {"event_id": eventID, "scale_data": {"scale_id": id, "scale_type": "nps scale"},
                     "brand_data": {"brand_name": response["brand_name"], "product_name": response["product_name"]},
                     "score": [score]}
        z = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094",
            "ABCDE", "insert", field_add, "nil")
        user_json = json.loads(z)
        details = {"scale_id": user_json['inserted_id'], "event_id": eventID, "username": user}
        user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098", "ABCDE",
            "insert", details, "nil")
        return Response({"success": z, "score": score,"payload": field_add, "url": f"{public_url}/nps-scale1/{x['template_name']}?brand_name=your_brand&product_name=product_name/{response['instance_id']}","Category": category})
        # return Response({"success": z, "score": {score},"category": category,"payload": field_add, "url": f"{public_url}/nps-scale1/{x['template_name']}?brand_name=your_brand&product_name=product_name/{response['instance_id']}", "total score": f"{all_scores} \n TotalScore: {total_score} \n Category: {o_category}"})
    return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)

# GET ALL SCALES
@api_view(['GET',])
def scale_settings_api_view(request):
    try:
        field_add = {"settings.scale-category": "nps scale"}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "fetch",
            field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(json.loads(x))

# GET SINGLE SCALE
@api_view(['GET',])
def single_scale_settings_api_view(request, id=None):
    try:
        # field_add = {"_id": id }
        field_add = {"settings.template_name": id, }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
            "fetch", field_add, "nil")
        settings_json = json.loads(x)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        settings = settings_json['data'][0]['settings']
        no_of_scales = settings['no_of_scales']
        template_name = settings['template_name']
        urls = []
        for i in range(1, no_of_scales + 1):
            url = f"{public_url}/nps-scale1/{template_name}?brand_name=your_brand&product_name=product_name/{i}"
            urls.append(url)
        return Response({"payload": json.loads(x), "urls": urls})

# GET SINGLE SCALE RESPONSE
@api_view(['GET',])
def single_scale_response_api_view(request, id=None):
    try:
        field_add = {"_id": id }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
            "1094", "ABCDE", "fetch", field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({"payload":json.loads(x)})

# GET ALL SCALES RESPONSES
@api_view(['GET',])
def scale_response_api_view(request):
    try:
        field_add = {}
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
            "1094", "ABCDE", "fetch", field_add, "nil")
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(json.loads(x))



def dowell_scale_admin(request):
    user = request.session.get('user_name')
    if user == None:
        return redirect(f"https://100014.pythonanywhere.com/?redirect_url={public_url}/nps-admin/settings/")
    # print("+++++++++=>",user)
    context={}
    context["public_url"] = public_url
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
        no_of_scales = request.POST["no_of_scales"]
        center = request.POST["center"]
        time = request.POST['time']
        text = f"{left}+{center}+{right}"
        rand_num = random.randrange(1, 10000)
        template_name = f"{name.replace(' ', '')}{rand_num}"
        if time == "":
            time = 0
        print("This is my time", time)
        # objcolor = system_settings.objects.create(orientation=orientation,numberrating=numberrating,scalecolor=scalecolor,roundcolor=roundcolor,fontcolor=fontcolor,fomat=fomat,time=time,template_name=template_name,name=name,text=text, left=left,right=right,center=center)
        # objcolor.save()
        try:
            eventID = get_event_id()
            field_add = {"event_id":eventID,"settings":{"orientation":orientation,"numberrating":numberrating,"scalecolor":scalecolor,"roundcolor":roundcolor,"fontcolor":fontcolor,"fomat":fomat,"time":time,"template_name":template_name,"name":name,"text":text, "left":left,"right":right,"center":center, "scale-category": "nps scale", "no_of_scales":no_of_scales}}
            x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
            print("This is what is saved",x)
            # User details
            user_json = json.loads(x)
            details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
            user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")
            print("+++++++++++++",user_details)
            return redirect(f"{public_url}/nps-scale1/{template_name}")
        except:
            context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request, 'nps/scale_admin.html', context)


@xframe_options_exempt
@csrf_exempt
def dowell_scale1(request, tname1):
    context={}
    context["public_url"] = public_url
    # Get url parameters
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
        response = redirect('nps:error_page')
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
    context["scale_id"] = data['data'][0]['_id']
    # print("+++++++++++++ Scale ID",context["scale_id"])
    x= data['data'][0]['settings']
    context["defaults"]=x
    print("+++++++++++++", x['time'])
    context["text"]=x['text'].split("+")
    number_of_scale=x['no_of_scales']
    context["no_of_scales"]=number_of_scale
    current_url = url.split('/')[-1]
    context['cur_url'] = current_url

    # find existing scale reports
    field_add={"scale_data.scale_id":context["scale_id"]}
    response=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","fetch",field_add,"nil")
    data=json.loads(response)
    print("This is my scale_data", data)

    existing_scale = False

    if len(data['data']) != 0:
        scale_data = data["data"][0]["scale_data"]
        score_data = data["data"]
        # score_data = data["data"][0]['score']
        print("This is my scale_data", scale_data)

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
            # if data["data"][0]["scale_data"]["scale_id"] == "63b5ad4f571d55f21bab1ce6":
            #     break
            if len(instance_id) > 3:
                continue
            instance_id = i['score'][0]['instance_id'].split("/")[0]
            print("instance_id[[[[[[[[[",instance_id)
            print("current[[[[[[[[[",current_url)
            if instance_id == current_url:
                existing_scale = True
                context['response_saved'] = i['score'][0]['score']
                context['score'] = "show"
                print("Scale exists--------->", existing_scale)
            elif data["data"][0]["scale_data"]["scale_id"] == "63b5ad4f571d55f21bab1ce6":
                existing_scale = False
                # context['response_saved'] = i['score'][0]['score']
                context['score'] = ""

    if request.method == 'POST':
        score = request.POST['scoretag']
        eventID = get_event_id()
        score = {"instance_id": f"{current_url}/{context['no_of_scales']}", 'score':score}
        if len(data['data']) != 0:
            if data["data"][0]["scale_data"]["scale_id"] == "63b5ad4f571d55f21bab1ce6":
                score = {"instance_id": f"Default", 'score': score}

        print("Scale exists--------->", existing_scale )
        if existing_scale == False:
            # if existing_scale == False or data["data"][0]["scale_data"]["scale_id"] == "63b5ad4f571d55f21bab1ce6":
            try:
                field_add={"event_id":eventID,"scale_data":{"scale_id":context["scale_id"],"scale_type":"nps scale"}, "brand_data":{"brand_name":context["brand_name"],"product_name":context["product_name"]},"score":[score]}
                z=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","insert",field_add,"nil")
                print("Scale NEW added successfully", z)

                # User details
                user_json = json.loads(z)
                user = request.session.get('user_name')
                details = {"scale_id":user_json['inserted_id'], "event_id": eventID, "username": user }
                user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","insert",details,"nil")
                context['score'] = "show"
                print("++++++++++", user_details)
            except:
                context["Error"] = "Error Occurred while save the custom pl contact admin"
    return render(request,'nps/single_scale.html',context)

def brand_product_error(request):
    context = {}
    context["public_url"] = public_url
    url = request.COOKIES['url']
    template_name = url.split("/")[2]
    field_add={"settings.template_name":template_name}
    default = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data=json.loads(default)
    x= data['data'][0]['settings']
    context["defaults"]=x
    number_of_scale=x['no_of_scales']
    scale_id = data['data'][0]["_id"]

    context["no_scales"]=int(number_of_scale)
    context["no_of_scales"]=[]
    for i in range(int(number_of_scale)):
        context["no_of_scales"].append(i)

    context['existing_scales'] = []
    field_add={"scale_data.scale_id":scale_id}
    response=dowellconnection("dowellscale","bangalore","dowellscale","scale_reports","scale_reports","1094","ABCDE","fetch",field_add,"nil")
    data=json.loads(response)
    x = data["data"]
    for i in x:
        b = i['score'][0]['instance_id'].split("/")[0]
        print(b)
        context['existing_scales'].append(b)

    print("This are the existing scales", context['existing_scales'])
    name=url.replace("'","")
    context['template_url']= f"{public_url}{name}?brand_name=your_brand&product_name=your_product"
    return render(request, 'nps/error_page.html', context)

def default_scale(request):
    context = {}
    context["public_url"] = public_url
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3)"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    return render(request, 'nps/default.html', context)

def default_scale_admin(request):
    context = {}
    context["public_url"] = public_url
    context['user'] = 'admin'
    context["left"]="border:silver 2px solid; box-shadow:2px 2px 2px 2px rgba(0,0,0,0.3);height:300px;overflow-y: scroll;"
    context["hist"] = "Scale History"
    context["btn"] = "btn btn-dark"
    context["urltext"] = "Create new scale"
    field_add = {"settings.scale-category": "nps scale"}
    all_scales = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
    data = json.loads(all_scales)
    context["npsall"] = sorted(data["data"], key=lambda d: d['_id'], reverse=True)
    return render(request, 'nps/default.html', context)


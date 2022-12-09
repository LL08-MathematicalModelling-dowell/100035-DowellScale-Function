from django.shortcuts import render, redirect
from django.http import HttpResponse
from nps.login import get_user_profile, Dowell_Login
from django.views.decorators.csrf import csrf_exempt
import json


# Create your views here
@csrf_exempt
def logins (request):
    if request.method == "POST":
        name = request.POST.get("username")
        password=request.POST.get("password")
        loc=request.POST["loc"]
        device=request.POST["dev"]
        osver=request.POST["os"]
        brow=request.POST["brow"]
        ltime=request.POST["time"]
        ipuser=request.POST["ip"]
        mobconn=request.POST["conn"]
        response= Dowell_Login(name,password,loc,device,osver,brow,ltime,ipuser,mobconn)
        responses=(json.loads(response))
        print(responses)
        
        try:
            if responses["role"]=="Client_Admin":
                request.session["role"]="Client_Admin"
                return redirect("http://127.0.0.1:8000/home/")
            elif responses["role"]=="user":
                request.session["role"]="user"
                return redirect("http://127.0.0.1:8000/home/")
        except:
            return redirect("https://100014.pythonanywhere.com/")
    return render(request, "login_page.html")


def homepage(request):
    context={}
    role = request.session.get('role')
    context["role"]=role
    
    return render(request, "homepage.html", context=context)
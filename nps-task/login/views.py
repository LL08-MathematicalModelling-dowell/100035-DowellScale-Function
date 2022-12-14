from django.shortcuts import render
from django.shortcuts import render, redirect
from nps.login import  Dowell_Login
from django.views.decorators.csrf import csrf_exempt
import json


# Create your views here
"""@csrf_exempt
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
                #return redirect("http://127.0.0.1:8000/home/")
                return redirect("https://100035.pythonanywhere.com/home/")
            elif responses["role"]=="user":
                request.session["role"]="user"
                return redirect("https://100035.pythonanywhere.com/home/")
               # return redirect("http://127.0.0.1:8000/home/")
        except:
            return redirect("https://100014.pythonanywhere.com/")
    return render(request, "login_page.html")
"""
def logins(request):
    url = request.GET.get('session_id', None)
    print(url)
    uri =request.path
    print(uri)
    if url == None:
        return redirect("https://100014.pythonanywhere.com/")
    user="test"
    # return HttpResponse(user)
    try:
        if user["username"]:
            if user["role"]=='Client_Admin' or user["role"]=='TeamMember':
                response = redirect("nps:default_page_admin")
                response.set_cookie('user', user['username'])
                return response
            else:
                response = redirect("nps:default_page")
                response.set_cookie('user', user["username"])
                return response
    except:
        return redirect("https://100014.pythonanywhere.com/")

def homepage(request):
    context={}
    role = request.session.get('role')
    context["role"]=role
    
    return render(request, "homepage.html", context=context)
# Create your views here.

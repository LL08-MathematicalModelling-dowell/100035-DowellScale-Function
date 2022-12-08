from django.shortcuts import render, redirect
from django.http import HttpResponse
from nps.login import get_user_profile
from django.views.decorators.csrf import csrf_exempt



# Create your views here
@csrf_exempt
def logins (request):
    if request.method == "POST":
        redirect("home/")
    return render(request, "login_page.html")
"""@csrf_exempt
def logins(request):
    url = request.GET.get('session_id', None)
    if url == None:
        return redirect("http://127.0.0.1:8000/login/")
    user=get_user_profile(url)
    # return HttpResponse(user)
    try:
        if user["username"]:
            if user["role"]=='Client_Admin' or user["role"]=='TeamMember':
                response = redirect("/home/")
                response.set_cookie('user', user['username'])
                return response
            else:
                response = redirect("/home/")
                response.set_cookie('user', user["username"])
                return response
    except:
        return redirect("http://127.0.0.1:8000/login")"""
    

def homepage(request):
    return render(request, "homepage.html")
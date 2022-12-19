from django.shortcuts import render, HttpResponse, redirect
from nps.main_login import  Dowell_Login
from nps.login import get_user_profile
from django.views.decorators.csrf import csrf_exempt
import json
import requests

def redirect_to_login():
    return redirect(
        "https://100014.pythonanywhere.com/?redirect_url=http://100035.pythonanywhere.com/home/"
    )
def homepage(request):
    context={}
    session_id = request.GET.get("session_id", None)
    code=request.GET.get('id',None)
    if session_id:
        try:
            url="https://100014.pythonanywhere.com/api/userinfo/"
            response=requests.post(url,data={"session_id":session_id})
            profile_detais= json.loads(response.text)
            request.session["userinfo"]=profile_detais["userinfo"]
            request.session["user_name"]=profile_detais["userinfo"]["username"]
            request.session["portfolio_info"]=profile_detais["portfolio_info"]
            request.session["role"]=profile_detais["portfolio_info"]["role"]
            context['user_role'] = request.session.get('role')
            # print("+++++++++++", request.session.get('role'))
            return render(request, "login/homepage.html", context=context)
        except:
            return redirect_to_login()
    elif id == '100093':
        url="https://100093.pythonanywhere.com/api/userinfo/"
        response=requests.post(url,data={"session_id":session_id})
        profile_detais= json.loads(response.text)
        request.session["userinfo"]=profile_detais["userinfo"]
        request.session["user_name"]=profile_detais["userinfo"]["username"]
        request.session["portfolio_info"]=profile_detais["portfolio_info"]
        request.session["role"]=profile_detais["portfolio_info"]["role"]
        # return redirect("/page")
    else:
      return redirect_to_login()
# Create your views here.
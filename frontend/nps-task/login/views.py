from django.shortcuts import render, HttpResponse, redirect
from nps.main_login import Dowell_Login
from nps.login import get_user_profile
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from dowellnps_scale_function.settings import public_url


def redirect_to_login():
    return redirect(
        f"https://100014.pythonanywhere.com/?redirect_url={public_url}/home/"
    )


def homepage(request):
    context = {}
    context["public_url"] = public_url
    session_id = request.GET.get("session_id", None)
    code = request.GET.get('id', None)
    if session_id:
        try:
            url = "https://100014.pythonanywhere.com/api/userinfo/"
            response = requests.post(url, data={"session_id": session_id})
            profile_detais = json.loads(response.text)
            request.session["userinfo"] = profile_detais["userinfo"]
            request.session["user_name"] = profile_detais["userinfo"]["username"]
            context['user_role'] = 'owner'
            # print("+++++++++++", request.session.get('role'))
            return render(request, "login/homepage.html", context=context)
        except:
            print("hello")
            return redirect_to_login()
    else:
        print("hello2")
    return redirect_to_login()


def logout(request):
    # del request.session["userinfo"]
    # del request.session["user_name"]
    # del request.session["portfolio_info"]
    # del request.session["role"]
    return redirect("https://100014.pythonanywhere.com/sign-out")

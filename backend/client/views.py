import json

import requests
from django.shortcuts import render, redirect

from dowellnps_scale_function.settings import public_url


# Create your views here.
def redirect_to_login():
    return redirect(
        f"https://100014.pythonanywhere.com/?redirect_url={public_url}/client/"
    )
def homepage(request):
    context={}
    context["public_url"] = public_url
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
            context["member_type"] = profile_detais["portfolio_info"][0]['member_type']
            context["porfolio_name"] = profile_detais["portfolio_info"][0]['portfolio_name']
            context["portfolio_username"] = profile_detais["portfolio_info"][0]['username'][0]
            context["data_type"] = profile_detais["portfolio_info"][0]['data_type']
            context["operations_right"] = profile_detais["portfolio_info"][0]['operations_right']
            context["role"] = profile_detais["portfolio_info"][0]['role']
            context["org_name"] = profile_detais["portfolio_info"][0]['org_name']

            context['user_name'] = request.session["user_name"]
            # print("+++++++++++", member_type, porfolio_name, username, data_type, operations_right, role, org_name)
            return render(request, 'client/homepage.html', context)
        except:
            return redirect('client:redirect_portfolio')
    else:
      return redirect_to_login()

def redirect_portfolio(request):
    return render(request, 'client/redirect_portfolio.html')
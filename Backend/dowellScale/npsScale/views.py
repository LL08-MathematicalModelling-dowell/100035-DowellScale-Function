from django.shortcuts import render, redirect
import requests, json
from django.http import HttpResponse

# Create your views here.
def mainPage(request):
  session_id = request.POST.get("session_id")
  url = "http://100002.pythonanywhere.com/"
    # adding edited field in article
  payload = json.dumps({
      "cluster": "login",
      "database": "login",
      "collection": "login",
      "document": "login",
      "team_member_ID": "6752828281",
      "function_ID": "ABCDE",
      "command": "find",
      "field": {"SessionID":session_id},
      "update_field": {
        "order_nos": 21
      },
      "platform": "bangalore"
    })
  headers = {
      'Content-Type': 'application/json'
    }

  response = requests.request("POST", url, headers=headers, data=payload)
  data = json.loads(response.text)
  if 'SessionID' in data:
    print('\n#################\n', data)
    return render(request, 'npsScale/main.html')

  else:
    print('\n#################\n', data, ' \n ')    
    return redirect("https://100014.pythonanywhere.com/")


def index(request):
  print('Testttttt')  
  return render(request, 'npsScale/main.html')

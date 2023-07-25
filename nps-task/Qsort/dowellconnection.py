from collections import defaultdict

import requests
import random
import json
from rest_framework.decorators import api_view
import requests


# dowell API
url = 'http://100002.pythonanywhere.com/'
def dowellconnection(cluster,platform,database,collection,document,team_member_ID,function_ID,command,field=None,update_field=None):
    data={
      "cluster": cluster,
      "platform": platform,
      "database": database,
      "collection": collection,
      "document": document,
      "team_member_ID": team_member_ID,
      "function_ID": function_ID,
      "command": "fetch",
      "field": {"eventId": "FB1010000000166564637454228642"},
      "update_field":{"template_name":"umarjaved"}
       }
    headers = {'content-type': 'application/json'}
    try :
      response = requests.post(url, json=data,headers=headers)
      return response.json()
    except:
      return "check your connectivity"
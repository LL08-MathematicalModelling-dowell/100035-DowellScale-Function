import json
from typing import NoReturn
import urllib
import pprint
import requests
url = 'https://100002.pythonanywhere.com/'
def dowellconnection(cluster,platform,database,collection,document,team_member_ID,function_ID,command,field,update_field):
    data={
      "cluster": cluster,
      "platform": platform,
      "database": database,
      "collection": collection,
      "document": document,
      "team_member_ID": team_member_ID,
      "function_ID": function_ID,
      "command": command,
      "field": field,
      "update_field":update_field
       }
    headers = {'content-type': 'application/json'}
    try :
      response = requests.post(url, json=data,headers=headers)
      return response.text
    except:
      return "check your connectivity"


# Update Dowell Connection
def update_template(template_id, data):
    url = ""
    payload = json.dumps(
        {
            # **TEMPLATE_CONNECTION_DICT,
            "command":"update",
            "field":{
                "_id":template_id,
            },
            "update_field":{
                "content":data,
            },
            "platform":"bangalore"
        }
    )
    headers = {'Content-type': 'application/json'}
    response = requests.post("POST",url, json=data, headers=headers, data=payload)
    return response.text


field_add = {"_id":"63a4a0b62fa34b2a7cb25ebe"}
response_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094", "ABCDE","fetch", field_add, "nil")

# field_add={"settings.template_name":"TestSetting9027"}
# scale_details = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
# b = json.loads(scale_details)
# print(b['data'][0]['settings'])


# details = {}
# user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","fetch",details,"nil")

# z = b["data"][-1]['score']
# for i in z:
#     x = i['instance_id'].split("/")[0]
# print(x)


# 63a2072408a1b053ce80b71e
id = "63a4a0b62fa34b2a7cb25ebe"
data = {'score':{"id":10,"score":10}}
x = update_template(id, data)

print(response_details)
b = json.loads(response_details)

import json
from typing import NoReturn
import urllib
import pprint
import requests
url = 'https://100002.pythonanywhere.com/'
from nps.eventID import get_event_id
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


CONNECTION_LIST = [
                "dowellscale",
                "bangalore",
                "dowellscale",
                "scale_reports",
                "scale_reports",
                "1094",
                "ABCDE",
            ],
# Update Dowell Connection
def update_template(template_id, data):
    url = ""
    payload = json.dumps(
        {
            **CONNECTION_LIST,
            "command":"update",
            "field":{
                "_id":template_id,
            },
            "update_field":{
                "score":data,
            },
            "platform":"bangalore"
        }
    )
    headers = {'Content-type': 'application/json'}
    response = requests.post("POST",url, json=data, headers=headers, data=payload)
    return response.text


# field_add = {"scale_data.scale_id":"63a77ba4755ae14e588fb042"}
# response_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094", "ABCDE","fetch", field_add, "nil")

# field_add={"settings.scale-category": "nps scale"}
# field_add={"_id": "63b5ab7e77bdae87c8ab1be9"}
# scale_details = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","fetch",field_add,"nil")
# # b = json.loads(scale_details)
# print(scale_details)


# details = {}
# user_details = dowellconnection("dowellscale","bangalore","dowellscale","users","users","1098","ABCDE","fetch",details,"nil")
# print(b)
# z = b["data"][-1]['score']
# for i in z:
#     x = i['instance_id'].split("/")[0]
# print(x)


# 63a2072408a1b053ce80b71e
# id = "63a77ba4755ae14e588fb042"
# data = {"score":10}
# x = update_template(id, data)
eventID = get_event_id()
field_add = {"eventId": eventID,
             "settings": {"question": "Do you wish to recommend this application to your friend?", "orientation": "horizontal", "scalecolor": "#6df782",
                          "fontcolor": "green", "time": 0, "template_name": "Nps_lite_Default", "name": "Nps_lite_Default",
                          "center": "May be", "left": "No", "right": "Yes", "scale-category": "npslite scale",
                          "no_of_scales": 1}}

# field_add = {"event_id":eventID,"settings":{"orientation":"horizontal","numberrating":10,"scalecolor":"rgb(255, 213, 128)","roundcolor":"rgb(255, 239, 213)","fontcolor":"rgb(217, 83, 79)","fomat":"numbers","time":0,"template_name":"Nps_Default","name":"Nps_Default","text":text, "left":"Very unlikely","right":"Very likely","center":"Select score", "scale-category": "nps scale", "no_of_scales":1}}
x = dowellconnection("dowellscale","bangalore","dowellscale","scale","scale","1093","ABCDE","insert",field_add,"nil")
print(x)
#
# print(scale_details)
# b = json.loads(response_details)

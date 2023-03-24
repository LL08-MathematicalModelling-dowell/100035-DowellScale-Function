import requests
import json
url = 'http://uxlivinglab.pythonanywhere.com/'
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
      return response.json()
    except:
      return "check your connectivity"

# field_add = {"template_id": 27289,}
field_add = {"brand_data.product_name": "600"}
response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
    "1094","ABCDE", "fetch", field_add, "nil")
data = json.loads(response_data)["data"]
# loop over token find the one with matching instance = document
all_scales = []
if len(data) != 0:
    for x in data:
        instance_id = int(x['score'][0]['instance_id'].split("/")[-1])
        if instance_id == 1: #document_number
            all_scales.append(x)

nps_scales = 0
nps_score = 0

stapel_scales = 0
stapel_score = []
for x in all_scales:
    scale_type = x["scale_data"]["scale_type"]  # nps/stapel/lite
    if scale_type == "nps scale":
        score = x['score'][0]['score']
        nps_score += score
        nps_scales += 1
    elif scale_type == "stapel scale":
        score = x['score'][0]['score']
        stapel_score.append(score)
        stapel_scales += 1


print(stapel_scales)
print(stapel_score)


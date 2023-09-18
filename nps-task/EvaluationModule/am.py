"""



"""
import json

import requests
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


# scale_ids = ["64fc236947f5a85828e6f468", "64fc24bce6cfd1c5cef082c9", "64fc27785c7a75d5ff05e488"]
# scale_ids = ["65015b4c6a49c75e8b0c8dab", "65015c51f8f367e6ce1126ef", "65015d2bbb53443f82509cce"]
#
# for index, id in enumerate(scale_ids, start=1):
#     field_add = {"scale_id": f"{id}"}
#     response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data",
#                                              "1181", "ABCDE", "find", field_add, "nil")
#     config_data = json.loads(response_data)
#     print(f"Scale {index} : {id} --- {config_data}")


#Body (template_id, type of element(TEXT_INPUT/IMAGE), element id(t2,i1,t3), document_id)
# template_id = "65016938bb53443f82509ffb"
template_id = "6501693fd2cbd3e0c5b61acd"
element = "t2"
process_id = "abcdef01234567"
field_add = {"process_id": process_id}
response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                 "scale_reports",
                                 "1094", "ABCDE", "find", field_add, "nil")
print(json.loads(response_data)['data'])
score = json.loads(response_data)['data']['score']['score']
print(score)
#querry the custom configuration api with template_id, type of element, element id
field_add = {"template_id": template_id, "custom_input_groupings.TEXT_INPUT": element}
response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data",
                                 "1181", "ABCDE", "find", field_add, "nil")

print(response_data)
# Find scale id, querry the reports db with scale_id, document_id
scale = json.loads(response_data)['data']['scale_id']
print(scale)
field_add = {"scale_data.scale_id": scale}
response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                 "scale_reports",
                                 "1094", "ABCDE", "find", field_add, "nil")

print(json.loads(response_data)['data'])
score = json.loads(response_data)['data']['score']['score']
print(score)
field_add = {"_id": "65016bf08b3fdeb091d461b9"}
response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                 "scale_reports",
                                 "1094", "ABCDE", "find", field_add, "nil")

print(json.loads(response_data))


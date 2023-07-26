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
      response = requests.post(url, json =data,headers=headers)
      print(response.json())
      return response.json()
    except Exception as e:
        print("Error:", e)
        return "check your connectivity"
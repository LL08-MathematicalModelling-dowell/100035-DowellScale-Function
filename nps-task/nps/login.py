import requests as req
import json
def get_user_profile(key):
    data={'key':key}
    headers={"Content-Type": "application/json"}
    url="https://100014.pythonanywhere.com/api/profile/"
    data=req.post(url,data,headers)
    dic=data.text
    return json.loads(dic)
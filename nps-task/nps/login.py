import requests as req
import json
def get_user_profile(key):
    data={'key':key}
    headers={"Content-Type": "application/json"}
    url="https://100014.pythonanywhere.com/api/profile/"
    data=req.post(url,data,headers)
    dic=data.text
    return json.loads(dic)

#print(get_user_profile)

def Dowell_Login(username,password,location,device,os,browser,time,ip,type_of_conn):
    url="http://100014.pythonanywhere.com/api/login/"
    userurl="http://100014.pythonanywhere.com/api/user/"
    payload = {
        'username': username,
        'password': password,
        'location':location,
        'device':device,
        'os':os,
        'browser':browser,
        'time':time,
        'ip':ip,
        'type_of_conn':type_of_conn
    }
    with req.Session() as s:
        p = s.post(url, data=payload)
        #print(p.text)
        if "Username" in p.text:
            return p.text
        else:
            user = s.get(userurl)
            return user.text
        
#print(Dowell_Login("couzy","Cour@geous98","location","device","os","browser","time","ip","type_of_conn"))
def test_new_login():
    url="https://100014.pythonanywhere.com/api/userinfo/"
    payload={"session_id":"ppiq9ojeea2iryp4bvxb9f0i25xk57aj"}
    request = req.post(url=url,data=payload)
    return request.text

print(test_new_login())
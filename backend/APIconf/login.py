import requests
import json
def get_user_profile(request, key):
    # code=request.GET.get('id',None)
    if key:
        url="https://100014.pythonanywhere.com/api/userinfo/"
        response=requests.post(url,data={"session_id":key})
        profile_detais= json.loads(response.text)
        user_role = request.session.get('role')
        return profile_detais

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
    with requests.Session() as s:
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
    request = requests.post(url=url,data=payload)
    return request.text

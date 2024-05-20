import requests

def Dowell_Login(username,password):
    url="http://100014.pythonanywhere.com/api/login/"
    userurl="http://100014.pythonanywhere.com/api/user/"
    payload = {
        'username': username,
        'password': password,

    }
    with requests.Session() as s:
        p = s.post(url, data=payload)
        print(p.text)
        if "Username" in p.text:
            return p.text
        else:
            user = s.get(userurl)
            return user.text

# x = Dowell_Login("Ndoneambrose","Ambro145!","location","device","os","browser","time","ip","type_of_conn")
# print(x)
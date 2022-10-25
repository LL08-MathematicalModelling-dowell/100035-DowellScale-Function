import json
import requests

def stapel_api():
    url = "http://127.0.0.1:8000/api/stapel-scale/"
    request_data={
            "nameofscale":"couzy",
             "orientation":"horizontal",
             "scale_upper_limit":"10",
             "scolor":"#00FF00",
             "rcolor":" #0000FF",
             "fcolor":" #FFFFFF",
             "fomat":"numbers",
             "left" :"left",
             "right":'right',
             "time":"200",
             "spacing_unit":'2'
             }
    
    headers = {'content-type': 'application/json'}
    response = requests.post(url, json=request_data,headers=headers)
    return response.text
   
    

       
def nps_api():
    url = "http://127.0.0.1:8000/api/nps-scale/"
    request_data={
            "nameofscale":"couzy",
             "orientation":"horizontal",
             "scolor":"#00FF00",
             "rcolor":" #0000FF",
             "fcolor":" #FFFFFF",
             "fomat":"numbers",
             "left" :"left",
             "right":'right',
             "time":"200",
             "spacing_unit":'2',
             "center":"center"
             }
    
    headers = {'content-type': 'application/json'}
    response = requests.post(url, json=request_data,headers=headers)
    return response.text

def likert_api():
    url = "http://127.0.0.1:8000/api/likert-scale/"
    request_data={
            "nameofscale":"couzy",
             "orientation":"horizontal",
             "rcolor":" #0000FF",
             "fcolor":" #FFFFFF",
             "labelscale" :"left",
             "labeltype":'right',
             "time":"200",
             "scale":["Yes", "No","None","None","None","None","None","None","None"],             
             }
    
    headers = {'content-type': 'application/json'}
    response = requests.post(url, json=request_data,headers=headers)
    return response.text
   
print(nps_api())
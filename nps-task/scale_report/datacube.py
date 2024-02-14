import requests
import json

class Datacube:

    url = "https://datacube.uxlivinglab.online/db_api/"

    def __init__(self , db_name , col_name) -> None:
        self.db = db_name
        self.collection = col_name
        pass

    @classmethod
    def add_collection(cls , db_name : str , col_name : str):
        data = {
            "api_key": "your-dowell-api-key",
            "db_name": db_name,
            "coll_names": col_name,
        "num_collections": 1
        }

        response = requests.post(cls.url + "add_collection/", json=data)
        if response.status_code != 200:
            return {"is_error" : True , "message" : response.text}
        
        return {"is_error" : False , "message" : response.text}
    
    def find(self , query: dict , limit : int = 1 , offset : int = 0):
        data = {
            "api_key": "your-dowell-api-key",
            "db_name": self.db,
            "coll_name":self.collection,
            "operation": "fetch",
            "filters": query,
                "limit": limit,
            "offset": offset
        }

        response = requests.post(self.url + "get_data4/", json=data)
        if response.status_code != 200:
            return {"is_error" : True , "message" : response.text}
        
        return {"is_error" : False , "message" : response.text}
        
    
    def insert(self , data : dict):
        data = {
    
            "api_key": "your-dowell-api-key",
            "db_name": self.db,
            "coll_name": self.collection,
            "operation": "insert",
            "data": data
            
        }

        response = requests.post(self.url + "crud/", json=data)
        if response.status_code != 200:
            return {"is_error" : True , "message" : response.text}
        
        return {"is_error" : False , "message" : response.text}
    
    def update(self ,  id : dict , data : dict):
        data = {
            "api_key": "your-dowell-api-key",
            "db_name": "dowell",
            "coll_name": "test",
            "operation": "update",
            "query" : {"_id": "64f6fac8ac03855a010559f2"},
            "update_data": {
            "id": "101001010101",
            "info": {'name': "dowell"},
            "records": [{
            "record": "1",
        "type": "overall_updated"
            }]
        }
        }

        response = requests.put(self.url, json=data)
        print(response.text)        
    
    def delete(self , query : dict):
        data = {
    
            "api_key": "your-dowell-api-key",
            "db_name": self.db,
            "coll_name": self.collection,
            "operation": "delete",
            "query": query
            
        }

        response = requests.delete(self.url + "crud/", json=data)
        if response.status_code != 200:
            return {"is_error" : True , "message" : response.text}
        
        return {"is_error" : False , "message" : response.text}
    

        
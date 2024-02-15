import requests
import json

from .exceptions import AlreadyExistsError , DatacubeError , CollectionNotFoundError , DatabaseNotFoundError

class Datacube:

    url = "https://datacube.uxlivinglab.online/db_api/"

    def __init__(self , db_name , col_name) -> None:
        self.db = db_name
        self.collection = col_name
        self.api_key = None


    @property
    def connection_info(self):
        """Information about the datacube connection made by the client."""
        return {
            "db_name": self.db,
            "api_key": self.api_key,
        }


    def add_collection(self , col_name : str):
        data = {
            **self.connection_info,
            "coll_names": col_name,
            "num_collections": 1
        }


        response = requests.post(self.db + "add_collection/", json=data)
        self._handle_response_errors(response)
        
        return {"is_error" : False , "message" : response.text}
    
    def find(self , query: dict , limit : int = 1 , offset : int = 0):
        data = {
            **self.connection_info,
            "coll_name":self.collection,
            "operation": "fetch",
            "filters": query,
                "limit": limit,
            "offset": offset
        }

        response = requests.post(self.url + "get_data4/", json=data)
        self._handle_error_response(response)
        
        return {"is_error" : False , "message" : response.text}
        
    
    def insert(self , data : dict):
        data = {
    
            **self.connection_info,
            "coll_name": self.collection,
            "operation": "insert",
            "data": data
            
        }

        response = requests.post(self.url + "crud/", json=data)
        self._handle_error_response(response)
        
        return {"is_error" : False , "message" : response.text}
    
    def update(self ,  id : dict , data : dict):
        data = {
            **self.connection_info,
            "coll_name": "test",
            "operation": "update",
            "query" :id ,
            "update_data":  data, 
        }

        response = requests.put(self.url, json=data)
        self._handle_error_response(response)

        return response.json()

    def _handle_error_response(self, response: requests.Response):
        """
        Handles errors in the connection response, if any. 
        Raises the appropriate exception for response error.
        """
        message = response.json().get("message", "")
        was_successful = response.json().get("success", False)
        if not was_successful or not response.ok:
            if 400 <= response.status_code < 500:
                if response.status_code == 404:
                    if "collection" in message.lower():
                        raise CollectionNotFoundError(message)
                    raise DatabaseNotFoundError(message)
                
                elif response.status_code == 409:
                    raise AlreadyExistsError(message)
                raise ConnectionError(f"Code{response.status_code} {message}")
            
            raise DatacubeError(f"Code{response.status_code} {message}")
        return None        
    
    def delete(self , query : dict):
        data = {
    
            **self.connection_info,
            "coll_name": self.collection,
            "operation": "delete",
            "query": query
            
        }

        response = requests.delete(self.url + "crud/", json=data)
        self._handle_error_response(response)

        return {"is_error" : False , "message" : response.text}
    

class DBModels:
    """
    A class that models the Django Models but for the Datacube collection under the dowellscale application. 
    """

        
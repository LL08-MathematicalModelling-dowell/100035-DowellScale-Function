import requests
import json

api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f"

def datacube_db(api_key, operation,payload=None, update_data=None, id=None):
    data = {
        "api_key": api_key,
        "db_name": "livinglab_scales",
        "coll_name": "collection_3",
        "operation": operation,
        "payment": False
    }
    DB_URL = "https://datacube.uxlivinglab.online/db_api/crud/"
    try:
        if operation == "fetch":
            DB_URL = "https://datacube.uxlivinglab.online/db_api/get_data/"
            data["filters"] = {"_id": id}
            data["limit"] = 10000
            data["offset"] = 0
            response = requests.post(DB_URL, json=data)
        elif operation == "insert":
            data["data"] = payload
            response = requests.post(DB_URL, json=data)
        elif operation == "update":
            data["query"] = {"_id": id}
            data["update_data"] = update_data
            response = requests.put(DB_URL, json=data)
        elif operation == "delete":
            data["query"] = {"_id": id}
            response = requests.delete(DB_URL, json=data)
        else:
            raise ValueError("Unsupported operation!")
        response_data = json.loads(response.text)
        return response_data
    except Exception as e:
        print(e)
        return e


def datacube_db_response(api_key, operation, scale_id=None, channel_name=None, instance_name=None, payload=None):
    data = {
        "api_key": api_key,
        "db_name": "livinglab_scale_response",
        "coll_name": "collection_1",
        "operation": operation,
        "payment": False
    }
    DB_URL = "https://datacube.uxlivinglab.online/db_api/crud/"
    try:
        if operation == "fetch":
            DB_URL = "https://datacube.uxlivinglab.online/db_api/get_data/"
            data["filters"] = {"scale_id": scale_id, "channel_name":channel_name,"instance_name":instance_name}
            data["limit"] = 10000
            data["offset"] = 0
            response = requests.post(DB_URL, json=data)
        elif operation == "insert":
            data["data"] = payload
            response = requests.post(DB_URL, json=data)
        elif operation == "delete":
            data["query"] = {"_id": id}
            response = requests.delete(DB_URL, json=data)
        else:
            raise ValueError("Unsupported operation!")
        response_data = json.loads(response.text)
        print("Tombotaller", response_data)
        # response_data["data"] = data
        return response_data
    except Exception as e:
        print(e)
        return e

import json
import requests

api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f"
base_url = "https://www.dowelldatacube.uxlivinglab.online/db_api"
# base_url = "https://datacube.uxlivinglab.online/db_api/"

def datacube_data_insertion(api_key, database_name, collection_name, data):
    global base_url
    url = f"{base_url}/crud/"
    payload = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "insert",
        "data": data,
        "payment": False
    }

    print(payload)

    response = requests.post(url, json=payload)
    print(response.text)
    return response.text


def datacube_data_retrieval(api_key, database_name, collection_name, data, limit, offset, payment):
    global base_url
    url = f"{base_url}/get_data/"
    payload = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "fetch",
        "filters": data,
        "limit": limit,
        "offset": offset,
        "payment": payment
    }

    response = requests.post(url, json=payload)
    return response.text


def datacube_data_update(api_key, db_name, coll_name, query, update_data):
    global base_url
    url = f"{base_url}/crud/"

    payload = {
        "api_key": api_key,
        "db_name": db_name,
        "coll_name": coll_name,
        "operation": "update",
        "query": query,
        "update_data": update_data,
        "payment": False
    }

    response = requests.put(url, json=payload)
    return response.text


def datacube_create_collection(api_key, db_name, collection_name):
    global base_url
    url = f"{base_url}/add_collection/"
    payload = {
        "api_key": api_key,
        "db_name": db_name,
        "coll_names": collection_name,
        "num_collections": 1
    }

    response = requests.post(url, json=payload)
    return response.text


def datacube_collection_retrieval(api_key, db_name):
    global base_url
    url = f"{base_url}/collections/"
    
    payload = {
        "api_key": api_key,
        "db_name": db_name,
        "payment": False
    }
    response = requests.get(url, json=payload)
    return response.text


def datacube_data_delete(api_key, db_name, collection_name, query):
    global base_url
    url = f"{base_url}/crud/"

    payload = {
        "api_key": api_key,
        "db_name": db_name,
        "coll_name": collection_name,
        "operation": "delete",
        "query": query
    }
    response = requests.delete(url, json=payload)
    return response.text
import json
import requests

def datacube_data_insertion(api_key, database_name, collection_name, data):
    """
    Insert data into a collection in the DataCube database.

    :param api_key: The API key for authentication.
    :param database_name: The name of the database.
    :param collection_name: The name of the collection.
    :param data: The data to be inserted into the collection.
    :return: The response text from the server.
    """
    url = "https://datacube.uxlivinglab.online/db_api/crud/"

    payload = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "insert",
        "data": data,
        "payment": False
    }

    response = requests.post(url, json=payload)
    return response.text


def datacube_data_retrieval(api_key, database_name, collection_name, data, limit, offset, payment):
    """
    Retrieve data from a collection in the DataCube database.

    :param api_key: The API key for authentication.
    :param database_name: The name of the database.
    :param collection_name: The name of the collection.
    :param data: Filters to apply when retrieving data.
    :param limit: The maximum number of documents to retrieve.
    :param offset: The number of documents to skip before starting to collect data.
    :param payment: Whether payment is required for accessing the data.
    :return: The response text from the server.
    """
    url = "https://datacube.uxlivinglab.online/db_api/get_data/"

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
    """
    Update data in a collection in the DataCube database.

    :param api_key: The API key for authentication.
    :param db_name: The name of the database.
    :param coll_name: The name of the collection.
    :param query: The query to select the documents to update.
    :param update_data: The data to be updated in the selected documents.
    :return: The response text from the server.
    """
    url = "https://datacube.uxlivinglab.online/db_api/crud/"

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
    """
    Create a new collection in the DataCube database.

    :param api_key: The API key for authentication.
    :param db_name: The name of the database.
    :param collection_name: The name of the new collection.
    :return: The response text from the server.
    """
    url = "https://datacube.uxlivinglab.online/db_api/add_collection/"

    payload = {
        "api_key": api_key,
        "db_name": db_name,
        "coll_names": collection_name,
        "num_collections": 1
    }

    response = requests.post(url, json=payload)
    return response.text


def datacube_collection_retrieval(api_key, db_name):
    """
    Retrieve a list of collections in the DataCube database.

    :param api_key: The API key for authentication.
    :param db_name: The name of the database.
    :return: The response text from the server.
    """
    url = "https://datacube.uxlivinglab.online/db_api/collections/"
    payload = {
        "api_key": api_key,
        "db_name": db_name,
        "payment": False
    }
    response = requests.get(url, json=payload)
    return response.text


def datacube_data_delete(api_key, db_name, collection_name, query):
    """
    Delete data from a collection in the DataCube database.

    :param api_key: The API key for authentication.
    :param db_name: The name of the database.
    :param collection_name: The name of the collection.
    :param query: The query to select the documents to delete.
    :return: The response text from the server.
    """
    url = "https://datacube.uxlivinglab.online/db_api/crud/"
    payload = {
        "api_key": api_key,
        "db_name": db_name,
        "coll_name": collection_name,
        "operation": "delete",
        "query": query
    }
    response = requests.delete(url, json=payload)
    return response.text
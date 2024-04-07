import json
from itertools import chain

import requests
from django.http import HttpRequest
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ScaleSerializer, ScaleResponseSerializer
from nps.dowellconnection import dowellconnection
from api.views import nps_response_view_submit
from dowellnps_scale_function.settings import public_url
from api.utils import dowell_time
from nps.eventID import get_event_id


def datacude_db(api_key, operation,payload=None, update_data=None, id=None):
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
            data["limit"] = 1
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


def datacude_db_response(api_key, operation, scale_id=None, payload=None):
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
            data["filters"] = {"scale_id": scale_id}
            data["limit"] = 1
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


class ScaleCreateAPIView(APIView):
    def db_operations(self, command, payload=None):
        if payload is not None:
            print(payload)
            print(type(command))
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093",
                                             "ABCDE", command, payload, "nil")
            return response_data

    def generate_urls(self, payload, id):
        urls_dict = {}
        workspace_id = payload['workspace_id']
        username = payload['username']
        scale_range = payload['scale_range']
        for i in scale_range:
            main_url = f"Button {i} link:"
            instances = [
                f"{public_url}/addons/create-response/?workspace_id={workspace_id}&api_key={payload['api_key']}&username={username}&scale_id={id}&item={i}"]
            # instances = [f"http://127.0.0.1:8000/addons/create-response/?workspace_id={workspace_id}&username={username}&scale_id={id}&item={i}" ]
            urls_dict[main_url] = instances
        return urls_dict

    def adjust_scale_range(self, payload):
        print("Inside adjust_scale_range function")
        scale_type = payload['scale_type']
        total_no_of_items = int(payload['total_no_of_items'])
        if "pointers" in payload:
            pointers = payload['pointers']
        if "axis_limit" in payload:
            axis_limit = payload['axis_limit']
        print(f"Scale type: {scale_type}, Total number of items: {total_no_of_items}")

        if scale_type == 'nps':
            scale_range = range(0, 11)
            print(scale_range)
            return scale_range

        elif scale_type == 'nps lite':
            return range(0, 3)
        elif scale_type == 'stapel':
            if 'axis_limit' in payload:
                pointers = int(payload['axis_limit'])
                return chain(range(-axis_limit, 0), range(1, axis_limit + 1))
        elif scale_type == 'likert':
            if 'pointers' in payload:
                pointers = int(payload['pointers'])
                return range(1, pointers + 1)
            else:
                raise ValueError("Number of pointers not specified for Likert scale")
        else:
            raise ValueError("Unsupported scale type")

    def scale_type(self, scale_type, payload):
        if scale_type == "nps":
            no_of_items = 11
        elif scale_type == "nps lite":
            no_of_items = 3
        elif scale_type == "likert":
            pointers = payload['pointers']
            no_of_items = pointers
        elif scale_type == "stapel":
            axis_limit = payload["axis_limit"]
            no_of_items = 2 * axis_limit
            print(no_of_items)
        else:
            no_of_items = 11
        return no_of_items

    # CREATE URLS API VIEW
    def post(self, request, format=None):
        serializer = ScaleSerializer(data=request.data)
        if serializer.is_valid():
            api_key = serializer.validated_data['api_key']
            workspace_id = serializer.validated_data['workspace_id']
            username = serializer.validated_data['username']
            scale_name = serializer.validated_data['scale_name']
            scale_type = serializer.validated_data['scale_type']

            payload = {"scale_type": scale_type}

            if scale_type == "likert":
                try:
                    request.data['pointers']
                    pointers = serializer.validated_data['pointers']
                    payload['pointers'] = pointers
                except Exception as e:
                    print(e)
                    return Response(f"missing field for likert {e}", status=status.HTTP_400_BAD_REQUEST)

            if scale_type == "stapel":
                try:
                    request.data['axis_limit']
                    axis_limit = serializer.validated_data['axis_limit']
                    payload['axis_limit'] = axis_limit
                    print(payload)
                except Exception as e:
                    print(e)
                    return Response(f"missing field for stapel {e}", status=status.HTTP_400_BAD_REQUEST)

            no_of_instances = serializer.validated_data['no_of_instances']

            total_no_of_items = self.scale_type(scale_type, payload)
            payload["total_no_of_items"] = total_no_of_items
            print(payload['scale_type'])
            scale_range = self.adjust_scale_range(payload)
            print(scale_range)
            event_id = get_event_id()

            payload = {"settings": {
                "api_key": api_key,
                "scale_name": scale_name,
                "total_no_of_items": total_no_of_items,
                "scale_category": scale_type,
                "no_of_scales": no_of_instances,
                "allow_resp": True,
                "workspace_id": workspace_id,
                "username": username,
                "event_id": event_id,
                "scale_range": list(scale_range),
                "pointers": pointers if scale_type == "likert" else ""
            }
            }
            # save data to db
            try:
                # response = self.db_operations(command="insert", payload=payload)
                response = datacude_db(payload=payload, api_key=api_key, operation="insert",)
                scale_id = response['data'].get("inserted_id")
                # generate the button urls
                urls = self.generate_urls(payload['settings'], scale_id)
                # insert urls into the db
                datacude_db(payload=payload, api_key=api_key, operation="update", id=scale_id, update_data={"urls": urls})
                response_data = {
                    "api_key": api_key,
                    "workspace_id": workspace_id,
                    "username": username,
                    "scale_name": scale_name,
                    "scale_category": scale_type,
                    "total_no_of_buttons": total_no_of_items,
                    "no_of_instances": no_of_instances,
                    "scale_id": scale_id,
                    "urls": urls
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(e)
                return Response({"message": "Unexpected Error Occurred!", "error": e},
                                status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        try:
            id = request.query_params.get('scale_id')
            api_key = request.query_params.get('api_key')
            if not id or not api_key:
                return Response(f"Error: api_key or scale_id missing!", status=status.HTTP_400_BAD_REQUEST)
            # Query the database to retrieve data based on the provided ID
            response_data = datacude_db(api_key=api_key, operation="fetch", id=id)
            response = response_data['data'][0]
            settings = response["settings"]
            if response:
                # Extract the relevant information from the response
                scale_name = settings.get('scale_name')
                scale_type = settings.get('scale_category')
                scale_type = settings.get('scale_category')
                total_no_of_items = settings.get('total_no_of_items')
                no_of_instances = settings.get('no_of_scales')
                no_of_instances = settings.get('no_of_scales')
                urls = response.get('urls')

                api_response_data = {
                    "scale_id": id,
                    "scale_name": scale_name,
                    "scale_type": scale_type,
                    "total_no_of_buttons": total_no_of_items,
                    "no_of_instances": no_of_instances,
                    "urls": urls
                }

                return Response(
                    {"success": True, "message": "settings fetched successfully", "settings": api_response_data},
                    status=status.HTTP_200_OK)
            else:
                return Response("Scale not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response(f"Error: {e}", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'GET', 'PUT'])
def error_response(request, message, status):
    return Response(message, status=status)


@api_view(['GET'])
def post_scale_response(request):
    scale_id = request.GET.get('scale_id')
    api_key = request.GET.get('api_key')
    item = int(request.GET.get('item'))
    workspace_id = request.GET.get('workspace_id')
    username = request.GET.get('username')

    if request.method == "GET":
        try:
            existing_data = {}
            existing_data['workspace_id'] = workspace_id
            existing_data['username'] = username
            existing_data['scale_id'] = scale_id
            existing_data['score'] = item
            existing_data['item_no'] = item
            existing_data["username"] = f"{scale_id}_{item}"
            existing_data["scale_type"] = "nps scale"
            settings_meta_data = datacude_db(api_key=api_key, operation="fetch", id=scale_id)
            print("Tombotaller", settings_meta_data)
            data = settings_meta_data['data'][0]['settings']
            no_of_instances = data["no_of_scales"]
            no_of_items = data["total_no_of_items"]
            #Fetch data from response collection
            response_data = datacude_db_response(api_key=api_key, scale_id=scale_id,operation="fetch")
            if not response_data['data']:
                current_instance_id = 1
            else:
                previous_instance_id = len(response_data['data'])
                print("previous_instance_id:", previous_instance_id)
                current_instance_id = previous_instance_id + 1

            if int(current_instance_id) <= no_of_instances:
                event_id = get_event_id()
                created_time = dowell_time("Asia/Calcutta")
                existing_data['event_id'] = event_id
                existing_data['dowell_time'] = created_time
                existing_data['instance_id'] = current_instance_id
                print(existing_data)
                responses = datacude_db_response(api_key=api_key, payload=existing_data, operation="insert")
                response_id = responses['data']['inserted_id']
                print(response_id)
                # Insert data from response collection
                response_data = datacude_db_response(api_key=api_key, scale_id=scale_id, operation="fetch")
                print("Ambrse", response_data)
                return Response({
                    "success": responses['success'],
                    "message": "Response recorded successfully",
                    "response_id": response_id,
                    "score": int(item),
                    "instance_id": current_instance_id
                })
            else:
                return Response({"success": False,
                                 "message": "All instances for this scale have been consumed. Create a new scale to continue"},
                                status=status.HTTP_200_OK)

        except Exception as e:
            print("response", e)
            return Response({"Unexpected error occurred!": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response("Method not allowed")

import json
from django.http import HttpRequest
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ScaleSerializer, ScaleResponseSerializer
from nps.dowellconnection import dowellconnection
from nps.eventID import get_event_id
from api.views import nps_response_view_submit
from dowellnps_scale_function.settings import public_url
from .dowellclock import dowell_time

class ScaleCreateAPIView(APIView):
    def db_operations(self, command, payload=None):
        if payload is not None:
            print(payload)
            print(type(command))
            response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", command, payload, "nil")
            return response_data

    def generate_urls(self,payload, id):
        urls_dict = {}
        print(payload)
        workspace_id = payload['workspace_id']
        print(workspace_id)
        username = payload['username']
        scale_range = payload['scale_range']
        print("generate_urls",scale_range)
        for i in scale_range:
            main_url = f"Button {i} link:"
            instances = [f"{public_url}/addons/create-response/?workspace_id={workspace_id}&username={username}&scale_id={id}&item={i}" ]
            # instances = [f"http://127.0.0.1:8000/addons/create-response/?workspace_id={workspace_id}&username={username}&scale_id={id}&item={i}" ]
            urls_dict[main_url] = instances
        return urls_dict

    def adjust_scale_range(self,payload):
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
                return range(-(axis_limit),axis_limit)
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
            no_of_items == 2*axis_limit
            print(no_of_items)
        else:
            no_of_items = 11
        return no_of_items

    # CREATE URLS API VIEW
    def post(self, request, format=None):
        serializer = ScaleSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            api_key = serializer.validated_data['api_key']
            workspace_id = serializer.validated_data['workspace_id']
            username = serializer.validated_data['username']
            scale_name = serializer.validated_data['scale_name']
            scale_type = serializer.validated_data['scale_type']
            
            payload={"scale_type":scale_type}
           
            if scale_type == "likert":
                try:
                    request.data['pointers']
                    pointers = serializer.validated_data['pointers']
                    payload['pointers']=pointers
                except Exception as e:
                    print(e)
                    return Response(f"missing field for likert {e}", status=status.HTTP_400_BAD_REQUEST)
                
            
            if scale_type == "stapel":
                try:
                    request.data['axis_limit']
                    axis_limit = serializer.validated_data['axis_limit']
                    payload['axis_limit']=axis_limit
                    print(payload)
                except Exception as e:
                    print(e)
                    return Response(f"missing field for stapel {e}", status=status.HTTP_400_BAD_REQUEST)
            
            no_of_instances = serializer.validated_data['no_of_instances']

            total_no_of_items = self.scale_type(scale_type, payload)
            payload["total_no_of_items"] = total_no_of_items

            
            print(payload['scale_type'])
            scale_range = self.adjust_scale_range(payload)
            event_id = get_event_id()
            
            payload = {"settings":{
                                    "api_key":api_key,
                                    "scale_name": scale_name, 
                                    "total_no_of_items": total_no_of_items, 
                                    "scale_category": scale_type,
                                    "no_of_scales": no_of_instances,
                                    "allow_resp":True, 
                                    "workspace_id":workspace_id,
                                    "username":username,
                                    "event_id":event_id,
                                    "scale_range":list(scale_range),
                                    "pointers":pointers if scale_type == "likert" else ""
                                    }
                     }
             

            # save data to db
            try:
                response = self.db_operations(command="insert", payload=payload)
                response = json.loads(response)
                scale_id = response['inserted_id']
              
                # generate the button urls   
                urls = self.generate_urls(payload['settings'],scale_id)
                
                # insert urls into the db
                dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE", "update", {"_id":scale_id}, {"urls":urls})
                
                response_data = {
                    "api_key":api_key,
                    "workspace_id":workspace_id,
                    "username":username,
                    "scale_name": scale_name,
                    "scale_category": "nps scale",
                    "total_no_of_buttons": total_no_of_items,
                    "no_of_instances": no_of_instances,
                    "scale_id": scale_id,
                    "urls": urls
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(e)
                return Response({"message":"Unexpected Error Occurred!","error":e}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,format=None):
       
        id = request.query_params.get('id')
    
        try:
            # Query the database to retrieve data based on the provided ID
            response_data = self.db_operations(command="find", payload={"_id": id})
            response = json.loads(response_data)['data']
            if response:
                # Extract the relevant information from the response
                scale_name = response.get('scale_name')
                scale_type = response.get('scale_category')
                scale_type = response.get('scale_category')
                total_no_of_items = response.get('total_no_of_items')
                no_of_instances = response.get('no_of_scales')
                no_of_instances = response.get('no_of_scales')
                urls = response.get('urls')

                api_response_data = {
                    "scale_id": id,
                    "scale_name": scale_name,
                    "scale_type": scale_type,
                    "total_no_of_buttons": total_no_of_items,
                    "no_of_instances": no_of_instances,
                    "urls": urls
                }

                return Response({"success":True, "message":"settings fetched successfully","settings":api_response_data}, status=status.HTTP_200_OK)
            else:
                return Response("Scale not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response("Unexpected Error Occurred!", status=status.HTTP_503_SERVICE_UNAVAILABLE)
    


@api_view(['POST', 'GET', 'PUT'])
def error_response(request, message, status):
    return Response(message, status=status)

@api_view(['GET'])
def post_scale_response(request):
    scale_id = request.GET.get('scale_id')
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

            settings_meta_data = json.loads(dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale","1093",
                                                     "ABCDE", "fetch", {"_id":scale_id}, "nil"))
            data = settings_meta_data['data'][0]['settings']
            no_of_instances = data["no_of_scales"]
            no_of_items = data["total_no_of_items"]

            response_data = json.loads(dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports","1094",
                                                        "ABCDE", "fetch", {"scale_id":scale_id}, "nil"))
            if not response_data['data']:
                current_instance_id = 1
            else:
                previous_instance_id = len(response_data['data'])
                print("previous_instance_id:",previous_instance_id)
                current_instance_id = previous_instance_id+1

            if int(current_instance_id) <= no_of_instances:
                event_id = get_event_id()
                created_time = dowell_time("Asia/Calcutta")
                existing_data['event_id'] = event_id
                existing_data['dowell_time'] = created_time
                existing_data['instance_id'] = current_instance_id
                print(existing_data)
                responses = json.loads(dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports","1094",
                                                        "ABCDE", "insert", existing_data, "nil"))
                response_id = responses['inserted_id']
                print(response_id)

                return Response({
                                "success":responses['isSuccess'],
                                "message":"Response recorded successfully",
                                "response_id":responses['inserted_id'],
                                "score":int(item),
                                "instance_id":current_instance_id
                                })
            else:
                return Response({"success":False, "message":"All instances for this scale have been consumed. Create a new scale to continue"},status=status.HTTP_200_OK)

        except Exception as e:
            print("response", e)
            return Response({"Unexpected error occurred!": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response("Method not allowed")
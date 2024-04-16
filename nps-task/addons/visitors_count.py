from rest_framework.decorators import APIView
from rest_framework import status
from rest_framework.response import Response
from .datacube import datacube_data_insertion, datacube_data_retrieval, api_key
from .dowellclock import dowell_time
from nps.eventID import get_event_id
import json

class CreateNPSLiteScale(APIView):    
    def post(self, request):
        try:
            request_data = request.data
            workspace_id = request_data['workspace_id']
            username = request_data['username']
            scale_name = request_data['scale_name']
            event_id = get_event_id()
            date_created = dowell_time("Asia/Calcutta")
          
            payload = {"settings": {
                "workspace_id":workspace_id,
                "username":username,
                "scale_type":"npslite scale",
                "scale_name": scale_name,
                "no_of_instances":100000000,
                "event_id":event_id,
                "date_created":date_created["current_time"]
                }
            }
            response = json.loads(datacube_data_insertion(api_key=api_key,database_name="livinglab_scales",collection_name="collection_3",data=payload))
    
            scale_id = response['data'].get("inserted_id")
            
            return Response({
                             "success":True, 
                             "message":"Scale created successfully",
                             "scale_id":scale_id,
                             "settings":payload["settings"]
                             },status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Exception: {e}")
            return Response({
                             "success":False, 
                             "message":"Could not process you request. Contact the admin."
                             },status=status.HTTP_400_BAD_REQUEST)

class VisitorsCountAPI(APIView):
    def insert_response(self, scale_id):
        date_created = dowell_time("Asia/Calcutta")
        # response_data = json.loads(datacube_data_retrieval(api_key=api_key, database_name="livinglab_scale_response", collection_name="collection_1", data={"scale_id":scale_id}, limit=10000, offset=0, payment=False))
        
        # instance_id = len(response_data['data']) + 1 if response_data['data'] else 1
        response = {
            "scale_id":scale_id,
            # "instance_id":instance_id,
            "score":1,
            "category":"Promoter",
            "label":"Yes",
            "date_created":date_created["current_time"]
        }
        responses = json.loads(datacube_data_insertion(api_key=api_key,database_name="livinglab_scale_response",collection_name="collection_1",data=response))
        print(responses)
        return (responses)
    
    def get(self, request):
        try:
            scale_id = request.GET.get("scale_id")
            print(request.headers)
            self.insert_response(scale_id)
            data = {"scale_id":scale_id}
        
            responses = json.loads(datacube_data_retrieval(api_key=api_key, database_name="livinglab_scale_response", collection_name="collection_1", data=data, limit=10000, offset=0, payment=False))
            if not responses["data"]:
                return Response({
                                    "success":False,
                                    "message": "Requested Data was not Found. Contact the admin"
                                },status=status.HTTP_404_NOT_FOUND)
            
            current_time = dowell_time("Asia/Calcutta")
            visitor_count = len(responses['data'])
            # user_ip = request.META.get('REMOTE_ADDR', None)
            # if user_ip:
            #     ip_address = user_ip
            # else:
            #     ip_address = "Could not retrieve IP address"
            # print(user_ip)

            return Response({
                                "success":True, 
                                "visitor_count":visitor_count, 
                                "current_time":current_time["current_time"],
                                "ip_address":request.headers
                            },status=status.HTTP_200_OK)
       
        except Exception as e:
            print(f"Exception: {e}")
            return Response({
                             "success":False, 
                             "message":"Could not process you request. Contact the admin."
                             },status=status.HTTP_400_BAD_REQUEST)






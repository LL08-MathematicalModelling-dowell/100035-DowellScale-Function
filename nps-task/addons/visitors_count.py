from rest_framework.decorators import APIView
from rest_framework import status
from rest_framework.response import Response
from .datacube import datacube_data_insertion, datacube_data_retrieval, datacube_data_update, api_key
from .dowellclock import dowell_time
from nps.eventID import get_event_id
import json

class CreateCounterScale(APIView):
   
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
                "scale_type":"counter scale",
                "scale_name": scale_name,
                "event_id":event_id,
                "date_created":date_created["current_time"]
                }
            }
            
            response = json.loads(datacube_data_insertion(api_key=api_key,database_name="livinglab_scales",collection_name="collection_3",data=payload))
            scale_id = response['data'].get("inserted_id")

            # scale_url = f"https://100035.pythonanywhere.com/addons/visitors-count/?scale_id={scale_id}"
            scale_url = f"http://127.0.0.1:8000/addons/visitors-count/?scale_id={scale_id}"
            datacube_data_update(api_key, db_name="livinglab_scales", coll_name="collection_3", query={"_id":scale_id}, update_data={"scale_url":scale_url})
             
            
            
            return Response({
                             "success":True, 
                             "message":"Scale created successfully",
                             "scale_id":scale_id,
                             "scale_url":scale_url,
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
        
        response_data = json.loads(datacube_data_retrieval(api_key=api_key, database_name="livinglab_scale_response", collection_name="collection_1", data={"scale_id":scale_id}, limit=10000, offset=0, payment=False))
        counter_value = len(response_data['data']) + 1 if response_data['data'] else 1
        
        response_data = {
            "scale_id":scale_id,
            "counter_value":counter_value,
            "date_created":date_created["current_time"]
        }
        
        responses = json.loads(datacube_data_insertion(api_key=api_key,database_name="livinglab_scale_response",collection_name="collection_1",data=response_data))
        print(responses)
        return (response_data)
    
    def get(self, request):
        try:
            scale_id = request.GET.get("scale_id")
            inserted_response_data = self.insert_response(scale_id)
            
            current_time = dowell_time("Asia/Calcutta")
            visitor_count = inserted_response_data['counter_value']

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






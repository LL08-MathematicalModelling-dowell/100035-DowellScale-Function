from rest_framework.decorators import APIView
from rest_framework import status
from rest_framework.response import Response
from .db_operations import datacube_db, datacube_db_response, api_key
from .datacube import datacube_data_insertion, datacube_data_retrieval, api_key
import json

class CreateNPSLiteScale(APIView):    
    def post(self, request):
        try:
            request_data = request.data
            workspace_id = request_data['workspace_id']
            username = request_data['username']
          
            payload = {"settings": {
                "workspace_id":workspace_id,
                "username":username,
                "scale_type":"npslite scale",
                "no_of_instances":1000000
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
            print("error:", e)

class VisitorsCountAPI(APIView):
    def insert_response(self, scale_id):
        for i in range(0,100000):
            instance_id = i
            response = {
                "scale_id":scale_id,
                "instance_id":instance_id,
                "score":1,
                "category":"Promoter",
                "label":"Yes"
            }
        responses = json.loads(datacube_data_insertion(api_key=api_key,database_name="livinglab_scale_response",collection_name="collection_1",data=response))
        print(responses)
        return (responses)
    
    def get(self, request):
        scale_id = request.GET.get("scale_id")
        self.insert_response(scale_id)
        data = {"scale_id":scale_id}
    
        responses = json.loads(datacube_data_retrieval(api_key=api_key, database_name="livinglab_scale_response", collection_name="collection_1", data=data, limit=10000, offset=0, payment=False))
        visitor_count = len(responses['data'])

        return Response({"visitor_count":visitor_count})






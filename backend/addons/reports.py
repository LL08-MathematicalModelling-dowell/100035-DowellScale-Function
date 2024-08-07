from rest_framework.decorators import APIView
import requests
from rest_framework import status
from rest_framework.response import Response
import json
from .db_operations import datacube_db, datacube_db_response, api_key
from ._serializers import ReportsSerializer
from .utils import targeted_population
# from EvaluationModule import stattricks, normality
from EvaluationModule.stattricks import stattricks_api
import random

class ScaleWiseReport(APIView):
    def get(self, request):
        try:
            scale_id = request.GET.get('scale_id')

            # fetch response data from db
            response_data = datacube_db_response(api_key=api_key,operation="fetch", scale_id=scale_id)
            print(response_data)
            if not response_data['data']:
                return Response("No responses found for the scale")
            else:
                data = response_data['data']
                score_list = [ res['score'] for res in data ]
                scores = {"list_1":score_list}
                
                # stattricks_result = stattricks_api(title="ScaleReportsModule", process_id=scale_id, process_sequence_id=1, series=1, seriesvalues=scores)
                
                try:
                    process_id = random.randint(1, 100000)
                    stattricks_results = stattricks_api(title="ScaleReportsModule", process_id=1, process_sequence_id=1, series=1, seriesvalues=scores)
                    print(stattricks_results)
                    if stattricks_results["msg"]=="Successfully generated the results":
                        results = stattricks_results
                        
                        return Response({
                                    "success":True, 
                                    "data":score_list, 
                                    "central tendencies":{
                                                            "poisson_distribution_case": results["poison case results"],
                                                            "normal distribution_case" : results["normal case results"]
                                    }
                            })
                    else:
                        return Response("Failed to generate central tendency results")
                
                except json.JSONDecodeError as e:
                    print("Error decoding JSON:", e)
                # normality = 


                
        except Exception as e:
            print(e)
            return Response("Unexpected error occured. Contact admin support.")

class reports(APIView):
    def get(self, request):
        period = request.GET.get('period')
        scale_id = request.GET.get('scale_id')

        data = targeted_population(period, api_key)
        print(data)
        return Response(data)
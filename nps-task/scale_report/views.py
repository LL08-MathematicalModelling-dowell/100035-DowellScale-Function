import json

from django.shortcuts import render

from concurrent.futures import ThreadPoolExecutor


from EvaluationModule.views import categorize_scale_generate_scale_specific_report , stattricks_api 
from EvaluationModule.normality import Normality_api
from EvaluationModule.calculate_function import dowellconnection , generate_random_number

from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

# Create your views here.



@api_view(["GET" ,])
def scalewise_report(request , scale_id):
    """
    The view function that returns statiscal reports about a particular scale

    User provides the scale_id as a path parameter. The same scale_id is used as process id for the normality
    API. 
    """
    process_id = scale_id

    allowed_scale_types = ["nps scale"]

    reports = {}        
        
    field_add = {"scale_data.scale_id": scale_id}
    random_number = generate_random_number()

    try:
        with ThreadPoolExecutor() as executor:
            data_future = executor.submit(
                dowellconnection,
                "dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                        "1094", "ABCDE", "fetch", field_add, "nil"
            )
            
            normal_api_executor = executor.submit(Normality_api , process_id
                                            )

            result= json.loads(data_future.result())    
            
            normality = normal_api_executor.result()

    except:
        return Response({"isSuccess" : True , "message" : "Error fetching fetching scores"} , status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    try:     
        
        normality_result = normality
        
    except Exception as error:
        pass

    try:
        all_scores = []


        if not result["data"]:
            return Response({"isSuccess" : True , "message" : "Cannot generate a report for a scale with no responses"} , status = status.HTTP_400_BAD_REQUEST)

        scale_data = result["data"][0].get("scale_data", None)

        if not scale_data:
            return Response({"isSuccess" : True , "message" : "No scale data found"} , status = status.HTTP_400_BAD_REQUEST)
        
        if not scale_data.get("scale_type" , None):
            return Response({"isSuccess" : True , "message" : "No scale_type found"} , status = status.HTTP_400_BAD_REQUEST)
        

        scale_type = scale_data.get("scale_type")

        if scale_type not in allowed_scale_types:
            return  Response({"isSuccess" : True , "message" : "Can only generate report for nps scale only"} , status = status.HTTP_400_BAD_REQUEST)

            
        for x in result["data"]: 
            score = x.get("score", None)
            if not score:
                continue

            score = score.get("score") if isinstance(x.get("score") , dict) else x["score"][0].get('score')

            if not score:
                continue

            all_scores.append(int(score))

        if len(all_scores) < 3:
            return Response({"isSuccess" : True , "message" : "Cannot generate a report for a scale with less than 3 responses"} , status = status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"isSuccess" : False , "reports" : str(e)} , status = status.HTTP_400_BAD_REQUEST)

    try:
        reports["cateogroise scale type"] = categorize_scale_generate_scale_specific_report(scale_type , all_scores)

    except:
        pass
        
    with ThreadPoolExecutor() as executor:
        response_json_future = executor.submit(stattricks_api, "evaluation_module", random_number, 16, 3,
                                               {"list1": all_scores})
        statricks_api_response_json = response_json_future.result()
        
        
    poison_case_results = statricks_api_response_json.get("poison case results", {})
    normal_case_results = statricks_api_response_json.get("normal case results", {})
    
    reports["poisson_case_results"] = poison_case_results 
    reports["normal_case_results"]= normal_case_results
        
    return Response({"report" : reports} , status=status.HTTP_200_OK)
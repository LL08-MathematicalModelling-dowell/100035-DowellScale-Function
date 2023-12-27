import json


from concurrent.futures import ThreadPoolExecutor


from EvaluationModule.views import categorize_scale_generate_scale_specific_report , stattricks_api 
from EvaluationModule.normality import Normality_api
from EvaluationModule.calculate_function import dowellconnection , generate_random_number

from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response


from .utils import get_all_scores , likert_scale_report , convert_all_likert_label

# Create your views here.



@api_view(["GET" ,])
def scalewise_report(request , scale_id):
    """
    The view function that returns statiscal reports about a particular scale

    User provides the scale_id as a path parameter. The same scale_id is used as process id for the normality
    API. 
    """
    process_id = scale_id

    allowed_scale_types = ["nps scale" , "stapel scale" , "likert scale"]

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

    except Exception as e:
        return Response({"isSuccess" : True , "message" : "Error fetching fetching scores"} , status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        


        # All targeted poopulation implementation


        # Getting the scores to an higher level score

    print("adfafda" , result)

    if not result["data"]:
        return Response({"isSuccess" : True , "message" : "Cannot generate a report for a scale with no responses"} , status = status.HTTP_400_BAD_REQUEST)

    scale_data = result["data"][0].get("scale_data", None)

    if not scale_data:
        return Response({"isSuccess" : True , "message" : "No scale data found"} , status = status.HTTP_400_BAD_REQUEST)
        
    if not scale_data.get("scale_type" , None):
        return Response({"isSuccess" : True , "message" : "No scale_type found"} , status = status.HTTP_400_BAD_REQUEST)
        

    scale_type = scale_data.get("scale_type")

    if scale_type not in allowed_scale_types:
        return  Response({"isSuccess" : True , "message" : f"Can only generate report for {scale_type}  only"} , status = status.HTTP_400_BAD_REQUEST)

    all_scores = get_all_scores(result , score_type= "text" if scale_type == "likert scale" else "int")

    if len(all_scores) < 3:
        return Response({"isSuccess" : True , "message" : "Cannot generate a report for a scale with less than 3 responses"} , status = status.HTTP_400_BAD_REQUEST)

    



    try:
        if scale_type == "likert scale":
            likert_scale = dowellconnection(
                "dowellscale", "bangalore", "dowellscale", "scale", "scale",
                                        "1093", "ABCDE", "fetch", {"_id" : scale_id}, "nil"
            )


            likert_scale = json.loads(likert_scale)

            label_selection= likert_scale["data"][0]["settings"].get("label_selection") or likert_scale["data"][0]["settings"].get("label_scale_selection")

            reports["categorise scale type"] = likert_scale_report(label_selection , all_scores)

            all_scores = convert_all_likert_label(label_selection , all_scores)

        else:

            reports["categorise scale type"] = categorize_scale_generate_scale_specific_report(scale_type , all_scores)

    except Exception as e:
        return Response({"is_error" : True , "error" : f"categorize_scale stage: {str(e)} "})
        
    with ThreadPoolExecutor() as executor:
        response_json_future = executor.submit(stattricks_api, "evaluation_module", random_number, 16, 3,
                                               {"list1": all_scores})
        statricks_api_response_json = response_json_future.result()
        
        
    poison_case_results = statricks_api_response_json.get("poison case results", {})
    normal_case_results = statricks_api_response_json.get("normal case results", {})
    
    reports["poisson_case_results"] = poison_case_results 
    reports["normal_case_results"]= normal_case_results
        
    return Response({"report" : reports} , status=status.HTTP_200_OK)
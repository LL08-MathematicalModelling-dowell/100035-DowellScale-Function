from datetime import datetime

from django.http import JsonResponse
from django.shortcuts import render
from django.core.cache import cache

from api.views import find_category
from .calculate_function import *
from .normality import *
from concurrent.futures import ThreadPoolExecutor
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

"""
This module takes random number, attaches it to the product name and doc_no and first saves that data with 
Evaluation API with process id as the process id is the random number. It then uses the same random number to
process the Normality API and get the responses of both the APIs, and finally renders the data to the template.
"""


def evaluation_editor(request, product_name, doc_no):
    random_number = generate_random_number()
    print(f"\n\nrandom_number: {random_number}\n\n")
    context = {}

    # Fetch data from cache if available
    cache_key = f"evaluation_editor_{product_name}_{doc_no}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return render(request, 'EvaluationModule/editor_reports.html', cached_data)

    field_add = {"brand_data.product_name": product_name}

    # Execute dowellconnection API call using ThreadPoolExecutor
    with ThreadPoolExecutor() as executor:
        data_future = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale_reports",
                                      "scale_reports",
                                      "1094", "ABCDE", "fetch", field_add, "nil")
        data = json.loads(data_future.result())["data"]

    all_scales = [x for x in data if x['score'][0]['instance_id'].split("/")[0] == doc_no]
    calculate_score = [x['score'][0]['score'] for x in all_scales if x["scale_data"]["scale_type"] == "nps scale"]
    # print(f"\n\ndata: {calculate_score}\n\n")
    # print(f"\n\nall_scales: {all_scales}\n\n")

    if len(data) != 0:
        scores = process_data(data, doc_no)
        nps_scales = len(scores["nps scale"])
        nps_score = sum(scores["nps scale"])
        stapel_scales = len(scores["stapel scale"])
        stapel_score = scores["stapel scale"]

        context.update({
            "nps_scales": nps_scales,
            "nps_score": nps_score,
            "nps_total_score": nps_scales * 10,
            "stapel_scales": stapel_scales,
            "stapel_scores": stapel_score,
            "score_series": scores["nps scale"]
        })

    # Execute stattricks_api API call using ThreadPoolExecutor
    with ThreadPoolExecutor() as executor:
        response_json_future = executor.submit(stattricks_api, "evaluation_module", random_number, 16, 3,
                                               {"list1": calculate_score})
        response_json = response_json_future.result()
        context.update(response_json)

    poison_case_results = response_json.get("poison case results", {})
    normal_case_results = response_json.get("normal case results", {})
    context.update({
        "poison_case_results": poison_case_results,
        "normal_case_results": normal_case_results
    })

    # Execute Normality_api API call using ThreadPoolExecutor
    with ThreadPoolExecutor() as executor:
        normality_future = executor.submit(Normality_api, random_number)
        normality = normality_future.result()
        context.update(normality)

    normality_data = normality.get('list1') if normality else None
    context.update({
        "n_title": normality.get('title'),
        "n_process_id": normality.get('process_id'),
        "n_bins": normality.get('bins'),
        "n_allowed_error": normality.get('allowed_error'),
        "n_series_count": normality.get('series_count'),
        "n_list1": normality_data
    })

    # Cache the data for future requests
    cache.set(cache_key, context)
    print(f"stattricks_api: {response_json}\n")
    print(f"Normality_api: {normality}")

    return render(request, 'EvaluationModule/editor_reports.html', context)


def csv_new(request, product_name, doc_no):
    data_list = []
    headers = {}

    # Fetch data from cache if available
    cache_key = f"evaluation_editor_{product_name}_{doc_no}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return render(request, 'EvaluationModule/editor_reports.html', cached_data)

    field_add = {"brand_data.product_name": product_name}

    # Execute dowellconnection API call using ThreadPoolExecutor
    with ThreadPoolExecutor() as executor:
        data_future = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale_reports",
                                    "scale_reports",
                                      "1094", "ABCDE", "fetch", field_add, "nil")
        data = json.loads(data_future.result())["data"]
        # print(f"\n\n data: {data}\n\n")

    all_scales = [x for x in data if x['score'][0]['instance_id'].split("/")[0] == doc_no]
    calculate_score = [x['score'][0]['score'] for x in all_scales if x["scale_data"]["scale_type"] == "nps scale"]
    # print(f"\n\ndata: {calculate_score}\n\n")
    # print(f"\n\nall_scales: {all_scales}\n\n")

    for item in all_scales:
        data_ = {
            "scale_id": item['scale_data']['scale_id'],
            "event_id": item['event_id'],
            "score": item['score'][0]['score'],
            "scale_type": item['scale_data']['scale_type'],
            "product_name": item['brand_data']['product_name']
        }
        if data_ not in data_list:
            data_list.append(data_)

    if len(data) != 0:
        scores = process_data(data, doc_no)
        nps_scales = len(scores["nps scale"])
        nps_score = sum(scores["nps scale"])
        stapel_scales = len(scores["stapel scale"])
        stapel_score = scores["stapel scale"]
        print(f"\n\nnps_scales: {nps_scales}\n\n")
        print(f"\nscores: {scores}")
        print(f"\n nps score: {nps_score}")

        headers = {
            "nps_scales": nps_scales,
            "nps_score": nps_score,
            "nps_total_score": nps_scales * 10,
            "stapel_scales": stapel_scales,
            "stapel_scores": stapel_score,
            "score_series": scores["nps scale"]
        }

    return render(request, 'EvaluationModule/csv_new.html', {"headers": headers, "data_list": data_list})


def by_username(request, username, scale_category):
    global now
    if scale_category == 'nps':
        scale_category = 'nps scale'
    elif scale_category == 'stapel':
        scale_category = 'stapel scale'
    elif scale_category == 'npslite':
        scale_category = 'npslite scale'
    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                    "ABCDE", "fetch", {"username": username}, "nil")
    user_dets = json.loads(user_details)
    scale_i = [entry['scale_id'] for entry in user_dets['data']]
    list_of_scales = []
    for scale_id in scale_i:
        field_add = {"_id": scale_id}

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                             "fetch", field_add, "nil")
        settings_json = json.loads(x)
        data = settings_json['data']
        if len(data) != 0:
            now = data[0]
        else:
            pass

        try:
            list_of_scales.append(now['settings']['scale'])

        except KeyError:
            try:
                list_of_scales.append(now['scale'])
            except:
                try:
                    list_of_scales.append(now['settings']['scales'])
                except:
                    pass
    print(list_of_scales)

    return render(request, 'EvaluationModule/by_username.html', {"responses": list_of_scales})


@api_view(['GET'])
def by_username_api(request, username, scale_category):


    global now

    print("scale category" , scale_category)
    if scale_category == 'nps':
        scale_category = 'nps scale'
    elif scale_category == 'stapel':
        scale_category = 'stapel scale'
    elif scale_category == 'npslite':
        scale_category = 'npslite scale'
    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                    "ABCDE", "fetch", {"username": username}, "nil")
    
    
    user_dets = json.loads(user_details)
    print("user_dets" , user_dets)
    # print(user_dets)
    scale_i = [entry['scale_id'] for entry in user_dets['data']]
    list_of_scales = []
    for scale_id in scale_i:
        field_add = {"_id": scale_id}

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                             "fetch", {"settings.user": scale_id}, "nil")
        settings_json = json.loads(x)
        print(settings_json)
        data = settings_json['data']
        if len(data) != 0:
            now = data[0]
        else:
            pass

        try:
            list_of_scales.append(now['settings']['scale'])

        except KeyError:
            try:
                list_of_scales.append(now['scale'])
            except:
                try:
                    list_of_scales.append(now['settings']['scales'])
                except:
                    pass

    return Response({"responses": list_of_scales}, status=status.HTTP_200_OK)


@api_view(['GET'])
def Target_API(request):
    # get all response from this API payload

    """
    Fetching scales reports based on date_range they were created. 
    
    """
    
    period = request.data.get("period")

    if not period:
        return Response({"isSuccess": False , "message" : "period is required"})


    database_details = {
            "database" : "dowellscale",
            "collection" : "scale_reports",
            'fields':['eventId']
        }


    time_input = {
            'column_name': 'date_created',
            'period': period,
            "time_type_in_db" : 'iso'
        }
    
    if period.lower().strip() =="custom":
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")

        if not (start_date and end_date):
            return Response({"isSuccess" : True , "error_message" : "start_date or end_date parameters not sent"} ,
                            status = status.HTTP_400_BAD_REQUEST)
        
        DATE_REGEX = r"\d{1,5}[-/]\d{1,3}[-/]\d{1,5}"

        import re
        
        if not (re.search(DATE_REGEX , start_date) and re.search(DATE_REGEX, end_date)):
            return Response({"isSuccess" : True , "error_message" : "start_date or end_date are not in date formats"} ,
                            status = status.HTTP_400_BAD_REQUEST)
        
        time_input["start_point"] = start_date
        time_input["end_point"] = end_date
        

    distribution_input={
            'normal': 1,
            
        }
    
    target_api_request = {
        "database_details" : database_details,
        "time_input" : time_input, 
        "distribution_input" : distribution_input,
    }



    payload = request.data
    user_type = {}
    if "details" in payload:
        user_type["details"] = payload.pop("details")
    print(f"payload: {payload}...")


    # Make a GET request to the original API with the payload
    response = requests.post("http://100032.pythonanywhere.com/api/targeted_population/",
                              json=target_api_request , headers={"content-type" : "application/json"})
    
   
    


    # print(f"response: {response.json()}...")
    """
    user_details = dowellconnection("dowellscale", "bangalore", "dowellscale", "users", "users", "1098",
                                    "ABCDE", "fetch", {"username": username}, "nil")
    user_dets = json.loads(user_details)
    # print(user_dets)
    scale_i = [entry['scale_id'] for entry in user_dets['data']]
    list_of_scales = []
    for scale_id in scale_i:
        field_add = {"_id": scale_id}

        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
                             "fetch", field_add, "nil")
        settings_json = json.loads(x)
        print(settings_json)
        try:
            settings = response_data['data'][0]['settings']
            date_created = settings['date_created']
            start_date = "2019/01/08"  
            end_date = "2023/01/25"  
            period = "life_time"  
            
            if period == "life_time":
                # Use date_created as the start_date and current date as the end_date
                start_date = datetime.datetime.strptime(date_created, "%Y-%m-%d %H:%M:%S")
                end_date = datetime.datetime.now()
            elif period == "last_month":
                # Use the start and end dates of the previous month
                current_date = datetime.datetime.now()
                end_date = datetime.datetime(current_date.year, current_date.month, 1) - datetime.timedelta(days=1)
                start_date = datetime.datetime(end_date.year, end_date.month, 1)
            
            # Print the date range
            print("Start Date:", start_date)
            print("End Date:", end_date)
        except:
            pass
    
    x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                         "1094", "ABCDE", "fetch")
    print(f"x: {x}...")

    if response.json()['normal']['data'][""]:
        for i in response.json()['normal']['data']:
                # print(f"j: {j}...")
                # print(f"{j['_id']}")
                field_add = {"_id":i['_id']}
                x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                     "1094", "ABCDE", "fetch", field_add, "nil")
                # print(f"x: {x}...x")
                settings_json = json.loads(x)
                # print(f" {settings_json}")
                data = settings_json['data']
                print(f"data: {data}...")
                # try:
                #     data[0][]


    else:
        print("no data")
    #
    # # Check if the request was successful
    # if response.status_code == 200:
    #     # Return the response as JSON
    #     return JsonResponse(response.json(), safe=False)

    # If the request failed, return an error response

    """
    if response.status_code != 200 and response.status_code != 500:
        return Response(response.text , status = status.HTTP_400_BAD_REQUEST)
    elif response.status_code == 500:
        return Response("Server down. Try again later" , status = status.HTTP_500_INTERNAL_SERVER_ERROR)
    return JsonResponse({"data" : response.json()["normal"]["data"]["eventId"]}, status=200)

def evaluation_editor_process_id(request, process_id, doc_no):
    random_number = f"{process_id}{generate_random_number()}"
    context = {}

    # Fetch data from cache if available
    cache_key = f"evaluation_editor_{process_id}_{doc_no}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return render(request, 'EvaluationModule/editor_reports.html', cached_data)

    field_add = {"process_id": process_id}

    # Execute dowellconnection API call using ThreadPoolExecutor
    with ThreadPoolExecutor() as executor:
        data_future = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale_reports",
                                      "scale_reports",
                                      "1094", "ABCDE", "fetch", field_add, "nil")
        data = json.loads(data_future.result())["data"]

    all_scales = [x for x in data if x['score'][0]['instance_id'].split("/")[0] == doc_no]
    calculate_score = [x['score'][0]['score'] for x in all_scales if x["scale_data"]["scale_type"] == "nps scale"]
    # print(f"\n\ndata: {calculate_score}\n\n")
    # print(f"\n\nall_scales: {all_scales}\n\n")

    if len(data) != 0:
        scores = process_data(data, doc_no)
        nps_scales = len(scores["nps scale"])
        nps_score = sum(scores["nps scale"])
        stapel_scales = len(scores["stapel scale"])
        stapel_score = scores["stapel scale"]

        context.update({
            "nps_scales": nps_scales,
            "nps_score": nps_score,
            "nps_total_score": nps_scales * 10,
            "stapel_scales": stapel_scales,
            "stapel_scores": stapel_score,
            "score_series": scores["nps scale"]
        })

    # Execute stattricks_api API call using ThreadPoolExecutor
    with ThreadPoolExecutor() as executor:
        response_json_future = executor.submit(stattricks_api, "evaluation_module", random_number, 16, 3,
                                               {"list1": calculate_score})
        response_json = response_json_future.result()
        context.update(response_json)

    poison_case_results = response_json.get("poison case results", {})
    normal_case_results = response_json.get("normal case results", {})
    context.update({
        "poison_case_results": poison_case_results,
        "normal_case_results": normal_case_results
    })

    # Execute Normality_api API call using ThreadPoolExecutor
    with ThreadPoolExecutor() as executor:
        normality_future = executor.submit(Normality_api, random_number)
        normality = normality_future.result()
        context.update(normality)

    normality_data = normality.get('list1') if normality else None
    context.update({
        "n_title": normality.get('title'),
        "n_process_id": normality.get('process_id'),
        "n_bins": normality.get('bins'),
        "n_allowed_error": normality.get('allowed_error'),
        "n_series_count": normality.get('series_count'),
        "n_list1": normality_data
    })

    # Cache the data for future requests
    cache.set(cache_key, context)
    print(f"stattricks_api: {response_json}\n")
    print(f"Normality_api: {normality}")

    return render(request, 'EvaluationModule/editor_reports.html', context)


def categorize_scale_generate_scale_specific_report(scale_type, score):
    if scale_type == "nps scale":
        score = [int(x) for x in score]
        nps_categories = [find_category(x) for x in score]
        nps_scale_data = calculate_nps_category(nps_categories)

        response_ = {
            "scale_category": scale_type,
            "no_of_scales": len(score),
            "nps_score": sum(score),
            "nps_total_score": len(score) * 10,
            "max_total_score": max(score),
            "score_list": score,
            "scale_specific_data": nps_scale_data
        }
        print("\n\n\nnps_scale_data: ", response_)
        return response_
    elif scale_type == "stapel scale":
        score = [int(x) for x in score]
        stapel_scale_data = calculate_stapel_scale_category(score)

        response_ = {
            "scale_category": scale_type,
            "no_of_scales": len(score),
            "stapel_score": sum(score),
            # "stapel_total_score": len(score) * 10,
            "max_total_score": max(score),
            "score_list": score,
            "scale_specific_data": stapel_scale_data
        }
        return response_


def fetch_scores_and_scale_type(query_params):
    print(f"\n\nquery_params: {query_params}\n\n")
    response_data_scores = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                            "scale_reports", "1094", "ABCDE", "fetch", query_params, "nil")

    print(f"\n\nresponse_data_scores: {response_data_scores}\n\n")
    print(f"\n\nresponse_data_scores: {json.loads(response_data_scores)}\n\n")
    scores = [x['score']['score'] for x in json.loads(response_data_scores)['data']]
    scale_type = json.loads(response_data_scores)['data'][0]["scale_data"]["scale_type"]
    print(f"\n\nscores: {scores}\n\nscale_type: {scale_type}\n\n")
    return scores, scale_type


def statistics(scores, process_id):
    print(f"\n\nscores: {scores}\n\nprocess_id: {process_id}..\n\n")
    try:
        stattrics = stattricks_api("evaluation_module", process_id, 16, 3, {"list1": scores})
    except Exception as e:
        print(f"\n\nException: {e}\n\n")
        stattrics = {}
    print(f"\n\nstattricsssss: {stattrics}\n\n")
    normality = Normality_api(process_id)
    print(f"\n\nnormalityyyyy: {normality}\n\n")
    return normality, stattrics

def get_scores(report_type, response_data):
    if report_type == "document":
        document_id = response_data.get("document_id")
        query_params = {"document_data.details.id": document_id, "process_id": response_data.get("process_id")}
        return fetch_scores_and_scale_type(query_params)

    elif report_type == "process":
        query_params = {"process_id": response_data.get("process_id")}
        return fetch_scores_and_scale_type(query_params)

    elif report_type == "scale":
        query_params = {
            "template_id": response_data.get("template_id"),
            f"custom_input_groupings.{response_data.get('type_of_element')}": response_data.get("element"),
            "process_id": response_data.get("process_id")
        }
        return fetch_scores_and_scale_type(query_params)


@api_view(['POST'])
def evaluation_api(request):
    try:
        print("request.data: ", request.data)
        report_type = request.GET.get('report_type', '').strip()
        valid_report_types = ["process", "document", "scale"]

        if report_type not in valid_report_types:
            return Response({"error": "Please provide a valid report type (scale/document/process)"},
                            status=status.HTTP_400_BAD_REQUEST)
        response_data = request.data
        if report_type == "process":
            process_id = response_data.get("process_id")
            if not process_id:
                return Response({"error": "Please provide a process_id in the request body for 'process' report type"},
                                status=status.HTTP_400_BAD_REQUEST)
        elif report_type == "document":
            document_id = response_data.get("document_id")
            process_id = response_data.get("process_id")
            if not document_id or not process_id:
                return Response({
                    "error": "Please provide both 'document_id' and 'process_id' in the request body for 'document' report type"},
                    status=status.HTTP_400_BAD_REQUEST)
        elif report_type == "scale":
            template_id = response_data.get("template_id")
            type_of_element = response_data.get("type_of_element")
            element = response_data.get("element")
            process_id = response_data.get("process_id")
            if not template_id or not type_of_element or not element or not process_id:
                return Response({
                    "error": "Please provide 'template_id', 'type_of_element', 'element', and 'process_id' in the request body for 'scale' report type"},
                    status=status.HTTP_400_BAD_REQUEST)

        print("\n\n\nresponse_data", response_data)
        print(report_type, "report_type")

        scores, scale_type = get_scores(report_type, response_data)

        print("\n\n\nscores", scores)
        print("\n\n\nscale_type", scale_type)

        if not scores:
            return Response({"error": "No responses found for the given data"}, status=status.HTTP_404_NOT_FOUND)
        elif len(scores) < 3:
            return Response({"error": "Not enough scores found for the given info."}, status=status.HTTP_403_FORBIDDEN)

        response_ = categorize_scale_generate_scale_specific_report(scale_type, scores)
        process_id = f'{process_id}{report_type}'
        normality, stattrics = statistics(scores, process_id)
        print("\n\n\nnormality: ", normality)
        print("\n\n\nstattrics: ", stattrics)
        response_["normality_analysis"] = normality
        response_["central_tendencies"] = stattrics
        return Response({"success": response_}, status=status.HTTP_200_OK)

    except IndexError as e:
        return Response({"error": f"No responses found for the above {report_type} wise report."},
                        status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def get_brand_product(request):
    data = request.data
    print(data, "data\n\n\n")
    product_name = data.get("product_name")
    brand_name = data.get("brand_name")

    field_add = {}

    if product_name:
        field_add["brand_data.product_name"] = product_name
    if brand_name:
        field_add["brand_data.brand_name"] = brand_name
    if not product_name and not brand_name:
        return Response({"error": "Please provide either product_name or brand_name in the request body"},
                        status=status.HTTP_400_BAD_REQUEST)
    if product_name and brand_name:
        field_add["brand_data.product_name"] = product_name
        field_add["brand_data.brand_name"] = brand_name

    # Execute the API call using ThreadPoolExecutor
    with ThreadPoolExecutor() as executor:
        data_future = executor.submit(
            dowellconnection,
            "dowellscale",
            "bangalore",
            "dowellscale",
            "scale_reports",
            "scale_reports",
            "1094",
            "ABCDE",
            "fetch",
            field_add,
            "nil"
        )

    return Response({"success": data_future.result()}, status=status.HTTP_200_OK)    
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
    
    
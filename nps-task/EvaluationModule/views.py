from django.http import JsonResponse
from django.shortcuts import render
from django.core.cache import cache
import string
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
                             "fetch", field_add, "nil")
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

    payload = request.data
    user_type = {}
    if "details" in payload:
        user_type["details"] = payload.pop("details")
    print(f"payload: {payload}...")
    # Make a GET request to the original API with the payload
    response = requests.post("http://100032.pythonanywhere.com/api/targeted_population/", json=payload)

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
    """
    x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                         "1094", "ABCDE", "fetch")
    print(f"x: {x}...")
    if response.json()['normal']['data']:
        for i in response.json()['normal']['data']:
            for j in i:
                # print(f"j: {j}...")
                # print(f"{j['_id']}")
                field_add = {"_id": j['_id']}
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
    return JsonResponse({"error": "Failed to retrieve data from the original API."}, status=500)

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


def map_binary_to_likert(yes_count, no_count, total_responses):
    # Avoid division by zero
    if total_responses == 0:
        return "Neutral"

    # Calculate the percentage of 'yes' and 'no' responses
    yes_percentage = yes_count / total_responses
    no_percentage = no_count / total_responses

    # Define thresholds for mapping
    if yes_percentage > 0.6:
        return "Strongly Disagree"
    elif yes_percentage > 0.3:
        return "Disgree"
    elif no_percentage > 0.6:
        return "Strongly Agree"
    elif no_percentage > 0.3:
        return "Agree"
    else:
        return "Neutral"

def basic_likert_score(responses):
    yes_count = responses.count('Yes')
    no_count = responses.count('No')
    print(yes_count, "yes_count")
    print(no_count, "no_count")
    total_responses = len(responses)

    # Calculate basic NPS score (not actually used for mapping but might be useful for reference)
    nps_score = (yes_count - no_count) / total_responses * 100 if total_responses > 0 else 0

    # Map to Likert scale
    print(nps_score, "nps_score")
    likert_result = map_binary_to_likert(yes_count, no_count, total_responses)
    print(likert_result, "likert_result")
    return likert_result, nps_score

def weighted_nps_score(responses, w1=0.7, w2=0.3):
    # Assigning weights based on the score
    weighted_scores = [(w1 if r == 3 else w2 if r == 1 else 0.5) for r in responses]
    promoters_weighted = sum(w for r, w in zip(responses, weighted_scores) if r == 3)
    detractors_weighted = sum(w for r, w in zip(responses, weighted_scores) if r == 1)
    total_weighted = sum(weighted_scores)
    nps_score = (promoters_weighted - detractors_weighted) / total_weighted * 100
    return nps_score

def basic_nps_score(responses):
    promoters = responses.count(3)
    detractors = responses.count(1)
    total_responses = len(responses)

    if total_responses == 0:
        return 0  # Avoid division by zero if there are no responses

    nps_score = (promoters - detractors) / total_responses * 100
    return nps_score

def categorize_nps_score(nps_score):
    if nps_score > 0:
        return "Promoter"
    elif nps_score == 0:
        return "Passive"
    else:
        return "Detractor"

def categorize_scale_generate_scale_specific_report(scale_type, score):
    if scale_type == "nps scale" or scale_type == "nps":
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
        return response_
    elif scale_type == "stapel scale" or scale_type == "stapel":
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

    elif scale_type == "likert scale" or scale_type == "likert":
        scores = [x for x in score]
        nps_scale_data = basic_likert_score(scores)

        response_ = {
            "scale_category": scale_type,
            "no_of_scales": len(score),
            "report": nps_scale_data,
        }
        return response_

    elif scale_type == "npslite scale" or scale_type == "npslite":
        scores = [x for x in score]

        basic_score = basic_nps_score(scores)
        weighted_score = weighted_nps_score(scores)

        response_ = {
            "scale_category": scale_type,
            "no_of_scales": len(score),
            "npslite_total_score": len(score) * 10,
            "score_list": score,
            "Basic NPSlite Score": basic_nps_score(scores),
            "Weighted NPSlite Score": weighted_nps_score(scores),
            "Basic NPSlite Category": categorize_nps_score(basic_score),
            "Weighted NPSlite Category": categorize_nps_score(weighted_score),
        }
        return response_


def fetch_scores_and_scale_type(query_params):
    response_data_scores = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                            "scale_reports", "1094", "ABCDE", "fetch", query_params, "nil")

    print(f"\n\nresponse_data_scores: {json.loads(response_data_scores)}\n\n")
    scores = []
    for item in json.loads(response_data_scores)['data']:
        try:
            scores.append(item['score']['score'])
        except KeyError:
            pass
        print(f"\n\nitem: {item['score']}\n\n")

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
    # try:
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

    # except IndexError as e:
    #     return Response({"error": f"No responses found for the above {report_type} wise report."},
    #                     status=status.HTTP_400_BAD_REQUEST)
    # except Exception as e:
    #     return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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


@api_view(['POST', 'GET'])
def get_scale_report(request, scale):
    field_add = {"scale_data.scale_id": scale}
    result = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports", "1094", "ABCDE",
                        "fetch", field_add, "nil")
    print(result, "result\n\n\n")
    result = json.loads(result)
    print(result['data'][0])
    print(result['data'][0]['score']['score'])
    scores = result['data'][0]['score']['score']
    response_ = {}

    # create random 9 digit process id
    process_id = result['data'][0]['process_id']

    normality, stattrics = statistics(scores, process_id)
    print("\n\n\nnormality: ", normality)
    print("\n\n\nstattrics: ", stattrics)
    response_['result'] = result
    response_["normality_analysis"] = normality
    response_["central_tendencies"] = stattrics

    return Response({"success": response_}, status=status.HTTP_200_OK)


@api_view(["GET"])
def scalewise_report(request, scale_id):
    reports = {}
    random_number = generate_random_number()

    # Update field_add based on scale_type
    field_add = {"scale_data.scale_id": scale_id}

    result = fetch_scale_data(field_add)
    if not result["success"]:
        return Response(result["response"], status=result["status"])

    scale_type = result['data'][0]["scale_data"]["scale_type"]
    scale_types = ["nps scale", "npslite scale", "stapel scale", "likert scale"]

    if scale_type not in scale_types:
        return Response(
            {"isSuccess": False, "message": "Invalid scale type"},
            status=status.HTTP_400_BAD_REQUEST)
    print(result, "result\n\n\n")
    all_scores = extract_scores(result)
    print(all_scores, "all_scores\n\n\n")
    print(len(all_scores), "all_scores\n\n\n")
    if len(all_scores) < 3:
        return Response(
            {"isSuccess": True, "message": "Cannot generate a report for a scale with less than 3 responses"},
            status=status.HTTP_400_BAD_REQUEST)

    try:
        reports["categorize_scale_type"] = categorize_scale_generate_scale_specific_report(scale_type, all_scores)
    except Exception as e:
        return Response({"isSuccess": False, "reports": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Statricks API call
    if scale_type != "likert scale" or scale_type != "likert":
        response_json = stattricks_api("evaluation_module", random_number, 16, 3, {"list1": all_scores})
        if response_json:
            reports.update({
                "Stattricks results": {
                "poisson_case_results": response_json.get("poison case results", {}),
                "normal_case_results": response_json.get("normal case results", {})
                }
            })
        normality = Normality_api(random_number)
        reports.update({"Normality results": normality['list1']})

    return Response({"report": reports}, status=status.HTTP_200_OK)


def fetch_scale_data(field_add):
    """
    Fetches scale data from the database.
    """
    try:
        response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                    "1094", "ABCDE", "fetch", field_add, "nil")
        result = json.loads(response)
        print(result, "result\n\n\n")
        if "user is not active" in result:
            return {"success": False, "response": {"isSuccess": False, "message": "User is not active"}, "status": status.HTTP_400_BAD_REQUEST}
        if not result["data"]:
            return {"success": False, "response": {"isSuccess": True, "message": "No data found"}, "status": status.HTTP_400_BAD_REQUEST}
        return {"success": True, "data": result["data"]}
    except Exception as e:
        return {"success": False, "response": {"isSuccess": False, "message": str(e)}, "status": status.HTTP_500_INTERNAL_SERVER_ERROR}

def extract_scores(data):
    """
    Extracts scores from the fetched data.
    """
    scores = []
    for entry in data['data']:
        score_info = entry.get('score', {})
        score_value = score_info.get('score')
        scores.append(score_value)
    return scores

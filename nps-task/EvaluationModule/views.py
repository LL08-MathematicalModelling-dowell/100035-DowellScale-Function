from django.http import JsonResponse
from django.shortcuts import render
from django.core.cache import cache
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
    context = {}

    # Fetch data from cache if available
    cache_key = f"evaluation_editor_{product_name}_{doc_no}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return render(request, 'EvaluationModule/editor_reports.html', cached_data)

    field_add = {"brand_data.product_name": product_name}

    # Execute dowellconnection API call using ThreadPoolExecutor
    with ThreadPoolExecutor() as executor:
        data_future = executor.submit(dowellconnection, "dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
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
        response_json_future = executor.submit(stattricks_api, "evaluation_module", random_number, 16, 3, {"list1": calculate_score})
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
        "scale_id" : item['scale_data']['scale_id'],
        "event_id" : item['event_id'],
        "score" : item['score'][0]['score'],
        "scale_type" : item['scale_data']['scale_type'],
        "product_name" : item['brand_data']['product_name']
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
    if scale_category == 'nps':
        scale_category = 'nps scale'
    elif scale_category == 'stapel':
        scale_category = 'stapel scale'
    elif scale_category == 'npslite':
        scale_category = 'npslite scale'
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


    return Response({"responses": list_of_scales},status=status.HTTP_200_OK)

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
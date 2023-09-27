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

#
# @api_view(['POST'])
# def evaluation_api(request):
#     def execute_api_call(*args):
#         with ThreadPoolExecutor() as executor:
#             response_data = executor.submit(dowellconnection, *args)
#             response_data = response_data.result()
#         return json.loads(response_data)
#
#     if request.method != 'POST':
#         return JsonResponse({"error": "Method not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
#     elif request.method == 'POST':
#         global field_add
#         report_type = request.GET.get('report_type', None)
#
#         print(f"report_type: {report_type}...")
#         if not report_type:
#             return JsonResponse({"error": "report_type parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
#
#         if report_type == 'process':
#             report_type = 'process_id'
#         elif report_type == 'document':
#             report_type = 'document_id'
#         elif report_type == 'scale':
#             report_type = 'scale_id'
#         else:
#             return JsonResponse({"error": "Invalid report_type provided."}, status=status.HTTP_400_BAD_REQUEST)
#
#         payload = request.data
#         process_id = payload.get('process_id')
#
#         if not process_id:
#             return JsonResponse({"error": "Required fields: process_id."}, status=status.HTTP_400_BAD_REQUEST)
#
#         field_add = {"process_id": process_id}
#
#         # if not process_id:
#         #     return JsonResponse({"error": "Required fields: process_id."}, status=status.HTTP_400_BAD_REQUEST)
#         # elif report_type == 'document_id' and not payload.get('document_id'):
#         #     return JsonResponse({"error": "Required fields: document_id."}, status=status.HTTP_400_BAD_REQUEST)
#         # elif report_type == 'document_id' and not payload.get('document_id') and payload.get('scale_id'):
#         #     return JsonResponse({"error": "Wrong Fields Selected. \nRequired fields: document_id."}, status=status.HTTP_400_BAD_REQUEST)
#         # elif report_type == 'process_id' and payload.get('scale_id') and payload.get('document_id'):
#         #     return JsonResponse({"error": "You have selected 'Process_id' Reports so you dont need other parameters"}, status=status.HTTP_400_BAD_REQUEST)
#         # elif report_type == 'process_id' and payload.get('scale_id'):
#         #     return JsonResponse({"error": "You have selected 'Process_id' Reports so you dont need 'scale_id'."}, status=status.HTTP_400_BAD_REQUEST)
#         # elif report_type == 'process_id' and payload.get('document_id'):
#         #     return JsonResponse({"error": "You have selected 'Process_id' Reports so you dont need 'document_id'."}, status=status.HTTP_400_BAD_REQUEST)
#         # elif report_type == 'scale_id' and payload.get('document_id'):
#         #     return JsonResponse({"error": "You have selected 'scale_id' Reports so you dont need 'document_id'."}, status=status.HTTP_400_BAD_REQUEST)
#         # elif report_type == 'scale_id' and not payload.get('element_id') or not payload.get('element_id') or not payload.get('type_of_element') or not payload.get('template_id'):
#         #     return JsonResponse({"error": "Required fields are not present. \nRequired Fields: element_id, template_id, type_of_element."}, status=status.HTTP_400_BAD_REQUEST)
#
#
#         try:
#             # Execute dowellconnection API call
#                 response_data = execute_api_call("dowellscale", "bangalore", "dowellscale", "scale_reports",
#                                              "scale_reports",
#                                              "1094", "ABCDE", "fetch", field_add, "nil")
#                 print(response_data, "response_dataaaaaaaaaaaaaaaaa")
#                 data_ = response_data['data']
#                 print(data_, "data")
#         except Exception as e:
#             return JsonResponse({"error": f"Error fetching data from dowellconnection: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#
#         print(report_type, "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
#
#         all_scales = []
#         if payload.get('document_id'):
#             for i in data_:
#                 # print(i['document_data']['details']['id'], "((((((((((")
#                 # print(payload.get('document_id'), "))))))))))))")
#                 # print(i, "*************")
#                 if i['document_data']['details']['id'] == payload.get('document_id'):
#                     all_scales.append(i)
#
#
#         elif report_type == 'scale_id':
#             for i in data_:
#                 field_add = {"template_id": payload.get('template_id'),
#                              f"custom_input_groupings.{payload.get('type_of_element')}": payload.get('element_id')}
#                 response_data = execute_api_call("dowellscale", "bangalore", "dowellscale", "custom_data",
#                                                  "custom_data",
#                                                  "1181", "ABCDE", "find", field_add, "nil")
#                 # print(response_data, "responDse_datrrrrrrrrrrrrrrrrrrrrrrr")
#                 scale = response_data['data']['scale_id']
#                 print(scale)
#                 field_add = {"scale_data.scale_id": scale}
#                 response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
#                                                  "scale_reports",
#                                                  "1094", "ABCDE", "find", field_add, "nil")
#                 # print(json.loads(response_data)['data'], "^^^^^^^^^^^^^^^")
#                 all_scales.append(json.loads(response_data)['data'])
#
#         else:
#             for i in data_:
#                 all_scales.append(i)
#
#
#         if all_scales == []:
#             return JsonResponse({"error": "No data found for the given data."}, status=status.HTTP_404_NOT_FOUND)
#         elif len(all_scales) < 3:
#             return JsonResponse({"error": "Not enough scores found for the given info."}, status=status.HTTP_404_NOT_FOUND)
#
#         calculate_score = []
#         scale_type = ""
#         for x in all_scales:
#             print(x["scale_data"]["scale_type"])
#             print(x["scale_data"].get("scale_type"))
#             print(x['score']['score'])
#             print(x['score'])
#             if x["scale_data"]["scale_type"] == "nps scale":
#                 scale_type = "nps scale"
#                 print(x['score']['score'])
#                 calculate_score.append(int(float(x['score']['score'])))
#
#         # find the largest score among the score list of calculate scores
#         largest = max(calculate_score)
#         # Process the fetched data
#         if all_scales:
#             scores, scale_specific_data = process_data(all_scales)
#             print(scores, "scores")
#             response_ = {
#                 "scale_category": scale_type,
#                 "no_of_scales": len(scores.get("nps scale", [])),
#                 "nps_score": sum(scores.get("nps scale", [])),
#                 "nps_total_score": len(scores.get("nps scale", [])) * 10,
#                 "max_total_score": largest,
#                 "score_list": scores.get("nps scale"),
#                 "scale_specific_data": scale_specific_data
#             }
#             print(response_, "response_")
#         else:
#             return JsonResponse({"error": "No data found for the given process_id in Dowell response."}, status=status.HTTP_404_NOT_FOUND)
#
#
#         try:
#             # Execute Normality_api API call
#             with ThreadPoolExecutor() as executor:
#                 normality_future = executor.submit(Normality_api, process_id)
#                 normality = normality_future.result()
#                 print(normality, "normality")
#                 try:
#                     normality.pop("process_id")
#                     normality.pop("title")
#                 except:
#                     pass
#                 response_["normality_analysis"] = normality
#         except Exception as e:
#             return JsonResponse({"error": f"Error fetching data from Normality_api: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#         # Execute stattricks_api API call
#         try:
#             with ThreadPoolExecutor() as executor:
#                 process_id = f"{process_id}{report_type}"
#                 response_json_future = executor.submit(stattricks_api, "evaluation_module", process_id, 16, 3, {"list1": calculate_score})
#                 response_json = response_json_future.result()
#                 print(response_json, "response_json______________________")
#                 if "Process Id already in use. Please enter a different Process Id & try again" in response_json:
#                     get_response = stattricks_api_get(process_id)
#                     print(get_response, "get_response")
#                     response_json = get_response
#                 try:
#                     response_json.pop("msg")
#                     response_json.pop("_id")
#                     response_json.pop("Process_id")
#                     response_json.pop("title")
#                 except:
#                     pass
#                 response_["central_tendencies"] = response_json
#         except Exception as e:
#             return JsonResponse({"error": f"Error fetching data from stattricks_api: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         return JsonResponse(response_, status=status.HTTP_200_OK)
#


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
def custom_configurations(template_id, type_of_element, element,process_id):
    #querry the custom configuration api with template_id, type of element, element id
    field_add = {"template_id": template_id, f"custom_input_groupings.{type_of_element}": element}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "custom_data", "custom_data",
                                     "1181", "ABCDE", "find", field_add, "nil")

    # Find scale id, querry the reports db with scale_id, document_id
    scale = json.loads(response_data)['data']['scale_id']
    print(scale)
    field_add = {"scale_data.scale_id": scale,"process_id": process_id}
    response_data_scores = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                            "scale_reports",
                                            "1094", "ABCDE", "fetch", field_add, "nil")
    score = [x['score']['score'] for x in json.loads(response_data_scores)['data']]
    scale_type = json.loads(response_data_scores)['data'][0]["scale_data"]["scale_type"]
    return score, scale_type

def process_response(process_id):
    field_add = {"process_id": process_id}
    response_data_scores = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                     "scale_reports",
                                     "1094", "ABCDE", "fetch", field_add, "nil")

    score = [x['score']['score'] for x in json.loads(response_data_scores)['data']]
    scale_type = json.loads(response_data_scores)['data'][0]["scale_data"]["scale_type"]
    return score, scale_type

def document_response(document_id, process_id):
    print(document_id, process_id)
    field_add_doc = {"document_data.details.id": document_id, "process_id": process_id}
    response_data_scores = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                     "scale_reports",
                                     "1094", "ABCDE", "fetch", field_add_doc, "nil")

    print(json.loads(response_data_scores))
    score = [x['score']['score'] for x in json.loads(response_data_scores)['data']]
    scale_type = json.loads(response_data_scores)['data'][0]["scale_data"]["scale_type"]
    return score, scale_type

def statistics(scores, process_id):
    normality = Normality_api(process_id)
    stattrics = stattricks_api("evaluation_module", process_id, 16, 3, {"list1": scores})
    return normality, stattrics

@api_view(['POST'])
# def evaluation_module_refactored(request):
def evaluation_api(request):
    try:
        report_type = request.GET.get('report_type').strip()
        if report_type not in ["process", "document", "scale"]:
            return Response({"error": "Please provide a valid report type (scale/document/process)'"}, status=status)
    except:
        return Response({"error": "Please provide a report_type 'https://100035.pythonanywhere.com/evaluation/evaluation-api/?report_type=<scale/document/process>'" }, status=status.HTTP_400_BAD_REQUEST)
    try:
        response = request.data
        process_id = response.get("process_id")
    except Exception as e:
        return Response({"error": f"Field {e} missing"}, status=status.HTTP_400_BAD_REQUEST)
    if report_type == "document":
        try:
            document_id = response.get("document_id")
        except Exception as e:
            return Response({"error": f"Field {e} missing"},status=status.HTTP_400_BAD_REQUEST)
        scores, scale_type = document_response(document_id, process_id)
        # print(f"Document wise scores --total scores-- {len(scores)} :", scores)
    elif report_type == "process":
        scores, scale_type = process_response(process_id)
        # print(f"Process wise scores --total scores-- {len(scores)}  :", scores)
    elif report_type == "scales":
        try:
            template_id = response.get("template_id")
            type_of_element = response.get("type_of_element")
            element = response.get("element")
        except Exception as e:
            return Response({"error": f"Field {e} missing"},status=status.HTTP_400_BAD_REQUEST)
        scores, scale_type = custom_configurations(template_id, type_of_element, element,process_id)
        # print(f"Scale wise scores --total scores-- {len(scores)}  :", scores)


    if scores == []:
        return Response({"error": "No responses found for the given data"}, status=status.HTTP_404_NOT_FOUND)
    elif len(scores) < 3:
        return Response({"error": "Not enough scores found for the given info."}, status=status.HTTP_403_FORBIDDEN)
    response_ = categorize_scale_generate_scale_specific_report(scale_type, scores)
    try:
        process_id = f'{process_id}{report_type}'
        normality, stattrics = statistics(scores, process_id)
        response_["normality_analysis"] = normality
        response_["central_tendencies"] = stattrics
        return Response({"success": response_}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)



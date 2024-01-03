from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from EvaluationModule.calculate_function import *
from .report import ScaleReportObject
from .utils import fetch_scale_response


# Create your views here.
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
        dd = categorize_scale_generate_scale_specific_report(scale_type, all_scores)
        print(dd, "uiiu\n\n")
        reports["categorize_scale_type"] = dd
    except Exception as e:
        return Response({"isSuccess": False, "reports": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Statricks API call
    if scale_type != "likert scale" or scale_type != "likert":
        response_json = stattricks_api("evaluation_module", random_number, 16, 3, {"list1": all_scores})
        print(response_json, "lll\n\n")
        if response_json:
            reports.update({
                "Stattricks results": {
                "poisson_case_results": response_json.get("poison case results", {}),
                "normal_case_results": response_json.get("normal case results", {})
                }
            })
        try:
            normality = Normality_api(random_number)
            print(normality, "nrrr\n\n")
            reports.update({"Normality results": normality['list1']})
        except:
            pass
        
    print(reports, "reports\n\n")

    return Response({"report": reports}, status=status.HTTP_200_OK)


def fetch_scale_data(field_add):
    """
    Fetches scale data from the database.
    """
    try:
        response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                    "1094", "ABCDE", "fetch", field_add, "nil")
        result = json.loads(response)
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

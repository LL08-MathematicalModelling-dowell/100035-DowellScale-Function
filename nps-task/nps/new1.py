from dowellconnection import dowellconnection
from calculate_function import stattricks_api
import json

def total_score_fun(id):
    b = 0
    field_add = {"scale_data.scale_id": id}
    response_data = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
        "1094",
        "ABCDE", "fetch", field_add, "nil")
    data = json.loads(response_data)
    total_score = 0
    all_scores = []
    instanceID = 0

    if len(data['data']) != 0:
        score_data = data["data"]
        for i in score_data:
            b = i['score'][0]['score']
            all_scores.append(i['score'])
            total_score += int(b)
            instanceID = int(i['score'][0]['instance_id'].split("/")[-1])

    if total_score == 0 or len(all_scores) == 0:
        overall_category = "No response provided"
        category = "No response provided"
    else:
        overall_category = total_score / len(all_scores)
        category = find_category(overall_category)
    return overall_category, category, all_scores, instanceID, b, total_score

def calculate_total_score(id=None):
    # try:
        global overall_category, category, all_scores, instanceID, b, total_score
        field_add = {"settings.template_name": id, }
        x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale", "scale", "1093", "ABCDE",
            "fetch", field_add, "nil")

        settings_json = json.loads(x)

        try:
            id = settings_json['data'][0]["_id"]
        except:
            id = settings_json['data']

        print(id)

        overall_category, category, all_scores, instanceID, b, total_score = total_score_fun(id.strip())

        title = "backendtesting"
        process_id = id
        process_sequence_id = 16
        series = 3
        seriesvalues = {
            "list1": all_scores
        }
        try:
            response = stattricks_api(title, process_id, process_sequence_id, series, seriesvalues)
            print(response)
        except:
            print("error in stattricks_api")

    # except:
    #     # return print('{"error": "Please try again"}', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    #     return print('{"error": "Please try again"}')

        return print(f"All_scores: {all_scores}, Category: {category}")

if __name__ == "__main__":
    calculate_total_score('642155b23a2e110c90d48330')
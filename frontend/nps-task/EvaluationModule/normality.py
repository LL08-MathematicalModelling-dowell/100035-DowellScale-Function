import requests


# Normality API
def Normality_api(process_id):
    url = "https://100023.pythonanywhere.com/api"

    data = {
        "Process_id": process_id,
        "allowable_error": "4",
        "ind_dev": "1",
        "bins": "10",
        "slope_percentage_deviation": "25"
    }

    headers = {'content-type': 'application/json'}
    response = requests.post(url, json=data, headers=headers)

    response_data = response.json()

    title = response_data.get('title')
    process_id = response_data.get('Process_id')
    bins = response_data.get('bins')
    allowed_error = response_data.get('allowedError')
    series_count = response_data.get('series_count')
    calculations = response_data.get('calculations')
    list1 = calculations.get('list1') if calculations else None

    return {
        'title': title,
        'process_id': process_id,
        'bins': bins,
        'allowed_error': allowed_error,
        'series_count': series_count,
        'list1': list1
    }


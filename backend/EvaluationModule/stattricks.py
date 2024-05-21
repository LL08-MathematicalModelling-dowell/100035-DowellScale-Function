import requests

def stattricks_api(title, process_id, process_sequence_id, series, seriesvalues):
    url = "https://100004.pythonanywhere.com/processapi"
    payload = {
        "title": title,
        "Process_id": process_id,
        "processSequenceId": process_sequence_id,
        "series": series,
        "seriesvalues": seriesvalues
    }
    response = requests.post(url, json=payload)
    return response.json()
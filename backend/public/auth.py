import requests, json


def processApikey(api_key):
    url = f'https://100105.pythonanywhere.com/api/v3/process-services/?type=api_service&api_key={api_key}'
    print(api_key)
    print(url)
    payload = {
        "service_id": "DOWELL10005"
    }
    json_payload = json.dumps(payload)
    response = requests.post(url, json=json_payload)
    # print("responze from auth.py",response)
    # print("responze details",response.text)

    return response.json()
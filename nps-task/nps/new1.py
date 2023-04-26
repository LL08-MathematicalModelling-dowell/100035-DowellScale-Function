import requests

url = "https://100023.pythonanywhere.com/api"

data = {
    "Process_id": 832947228,
    "allowable_error":"4",
    "ind_dev":"1",
    "bins":"10",
    "slope_percentage_deviation":"25"
}

# set the headers and send the POST request with the payload
headers = {'content-type': 'application/json'}
response = requests.post(url, json=data, headers=headers)

# parse the response data as JSON and extract the relevant output variables
print(response)
print(response.json())
response_data = response.json()
print(response_data)

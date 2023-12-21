import requests

def targeted_population(database_details, time_input , distribution_input , stage_input_list ,  binomial = None , bernoulli = None):

    number_of_variables = 1

    request_data={
        'database_details': database_details,
        'distribution_input': distribution_input,
        'number_of_variable':number_of_variables,
        'stages':stage_input_list if stage_input_list else [],
        'time_input':time_input,
    }

    if distribution_input['bernoulli'] == 1:

        request_data["bernoulli"] = bernoulli

    if distribution_input['binomial'] == 1:
        request_data["binomial"] = binomial


    headers = {'content-type': 'application/json'}

    response = requests.post("http://100032.pythonanywhere.com/api/targeted_population/", json=request_data , headers=headers)

    return response.json()
# Create your views here.
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .calculate_function import *
from .normality import *

"""
This module takes radomm number, attaches it to the product name and doc_no and first save that data with 
Evaluation API with process id as process id is the random number and then use that same random number to
process the Normality API and get the responses of both the API's and then render the data to the template.
"""
def evaluation_editor(request, product_name, doc_no):
    random_number = generate_random_number()
    context = {}
    data = fetch_data(product_name)

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

    response_json = Evaluation_module(random_number, doc_no, product_name)
    context.update(response_json)

    poison_case_results = response_json.get("poison case results", {})
    normal_case_results = response_json.get("normal case results", {})
    context.update({
        "poison_case_results": poison_case_results,
        "normal_case_results": normal_case_results
    })

    normality = Normality_api(random_number)
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
    return render(request, 'EvaluationModule/editor_reports.html', context)
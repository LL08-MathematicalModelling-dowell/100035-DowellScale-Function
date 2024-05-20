from django.shortcuts import render
from django.http import HttpResponse ,JsonResponse
from nps.dowellconnection import dowellconnection
from nps.eventID import get_event_id
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def fetch_data(request):
    if request.method == "GET":
        inserted_id= request.POST.get("inserted_id")
        field ={
            "_id":inserted_id
        }
        fetched_data= dowellconnection("dowellscale","dowellscale","scale_reports","scale_reports","1094","ABCDE","fetch",field, "nil")
        return JsonResponse({
            "status": fetched_data
            })
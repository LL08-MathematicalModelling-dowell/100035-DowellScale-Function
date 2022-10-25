from django.urls import path
from .views import (dowell_likert_scale_admin_api, reroute, dowell_stapel_scale_admin_api, 
                    dowell_nps_scale_admin_api,dowell_likert_scale_admin_api)

app_name = "route"

urlpatterns = [
    path('', reroute, name="Home"),
    path('stapel-scale/', dowell_stapel_scale_admin_api, name="stapel"),
    path('likert-scale/', dowell_likert_scale_admin_api, name="likert"),
    path('nps-scale/', dowell_nps_scale_admin_api, name="nps"),
]

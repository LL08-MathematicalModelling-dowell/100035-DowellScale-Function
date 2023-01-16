from django.urls import path, include
from .views import scale_settings_api_view, single_scale_settings_api_view, single_scale_response_api_view, scale_response_api_view, settings_api_view_create,nps_response_view_submit


app_name="api"

urlpatterns = [ 
#Rest endpoints
path('likert_settings_create', settings_api_view_create, name="create_scale_settings_api"),
    path('likert_responses_create', nps_response_view_submit, name="nps_response_submit_api"),
    path('likert_settings', scale_settings_api_view, name="scale_settings_api"),
    path('likert_responses', scale_response_api_view, name="scale_response_api"),
    path('likert_settings/<str:id>', single_scale_settings_api_view, name="single_scale_settings_api"),
    path('likert_responses/<str:id>', single_scale_response_api_view, name="single_scale_response_api"),    
]



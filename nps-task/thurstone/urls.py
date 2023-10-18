from django.urls import path
from .views import response_submit_api_view

app_name='thurstone'
urlpatterns = [
    
    path('api/thurstone_response/', response_submit_api_view, name='thurstone_response'),
]
from django.urls import path

from .views import settings_api_view_create, response_submit_api_view

app_name='thurstone'
urlpatterns = [

    path('thurstone-settings/', settings_api_view_create, name='thurstone_settings'),
    path('thurstone-response/', response_submit_api_view, name='thurstone-response'),
]
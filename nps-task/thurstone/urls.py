from django.urls import path

from .views import settings_api_view_create, response_submit_api_view

app_name='thurstone'
urlpatterns = [

<<<<<<< HEAD
    path('api/thurstone-settings/', settings_api_view_create, name='thurstone_settings'),
    path('api/thurstone_response/', response_submit_api_view, name='thurstone_response'),

=======
    path('thurstone-settings/', settings_api_view_create, name='thurstone_settings'),
    path('thurstone_response/', response_submit_api_view, name='thurstone_response'),
>>>>>>> 9cf21d592bd983ed9347a412c930ca60921b04d0
]
from django.urls import path
<<<<<<< HEAD
from .views import settings_api_view_create

app_name='thurstone'
urlpatterns = [
    path('thurstone-settings/', settings_api_view_create, name="thurstone_scale_settings"),
=======
from .views import settings_api_view_create, response_submit_api_view

app_name='thurstone'
urlpatterns = [

    path('api/thurstone-settings/', settings_api_view_create, name='thurstone_settings'),
    path('api/thurstone_response/', response_submit_api_view, name='thurstone_response'),
>>>>>>> c771535b9201b1329161d6c730713112d5d36c9a
]
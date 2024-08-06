from django.urls import path
from .views import ScaleCreateAPI, create_scale_response, get_scale_response
from django.views.decorators.csrf import csrf_exempt

app_name = "public"
urlpatterns = [
    path('create-scale/v4/', ScaleCreateAPI.as_view(), name='create-scale'),
    path('create-response/v4/', csrf_exempt(create_scale_response), name='create-response'),
    path('get-response/', csrf_exempt(get_scale_response), name='get-response'),

]
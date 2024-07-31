from django.urls import path
from .views import ScaleCreateAPI, get_scale_response, create_scale_response, LearningIndexReports
from django.views.decorators.csrf import csrf_exempt



urlpatterns = [
    path("create-scale/",ScaleCreateAPI.as_view(), name='create-scale'),
    path("create-response/", csrf_exempt(create_scale_response), name='create-response'),
    path("get-response/", csrf_exempt(get_scale_response), name='get-response'),
    path("report/", LearningIndexReports.as_view(),name="report")
]
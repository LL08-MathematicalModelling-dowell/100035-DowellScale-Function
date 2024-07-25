from django.urls import path
from .views import *

app_name = "edu"

urlpatterns = [
    path('get-report/', LearningIndexReport.as_view(), name = 'learninglevelreport'),
    path('report/', LearningIndexReports.as_view())
]
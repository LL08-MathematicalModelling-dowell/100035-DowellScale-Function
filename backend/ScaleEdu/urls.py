from django.urls import path
from .views import LearningIndexReport

app_name = "edu"

urlpatterns = [
    path('get-report/', LearningIndexReport.as_view(), name = 'learninglevelreport')
]
from django.urls import path, include
from .views import *

app_name="Qsort"

urlpatterns = [
    path('qsort_analysis/', qsort_analysis, name="qsort_analysis"),
]

from django.urls import path, include
from .views import *

app_name="Qsort"

urlpatterns = [
    path('qsort_analysis/', qsort_analysis, name="qsort_analysis"),
    path('save_data/', save_data, name="save_data"),
    path('assign_statements/', assign_statements, name="assign_statements"),
]

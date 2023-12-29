from django.urls import path, include
from .views import *

app_name="evaluation_module"

urlpatterns = [
    path('scale/reports/<str:product_name>/<str:doc_no>', evaluation_editor, name="evaluation"),
    path("scalewise_reports/<str:scale_id>", scalewise_report, name="scalewise_report"),

    path('target/', Target_API, name="target"),
    # Evaluation API
    path('evaluation-api/', evaluation_api, name="evaluation_api"),
    # new evaluation module process id function
    path('scale/reports/<str:process_id>/<str:doc_no>', evaluation_editor_process_id, name="evaluation_process_id"),
    path('get_brand_product/', get_brand_product, name='get_brand_product'),
    path('get_scale_product/<str:scale>', get_scale_report, name='get_scale_report'),
]

from django.urls import path, include
from .views import *

app_name="evaluation_module"

urlpatterns = [
    path('scale/reports/<str:product_name>/<str:doc_no>', evaluation_editor, name="evaluation"),
    path('scale/reports/csv/<str:product_name>/<str:doc_no>', csv_new, name="csv_new"),
    path('scale/reports/username/<str:username>/<str:scale_category>', by_username, name="by_username"),

    # Rest endpoints
    path('scale/reports/api/<str:username>/<str:scale_category>', by_username_api, name="by_username"),
    path('target/', Target_API, name="target"),

    # Evaluation API
    path('evaluation-api/process_id/', evaluation_api, {'report_type': 'process_id'}, name="evaluation_api_process"),
    path('evaluation-api/doc_no/', evaluation_api, {'report_type': 'doc_no'}, name="evaluation_api_doc_no"),
    path('evaluation-api/scale_id/', evaluation_api, {'report_type': 'scale_id'}, name="evaluation_api_scale_id"),

    # new evaluation module process id function
    path('scale/reports/<str:process_id>/<str:doc_no>', evaluation_editor_process_id, name="evaluation_process_id"),
]

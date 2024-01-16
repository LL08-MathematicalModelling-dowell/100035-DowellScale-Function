from django.urls import path, include
from .views import *

app_name="evaluation_module"

urlpatterns = [
    path('scale/reports/<str:product_name>/<str:doc_no>', evaluation_editor, name="evaluation"),
    path("scale/scale_id/reports/<str:scale_id>" , scalewise_report , name = "scalewise_report"),
    path('scale/reports/csv/<str:product_name>/<str:doc_no>', csv_new, name="csv_new"),
    path('scale/reports/username/<str:username>/<str:scale_category>', by_username, name="by_username"),
    # Rest endpoints
    path('target/', Target_API, name="target"),
    # Evaluation API
    path('evaluation-api/', evaluation_api, name="evaluation_api"),
    # new evaluation module process id function
    path('scale/reports/<str:process_id>/<str:doc_no>', evaluation_editor_process_id, name="evaluation_process_id"),
    path('get_brand_product/', get_brand_product, name='get_brand_product'),

]

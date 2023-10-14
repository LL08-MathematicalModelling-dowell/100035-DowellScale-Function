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
]

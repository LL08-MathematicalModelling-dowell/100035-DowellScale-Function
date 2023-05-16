from django.urls import path, include
from .views import *

app_name="evaluation_module"

urlpatterns = [
    path('scale/reports/<str:product_name>/<str:doc_no>', evaluation_editor, name="evaluation"),
]

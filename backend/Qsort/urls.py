from django.urls import path, include
from .views import *

app_name="Qsort"

urlpatterns = [
    path('createScale/', CreateScale, name="createScale"),
    path('responseaapi/', ResponseAPI, name="responseAPI"),
]

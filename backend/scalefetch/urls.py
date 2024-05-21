from django.urls import path

from .views import fetch_data

urlpatterns =[
    path('fetch_data/',fetch_data, name= 'fetch_data'),
]
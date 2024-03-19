from django.urls import path
from .views import ScaleCreateAPIView

urlpatterns = [
    path('create-scale/', ScaleCreateAPIView.as_view(), name='create-scale'),
]

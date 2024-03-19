from django.urls import path
from .views import ScaleCreateAPIView, ScaleResponseAPIView

app_name = "addons"
urlpatterns = [
    path('create-scale/', ScaleCreateAPIView.as_view(), name='create-scale'),
    path('create-response/', ScaleResponseAPIView.as_view(), name='create-response'),
]

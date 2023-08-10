from django.urls import path
from .views import settings_api_view_create

app_name='paired-comparison'
urlpatterns = [
    path('paired-comparison-settings/', settings_api_view_create, name="paired_comparison_scale_settings"),
]
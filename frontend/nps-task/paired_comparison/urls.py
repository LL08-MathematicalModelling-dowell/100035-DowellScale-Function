from django.urls import path
from .views import settings_api_view_create, submit_response_view, single_scale_response_api_view

app_name='paired-comparison'
urlpatterns = [
    path('paired-comparison-settings/', settings_api_view_create, name="paired_comparison_scale_settings"),
    path('paired-comparison-response/', submit_response_view, name="paired_comparison_scale_responses"),
    path('paired-comparison-response/<str:id>', single_scale_response_api_view, name="paired_comparison_single_scale_response"),
]
from django.urls import path
from .views import settings_api_view_create

app_name='perceptual-mapping'
urlpatterns = [
    path('perceptual-mapping-settings/', settings_api_view_create, name="perceptual_maping_scale_settings"),
    # path('perceptual-mapping-response/<str:id>', single_scale_response_api_view, name="perceptual_maping_single_scale_response"),
    # path('perceptual-mapping-submit-response/', submit_response_view, name="perceptual_maping_scale_responses"),
    # path('perceptual-mapping-all-responses', scale_response_api_view, name="perceptual_maping_all_response")
]
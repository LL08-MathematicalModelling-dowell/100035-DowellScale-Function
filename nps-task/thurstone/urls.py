from django.urls import path
from .views import settings_api_view_create

app_name='thurstone'
urlpatterns = [
    path('thurstone-settings/', settings_api_view_create, name="thurstone_scale_settings"),
]
from django.urls import path
from .views import response_create, system_settings_create, SystemSettingsAll,setting_view_detail
urlpatterns = [
    path('nps-scale-settings/', system_settings_create, name="settings_page"),
    path('nps-response/', response_create, name="response_page"),
    path('all-nps-settings/', SystemSettingsAll.as_view(), name="settings_all"),
    path('nps-single-setting/<int:pk>/', setting_view_detail, name='detailview'),
]
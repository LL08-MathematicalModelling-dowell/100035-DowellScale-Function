from django.urls import path
from .views import  npslite_home, dowell_npslite_scale, dowell_npslite_scale_settings, npslite_home_admin,brand_product_error, settings_api_view_create, submit_response_view, npslite_response_view, scale_response_api_view
from .api_v4 import CreateNPSLiteScale, CreateNPSLiteResponse

app_name = 'nps-lite'
urlpatterns = [
    path('nps-lite-default/', npslite_home, name='default_page'),
    path('nps-lite-default-admin/', npslite_home_admin, name='admin_default_page'),
    path('nps-lite-admin/settings/', dowell_npslite_scale_settings,name='settings_page'),
    path('nps-lite-scale/<str:tname>/', dowell_npslite_scale, name='scale_display_page'),
    path('embed/', brand_product_error, name='display_embed_page'),
    path('api/nps-lite-settings/', settings_api_view_create, name="npslite_create_scale_settings_api"),
    path('api/nps-lite-response', submit_response_view, name="npslite_nps_response_submit_api"),
    path('api/nps-lite-responses/<str:id>', npslite_response_view, name="npslite_scale_settings_api"),
    path('api/nps-lite-all-responses', scale_response_api_view, name="npslite_all_responses"),
    path('api/v4/nps-lite-create-scale/', CreateNPSLiteScale.as_view(), name='nps-lite-create-scale'),
    path('api/v4/nps-lite-create-scale/<str:id>', CreateNPSLiteScale.as_view(), name='nps-lite-create-scale'),
    path('api/v4/nps-lite-create-response/', CreateNPSLiteResponse.as_view(), name='nps-lite-create-response')
]


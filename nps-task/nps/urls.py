from django.urls import path, include
from .views import dowell_scale_admin,dowell_scale1, default_scale, default_scale_admin,brand_product_error, scale_settings_api_view, single_scale_settings_api_view, single_scale_response_api_view, scale_response_api_view, settings_api_view_create,nps_response_view_submit


app_name="nps"
urlpatterns = [
    # path('', include(router.urls)),
    path('nps-admin/settings/', dowell_scale_admin,name='admin_page'),
    path('nps-scale1/<str:tname1>', dowell_scale1, name='afteradmin'),
    path('nps-scale/embed/', brand_product_error, name='error_page'),
    path('nps-scale/default/', default_scale, name='default_page'),
    path('nps-admin/default/', default_scale_admin, name='default_page_admin'),

    # Rest endpoints
    path('api/nps_settings_create', settings_api_view_create, name="create_scale_settings_api"),
    path('api/nps_responses_create', nps_response_view_submit, name="nps_response_submit_api"),
    path('api/nps_settings', scale_settings_api_view, name="scale_settings_api"),
    path('api/nps_responses', scale_response_api_view, name="scale_response_api"),
    path('api/nps_settings/<str:id>', single_scale_settings_api_view, name="single_scale_settings_api"),
    path('api/nps_responses/<str:id>', single_scale_response_api_view, name="single_scale_response_api"),
]
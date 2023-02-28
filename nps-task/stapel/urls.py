from django.urls import path
from .views import settings_api_view_create,dowell_scale_admin,dowell_scale1, default_scale, default_scale_admin,brand_product_error,stapel_response_view_submit, scale_settings_api_view,scale_response_api_view,single_scale_response_api_view, single_scale_settings_api_view

app_name="stapel"

urlpatterns = [
    path('stapel-admin/settings/', dowell_scale_admin,name='admin_page'),
    path('stapel-scale1/<str:tname1>', dowell_scale1, name='afteradmin'),
    path('stapel-scale/embed/', brand_product_error, name='error_page'),
    path('stapel-scale/default/', default_scale, name='default_page'),
    path('stapel-admin/default/', default_scale_admin, name='default_page_admin'),

    # Rest endpoints
    path('api/stapel_settings_create/', settings_api_view_create, name="stapel_create_scale_settings_api"),
    path('api/stapel_responses_create/', stapel_response_view_submit, name="stapel_nps_response_submit_api"),
    path('api/stapel_settings', scale_settings_api_view, name="stapel_scale_settings_api"),
    path('api/stapel_responses', scale_response_api_view, name="stapel_scale_response_api"),
    path('api/stapel_settings/<str:id>', single_scale_settings_api_view, name="stapel_single_scale_settings_api"),
    path('api/stapel_responses/<str:id>', single_scale_response_api_view, name="stapel_single_scale_response_api"),
]
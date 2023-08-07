from django.urls import path

from .views import (dowell_scale_admin,dowell_scale1, default_scale, default_scale_admin,
                    brand_product_preview,settings_api_view_create, percent_response_view_submit,
                    single_scale_response_api_view, scale_response_api_view
)

app_name="percent"

urlpatterns = [

    path('percent-admin/settings/', dowell_scale_admin,name='admin_page'),
    path('percent-scale1/<str:tname1>', dowell_scale1, name='afteradmin'),
    path('percent-scale/preview/', brand_product_preview, name='preview_page'),
    path('percent-scale/default/', default_scale, name='default_page'),
    path('percent-admin/default/', default_scale_admin, name='default_page_admin'),
    
    #REST ENDPOINTS
    path('api/percent_settings_create/', settings_api_view_create, name="percent_create_scale_settings_api"),
    path('api/percent_responses_create/', percent_response_view_submit, name="percent_percent_response_submit_api"),
    path('api/percent_responses/<str:id>', single_scale_response_api_view, name="percent_single_scale_response_api"),
    path('api/percent_all_responses', scale_response_api_view, name="percent_all_scale_response_api"),
]
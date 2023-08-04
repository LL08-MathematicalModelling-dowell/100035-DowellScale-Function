from django.urls import path

from .views import dowell_scale_admin,dowell_scale1, default_scale, default_scale_admin,brand_product_preview, dowell_likert, settings_api_view_create, submit_response_view, get_response_view, scale_response_api_view 

app_name="likert"

urlpatterns = [
    path('likert-scale_response/', submit_response_view, name='submit_response'),
    path('likert-scale_response/<str:id>', get_response_view, name='get_response'),
    path('likert-scale_create/', settings_api_view_create, name='settings_api_view_create'),
    path('likert-all-scale-response', scale_response_api_view, name='all_response_api_view'),
    path('likert-scale/likert/',dowell_likert, name="likert_page"),
    path('likert-admin/settings/', dowell_scale_admin,name='admin_page'),
    path('likert-scale1/<str:tname1>', dowell_scale1, name='afteradmin'),
    path('likert-scale/preview/', brand_product_preview, name='preview_page'),
    path('likert-scale/default/', default_scale, name='default_page'),
    path('likert-admin/default/', default_scale_admin, name='default_page_admin')
]
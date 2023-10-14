from django.urls import path, include
from .views import custom_configuration_list,dowell_editor_admin,custom_configuration_view,dowell_scale_admin,dowell_scale1, default_scale, default_scale_admin,brand_product_error, scale_settings_api_view, single_scale_settings_api_view, single_scale_response_api_view, scale_response_api_view, settings_api_view_create,nps_response_view_submit,dynamic_scale_instances


app_name="nps"
urlpatterns = [
    # path('', include(router.urls)),
    path('nps-admin/settings/', dowell_scale_admin, name='admin_page'),
    path('nps-scale1/<str:tname1>', dowell_scale1, name='afteradmin'),
    path('nps-scale/embed/', brand_product_error, name='error_page'),
    path('nps-scale/default/', default_scale, name='default_page'),
    path('nps-admin/default/', default_scale_admin, name='default_page_admin'),
    path('nps-editor/settings/<str:id>', dowell_editor_admin, name='default_page_admin'),
    # Rest endpoints

]
'''
    path('api/nps_create_instance', dynamic_scale_instances, name="dynamic_instance"),
    path('api/nps_settings_create/', settings_api_view_create, name="create_scale_settings_api"),
    path('api/nps_custom_data/', custom_configuration_view, name="custom_configs"),
    path('api/nps_custom_data_all', custom_configuration_list, name="all_elements"),
    path('api/nps_responses_create', nps_response_view_submit, name="nps_response_submit_api"),
    path('api/nps_settings', scale_settings_api_view, name="scale_settings_api"),
    path('api/nps_responses', scale_response_api_view, name="scale_response_api"),
    # path('api/total_responses/<str:doc_no>/<str:product_name>', calculate_total_score, name="calculate_total_score_api"),
    path('api/nps_settings/<str:id>', single_scale_settings_api_view, name="single_scale_settings_api"),
    path('api/nps_responses/<str:id>', single_scale_response_api_view, name="single_scale_response_api"),'''

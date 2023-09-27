from django.urls import path, re_path
from .views import redirect_view,scale_settings_api_view, dynamic_scale_instances_new, new_nps_create, single_scale_settings_api_view, single_scale_response_api_view, scale_response_api_view, settings_api_view_create, nps_response_view_submit, custom_configuration_list, custom_configuration_view, calculate_total_score, scale_settings_api_view, single_scale_settings_api_view, single_scale_response_api_view, scale_response_api_view, settings_api_view_create, nps_response_view_submit, dynamic_scale_instances
from django.views.decorators.csrf import csrf_exempt

app_name = "api"

# Rest endpoints
"""path('likert_settings_create', settings_api_view_create,
         name="create_scale_settings_api"),
    path('likert_responses_create', nps_response_view_submit,
         name="nps_response_submit_api"),
    path('likert_settings', scale_settings_api_view, name="scale_settings_api"),
    path('likert_responses', scale_response_api_view, name="scale_response_api"),
    path('likert_settings/<str:id>', single_scale_settings_api_view,
         name="single_scale_settings_api"),
    path('likert_responses/<str:id>', single_scale_response_api_view,
         name="single_scale_response_api"),
"""
# NPS Endpoints
# Rest endpoints
urlpatterns = [
	# Combined URL pattern
	re_path(r'^scales/$', csrf_exempt(redirect_view), name="combined_api"),
	# Individual URL patterns
	path('nps_create_instance',dynamic_scale_instances, name="dynamic_instance"),
	path('nps_settings_create/', settings_api_view_create,name="create_scale_settings_api"),
	path('nps_custom_data/', custom_configuration_view, name="custom_configs"),
	path('nps_custom_data_all', custom_configuration_list, name="all_elements"),
	path('nps_responses_create', nps_response_view_submit,name="nps_response_submit_api"),
	path('nps_settings', scale_settings_api_view, name="scale_settings_api"),
	path('nps_responses', scale_response_api_view, name="scale_response_api"),
	path('total_responses/<str:doc_no>/<str:product_name>',calculate_total_score, name="calculate_total_score_api"),
	path('nps_settings/<str:id>', single_scale_settings_api_view, name="single_scale_settings_api"),
	path('nps_responses/<str:id>', single_scale_response_api_view, name="single_scale_response_api"),

	# Updated Routes
	path('nps_create/', new_nps_create, name="nps_create"),
	path('nps_create_instance_new/',dynamic_scale_instances_new, name="dynamic_instance"),
]



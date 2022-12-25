from django.urls import path
from .views import npslite_home, dowell_npslite_scale, dowell_npslite_scale_settings, npslite_home_admin,brand_product_error

app_name = 'nps_lite'
urlpatterns = [
    path('nps-lite-default/', npslite_home, name='default_page'),
    path('nps-lite-default-admin/', npslite_home_admin, name='admin_default_page'),
    path('nps-lite-admin/settings/', dowell_npslite_scale_settings,name='settings_page'),
    path('nps-lite-scale/<str:tname>/', dowell_npslite_scale, name='scale_display_page'),
    path('embed/', brand_product_error, name='display_embed_page'),
]
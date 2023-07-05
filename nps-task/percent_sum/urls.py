from django.urls import path

from .views import dowell_scale_admin, dowell_scale1, default_scale, default_scale_admin, brand_product_preview, settings_api_view_create

app_name = "percent_sum"

urlpatterns = [
    path('percent-sum-settings', settings_api_view_create, name="create_percent_sum_scale_api"),
    # path('', rolescreen,name='login_page'),
    #path('percent-sum-admin/', login, name='percent_sum_login'),
    path('percent-sum-admin/settings/', dowell_scale_admin, name='admin_page'),
    path('percent-sum-scale1/<str:tname1>', dowell_scale1, name='afteradmin'),
    path('percent-sum-scale/preview/',
         brand_product_preview, name='preview_page'),
    path('percent-sum-scale/default/', default_scale, name='default_page'),
    path('percent-sum-admin/default/',
         default_scale_admin, name='default_page_admin')
]

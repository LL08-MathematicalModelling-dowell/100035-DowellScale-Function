from django.urls import path

from .views import dowell_scale_admin,dowell_scale1, default_scale, default_scale_admin,login,brand_product_preview,rolescreen, dowell_likert

app_name="likert"

urlpatterns = [
    path('', rolescreen,name='login_page'),
    path('likert-admin/', login,name='likertlogin'),
    path('likert-scale/likert/',dowell_likert, name="likert_page"),
    path('likert-admin/settings/', dowell_scale_admin,name='admin_page'),
    path('likert-scale1/<str:tname1>', dowell_scale1, name='afteradmin'),
    path('likert-scale/preview/', brand_product_preview, name='preview_page'),
    path('likert-scale/default/', default_scale, name='default_page'),
    path('likert-admin/default/', default_scale_admin, name='default_page_admin')
]
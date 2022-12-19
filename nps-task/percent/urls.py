from django.urls import path

from .views import dowell_scale_admin,dowell_scale1, default_scale, default_scale_admin,brand_product_preview

app_name="percent"

urlpatterns = [

    path('percent-admin/settings/', dowell_scale_admin,name='admin_page'),
    path('percent-scale1/<str:tname1>', dowell_scale1, name='afteradmin'),
    path('percent-scale/preview/', brand_product_preview, name='preview_page'),
    path('percent-scale/default/', default_scale, name='default_page'),
    path('percent-admin/default/', default_scale_admin, name='default_page_admin')
]
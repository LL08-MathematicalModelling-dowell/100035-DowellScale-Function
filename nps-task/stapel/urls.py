from django.urls import path, include

from .views import dowell_scale_admin,dowell_scale1, default_scale, default_scale_admin,login,brand_product_error,rolescreen

app_name="stapel"

urlpatterns = [
    path('', rolescreen,name='login_page'),
    path('stapel-admin/', login,name='stapellogin'),
    path('stapel-admin/settings/', dowell_scale_admin,name='admin_page'),
    path('stapel-scale1/<str:tname1>', dowell_scale1, name='afteradmin'),
    path('stapel-scale/embed/', brand_product_error, name='error_page'),
    path('stapel-scale/default/', default_scale, name='default_page'),
    path('stapel-admin/default/', default_scale_admin, name='default_page_admin')
]
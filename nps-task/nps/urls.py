from django.urls import path, include
from rest_framework import routers
from .views import SystemSettings, Response,dowell_scale_admin,dowell_scale,dowell_scale1, default_scale, default_scale_admin,login,brand_product_error,rolescreen

app_name="nps"
router = routers.DefaultRouter()
router.register('nps-setting', viewset=SystemSettings)
router.register('nps-response', viewset=Response)
urlpatterns = [
    # path('', include(router.urls)),
    path('api/', include(router.urls)),
    path('', rolescreen,name='login_page'),
    path('nps-admin/', login,name='npslogin'),
    path('nps-admin/settings/', dowell_scale_admin,name='admin_page'),
    path('nps-scale/<str:tname>', dowell_scale, name='detail_page'),
    path('nps-scale1/<str:tname1>', dowell_scale1, name='afteradmin'),
    path('nps-scale/embed/', brand_product_error, name='error_page'),
    path('nps-scale/default/', default_scale, name='default_page'),
    path('nps-admin/default/', default_scale_admin, name='default_page_admin')
]
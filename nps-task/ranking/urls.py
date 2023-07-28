from django.urls import path

from .views import (dowell_scale_admin,dowell_scale1, default_scale, default_scale_admin,
                    brand_product_preview,settings_api_view_create, 
)

app_name="ranking"

urlpatterns = [

    #REST ENDPOINTS
    path('api/ranking_settings_create/', settings_api_view_create, name="ranking_create_scale_settings_api"),

]
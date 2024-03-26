
from django.urls import path
from .views import ScaleCreateAPIView, post_scale_response
from django.views.decorators.csrf import csrf_exempt

app_name = "addons"
urlpatterns = [
    path('create-scale/', ScaleCreateAPIView.as_view(), name='create-scale'),
    path('create-response/', csrf_exempt(post_scale_response), name='create-response'),
]

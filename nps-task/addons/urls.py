from django.urls import path
from .views import ScaleCreateAPIView, post_scale_response
from .visitors_count import CreateCounterScale, VisitorsCountAPI
from django.views.decorators.csrf import csrf_exempt

app_name = "addons"
urlpatterns = [
    path('create-scale/', ScaleCreateAPIView.as_view(), name='create-scale'),
    # path('create-scale/<id>/', ScaleCreateAPIView.as_view(), name='create-scale'),
    path('create-response/', csrf_exempt(post_scale_response), name='create-response'),
    path('create-response/<id>', csrf_exempt(post_scale_response), name='create-response'),
    path('create-counter-scale/', CreateCounterScale.as_view(), name = 'createnpslite'),
    path('visitors-count/', VisitorsCountAPI.as_view(), name='visitors-count' )
]

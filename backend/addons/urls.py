from django.urls import path
from .views import ScaleCreateAPIView, post_scale_response
from ._views import ScaleCreateAPI, create_scale_response, get_scale_response, learning_index_report
from .reports import reports
from .visitors_count import CreateCounterScale, VisitorsCountAPI
from django.views.decorators.csrf import csrf_exempt

app_name = "addons"
urlpatterns = [
    path('create-scale/', ScaleCreateAPIView.as_view(), name='create-scale'),
    path('create-response/', csrf_exempt(post_scale_response), name='create-response'),
    path('create-response/<id>', csrf_exempt(post_scale_response), name='create-response'),
    path('create-counter-scale/', CreateCounterScale.as_view(), name = 'createnpslite'),
    path('visitors-count/', VisitorsCountAPI.as_view(), name='visitors-count' ),
    path('create-scale/v3/', ScaleCreateAPI.as_view(), name='create-scale-1'),
    path('create-response/v3/', csrf_exempt(create_scale_response), name='create-response-1'),
    path('get-response/', csrf_exempt(get_scale_response), name='get-response'),
    path('learning-index-report/', csrf_exempt(learning_index_report), name='learning-index-report'),
    path('get-report/',reports.as_view(),name='reports')
]

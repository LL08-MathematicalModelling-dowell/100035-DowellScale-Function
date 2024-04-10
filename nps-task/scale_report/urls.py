from django.urls import path
from .views import scalewise_report,scalewise_report_addons

app_name="scale_report"

urlpatterns = [
    path('scale_id/<str:scale_id>', scalewise_report,name='report'),
    path('addons_report/', scalewise_report_addons,name='addons_report')
]
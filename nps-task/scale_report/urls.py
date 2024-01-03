from django.urls import path

from .views import scalewise_report
app_name="scale_report"

urlpatterns = [

    path('scale_id/<str:scale_id>', scalewise_report,name='report')
]
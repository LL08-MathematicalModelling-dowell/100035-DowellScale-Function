from django.urls import path
from .views import UserManagement, ScaleManagement,healthCheck

urlpatterns = [
    path("health-check/", healthCheck.as_view()),
    path("user-management/",UserManagement.as_view()),
    path("scale-management/",ScaleManagement.as_view())

]
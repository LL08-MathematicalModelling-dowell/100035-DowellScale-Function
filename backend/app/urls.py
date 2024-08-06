from django.urls import path
from .views import UserManagement, ScaleManagement

urlpatterns = [
    path("user-management/",UserManagement.as_view()),
    path("scale-management/",ScaleManagement.as_view())

]
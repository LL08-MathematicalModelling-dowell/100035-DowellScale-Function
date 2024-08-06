from django.urls import path
from .views import UserManagement

urlpatterns = [
    path("user-management/",UserManagement.as_view())
]
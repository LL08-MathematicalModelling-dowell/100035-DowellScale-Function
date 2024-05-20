from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from .views import homepage, logout


app_name="login"
urlpatterns = [
    path('', homepage, name='home'),
    path('logout/', logout, name='logout_btn'),
]


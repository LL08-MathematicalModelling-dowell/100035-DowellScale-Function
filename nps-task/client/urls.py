from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from .views import homepage, redirect_portfolio


app_name="client"
urlpatterns = [
    path('', homepage, name='home'),
    path('create_portfolio', redirect_portfolio, name='redirect_portfolio'),
]


from django.urls import path
from npsScale import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [    
    path('', views.index, name='Home Page'),
    path('confirm_sessionid/', views.mainPage, name='SessionID Confirmation'),
    #path('endpoints/', views.endPoints, name='List of Endpoints')
         
]

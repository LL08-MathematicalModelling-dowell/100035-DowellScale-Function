from django.urls import path
from npsScale import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [    
    path('', views.index, name='Home Page'),
    path('confirm_sessionid/', views.mainPage, name='SessionID Confirmation'),
    path('login/', views.afterLogin, name='See Login Details'),
    
    path('endpoints/', views.apiOverview, name='List of Endpoints'),
   

    # NPSScale Starts Here
    path('add-products/', views.unAuthUser, name='Products'),
    path('list-products/', views.listProducts, name='List of Products'),
    
    # API form w/o session (LEGIT USE<send-scale-score>)
    path('send-scale-score/', views.sendScaleScore, name='Send Scale Score'),
    # API form
    path('submit-scale-score/', views.submitScaleScore, name='Scale Score'),
    # HTML form with and w/o dowellFunction()
    path('scally/', views.showScaleScore, name='Show Us Scale'),

    
    #(LEGIT USE <check-session>)
    path('check-session/', views.checkSession, name='Check Session from User'),
    #path('send-score/', views.sendScore, name='Push Score to DB'),





         
]

from django.urls import path
from . import views

urlpatterns=[
    path('',views.default,name="default"),
    path('form/',views.form,name="form"),
    path('insertQrImageData/',views.insertQrImageData,name="insertQrImageData"),
    #path("dbConnection/",views.dbConnectionTest,name="dbTest"),
    path("fetchQrImageDataForm/",views.findDataForm,name="findDataForm"),
    path("fetchQrImageData/",views.fetchData,name="fetchData"),
    path("fetchDataForm/",views.fetchDataForm,name="fetchDataForm"),
    path("fetchData/",views.findData,name="findData"),

    # API ROUTES
    path("api",views.statricks_api,name="statricks_api")
]
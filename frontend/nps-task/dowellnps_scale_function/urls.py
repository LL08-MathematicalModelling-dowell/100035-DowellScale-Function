"""dowellnps_scale_function URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from dowellnps_scale_function import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('nps.urls')),
    path('stapel/', include('stapel.urls')),
    path('percent/', include('percent.urls')),
    path('nps-lite/', include('npslite.urls')),
    path('likert/', include('likert.urls')),
    path('percent-sum/', include('percent_sum.urls')),
    path('ranking/', include('ranking.urls')),
    path('home/', include('login.urls')),
    path('client/', include('client.urls')),
    path('api/', include('api.urls')),
    path('evaluation/', include('EvaluationModule.urls')),
    path('apiconf/', include('APIconf.urls')),
    path('qsort/', include('Qsort.urls')),
    path('paired-comparison/', include('paired_comparison.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
# urlpatterns +=staticfiles_urlpatterns()

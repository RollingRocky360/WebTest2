from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name='dl-home'),
    path('getVideoData', views.getVideoData, name='dl-getVideoData'),
    path('getVideo', views.getVideo, name='dl-getVideo'),
]

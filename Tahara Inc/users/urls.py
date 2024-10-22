from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('register/', views.sign_up, name='register'),
    path('login/', views.sign_in, name='login'),
]
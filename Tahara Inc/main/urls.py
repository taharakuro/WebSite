from django.urls import path
from . import views

urlpatterns = [
    path('medsense/', views.medsense, name='medsense'),
    path('fingenius/', views.fingenius, name='fingenius'),
    path('ecowatch/', views.ecowatch, name='ecowatch')
]

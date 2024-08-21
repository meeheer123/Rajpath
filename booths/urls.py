from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('get_assemblies/<int:district_id>', views.get_assemblies, name='get_assemblies'),
]

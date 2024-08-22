from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('get_assemblies/<int:district_id>', views.get_assemblies, name='get_assemblies'),
    path('get_name_or_id/', views.get_name_or_id, name='get_name_or_id'),
    path('select_user/', views.select_user, name='select_user'),
]

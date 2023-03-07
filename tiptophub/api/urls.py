from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_routes, name="routes"),
    path('restaurants/', views.get_zip_restaurants, name="restaurants"),
    path('foods/', views.fetch_foods, name="foods"),
    path('results/', views.fetch_restaurants, name="results"),
]
from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_to_cart, name="adding_item"),
    path('index/', views.get_cart_items, name="get_cart_items"),
    path('submit/', views.submit_cart, name="submit_cart"),
    path('delete/', views.delete_cart_item, name="delete_item"),
    path('edit/', views.edit_quantity, name="update_quantity"),
]
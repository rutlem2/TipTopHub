from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product, Cart, CartItem

@api_view(['PUT'])
def add_to_cart(request):
    data = request.data
    product_name = data["name"]
    product_price = data["price"]
    product_quantity = data["quantity"]
    
    Product.objects.get_or_create(name=product_name, price=product_price)
    this_product = Product.objects.get(name=product_name)

    user_cart, created = Cart.objects.get_or_create()
    cart_item, created = CartItem.objects.get_or_create(cart=user_cart, product=this_product)
    cart_item.quantity += product_quantity

    cart_item.save()

    msg = "The current cart's id is: " + str(user_cart) + " and the cart holds the item " + str(type(this_product)) 

    return Response(msg)

@api_view(['GET'])
def get_cart_items(request):
    queries = CartItem.objects.all()
    items = []
    for query in queries:
        items.append({"name": query.product.name, "quantity": query.quantity, "price_per_each": query.product.price})

    return Response(items)

@api_view(['PUT'])
def delete_cart_item(request):
    data = request.data
    product_name = data["name"]
    this_product = Product.objects.get(name=product_name)
    user_cart, created = Cart.objects.get_or_create()
    
    cart_item, created = CartItem.objects.get_or_create(cart=user_cart, product=this_product)
    cart_item.delete()

    return Response("success")

@api_view(['GET'])
def submit_cart(request):
    user_cart, created = Cart.objects.get_or_create()
    user_cart.delete()

    return Response("success")

@api_view(['PUT'])
def edit_quantity(request):
    data = request.data
    product_name = data["name"]
    product_price = data["price"]
    product_quantity = data["quantity"]
    
    Product.objects.get_or_create(name=product_name, price=product_price)
    this_product = Product.objects.get(name=product_name)

    user_cart, created = Cart.objects.get_or_create()
    cart_item, created = CartItem.objects.get_or_create(cart=user_cart, product=this_product)
    cart_item.quantity = product_quantity

    cart_item.save()

    msg = "The current cart's id is: " + str(user_cart) + " and the cart holds the item " + str(type(this_product)) 

    return Response(msg)
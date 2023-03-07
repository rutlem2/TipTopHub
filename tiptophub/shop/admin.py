from django.contrib import admin

from .models import Cart
from .models import CartItem
from .models import Product

admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Product)

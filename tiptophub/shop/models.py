from django.db import models
import uuid

class Cart(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    created_at = models.DateTimeField(auto_now=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)


class Product(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    name = models.TextField(default="")
    description = models.TextField(null=True, blank=True)
    price = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, null=True)
    product = models.OneToOneField(Product, on_delete=models.CASCADE, null=True)
    quantity = models.PositiveIntegerField(blank=False, default=0)
    added_to_cart = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product.name

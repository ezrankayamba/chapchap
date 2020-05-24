from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Product(models.Model):
    name = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(decimal_places=0, max_digits=10)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="products"
    )

    def __str__(self):
        return self.name


class Address(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    email = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}, {self.email}, {self.phone}"


class Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    delivery_address = models.ForeignKey(Address, on_delete=models.CASCADE)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.IntegerField(default=1)

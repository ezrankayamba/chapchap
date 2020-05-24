from . import models
from django.contrib.auth.models import User
from rest_framework import serializers


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = models.Category
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    order = OrderSerializer(many=False, read_only=True)

    class Meta:
        model = models.OrderItem
        fields = "__all__"

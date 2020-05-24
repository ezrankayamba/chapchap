from django.shortcuts import render

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from . import serializers
from . import models
from rest_framework import viewsets


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    required_scopes = []
    serializer_class = serializers.CategorySerializer
    queryset = models.Category.objects.all()


class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    required_scopes = []
    serializer_class = serializers.ProductSerializer
    queryset = models.Product.objects.all()


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    required_scopes = []
    serializer_class = serializers.OrderSerializer
    queryset = models.Order.objects.all()


class OrderItemViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    required_scopes = []
    serializer_class = serializers.OrderItemSerializer
    queryset = models.OrderItem.objects.all()


class CheckoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        cart = data["cart"]
        delivery_address = data["address"]
        address = models.Address.objects.create(**delivery_address)
        order = models.Order.objects.create(delivery_address=address)
        for item in cart:
            product_id = item["product"]["id"]
            quantity = item["quantity"]
            models.OrderItem.objects.create(
                order=order, quantity=quantity, product_id=product_id
            )

        orderId = order.id
        return Response(
            {
                "status": 0,
                "message": f"Successfully created an order with ID {orderId}. Use this ID to track your order delivery",
                "orderId": orderId,
            }
        )

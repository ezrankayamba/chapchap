from django.contrib import admin
from . import models


class CategoryModelAdmin(admin.ModelAdmin):
    list_display = ("name",)


class ProductModelAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "category")


class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "created_at", "delivery_address")


admin.site.register(models.Category, CategoryModelAdmin)
admin.site.register(models.Product, ProductModelAdmin)
admin.site.register(models.Order, OrderAdmin)

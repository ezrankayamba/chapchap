from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"categories", views.CategoryViewSet)
router.register(r"products", views.ProductViewSet)
router.register(r"orders", views.OrderViewSet)
router.register(r"order-items", views.OrderItemViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("checkout", views.CheckoutView.as_view()),
]

from django.urls import path, include
from . import views

urlpatterns = [
    path('me/', views.UserDetailView.as_view()),
    path('register-me/', views.CreateUserView.as_view()),
]

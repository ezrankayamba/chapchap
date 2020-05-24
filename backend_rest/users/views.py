from rest_framework import generics, permissions
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from . import serializers
from . import models
from django.contrib.auth.models import User


class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['read']
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return User.objects.get(pk=self.request.user.id)


class CreateUserView(generics.CreateAPIView):
    model = User
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = serializers.UserSerializer

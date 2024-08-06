from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    workspace_id = serializers.CharField()
    portfolio_id = serializers.CharField()
    password = serializers.CharField()
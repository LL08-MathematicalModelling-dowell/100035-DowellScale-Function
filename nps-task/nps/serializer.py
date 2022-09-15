from rest_framework import serializers
from .models import system_settings, response
from bson.objectid import ObjectId


class SystemSettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = system_settings
        fields = '__all__'
        # fields = ('_id','direction','color','hex_color','timing','time','label','labelA','labelB', 'scale_limit','spacing_unit','scale', 'labels')


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = response
        fields = ('scale_name', 'score', 'brand_name', 'user', 'email')



from rest_framework import serializers


class ScaleSerializer(serializers.Serializer):
    workspace_id = serializers.CharField()
    username = serializers.CharField()
    scale_name = serializers.CharField()
    customizations = serializers.DictField()
    user_type = serializers.BooleanField()
    no_of_responses = serializers.IntegerField()
    channel_instance_list = serializers.ListField()
    
class ScaleSettingsSerializer(serializers.Serializer):
    orientation = serializers.CharField(max_length=250)
    scalecolor =serializers.CharField(max_length=250)
    fontcolor = serializers.CharField(max_length=250)
    fontstyle = serializers.CharField(max_length=250)

class ScaleResponseSerializer(serializers.Serializer):
    scale_id = serializers.CharField(max_length=250)
    workspace_id = serializers.CharField(max_length=250)
    username = serializers.CharField(max_length=250)
    # scale_name = serializers.CharField(max_length=250)
    scale_type = serializers.CharField(max_length=250)
    user_type = serializers.BooleanField()
    channel = serializers.CharField(max_length=250)
    instance = serializers.CharField(max_length=250)
    score = serializers.IntegerField()
    


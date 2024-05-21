from rest_framework import serializers

class ScaleSerializer(serializers.Serializer):
    workspace_id = serializers.CharField()
    username = serializers.CharField()
    scale_name = serializers.CharField()
    scale_type = serializers.CharField()
    user_type = serializers.BooleanField()
    no_of_responses = serializers.IntegerField()
    channel_instance_list = serializers.ListField()
    pointers = serializers.IntegerField(required=False)
    axis_limit = serializers.IntegerField(required=False)


class InstanceDetailsSerializer(serializers.Serializer):
    instance_name = serializers.CharField()
    instance_display_name = serializers.CharField()
    
class ChannelInstanceSerializer(serializers.Serializer):
    channel_name = serializers.CharField()
    channel_display_name = serializers.CharField()
    instances_details = InstanceDetailsSerializer(many=True)


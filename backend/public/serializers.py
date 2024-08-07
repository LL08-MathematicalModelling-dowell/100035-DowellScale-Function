from rest_framework import serializers

class ScaleSerializer(serializers.Serializer):
    api_key = serializers.CharField()
    workspace_id = serializers.CharField()
    username = serializers.CharField()
    scale_name = serializers.CharField()
    scale_type = serializers.CharField()
    user_type = serializers.BooleanField()
    no_of_responses = serializers.IntegerField()
    channel_instance_list = serializers.ListField()
    pointers = serializers.IntegerField(required=False)
    axis_limit = serializers.IntegerField(required=False)
    redirect_url = serializers.URLField(required=False)


class InstanceDetailsSerializer(serializers.Serializer):
    instance_name = serializers.CharField()
    instance_display_name = serializers.CharField()
    
class ChannelInstanceSerializer(serializers.Serializer):
    channel_name = serializers.CharField()
    channel_display_name = serializers.CharField()
    instances_details = InstanceDetailsSerializer(many=True)

class ReportsSerializer(serializers.Serializer):
    time_period= serializers.ChoiceField(choices=["7","30","90"], required=True)
    scale_id = serializers.CharField(required=True)
    channel_names = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )
    instance_names = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )
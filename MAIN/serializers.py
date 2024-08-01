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


class ScaleReportRequestSerializer(serializers.Serializer):
    choices =(
        ("24_hours","24 Hours"),
        ("seven_days", "Seven Days"),
        ("fifteen_days", "Fifteen Days"),
        ("thirty_days", "Thirty Days"),
        ("one_year", "One Year"),
        ("custom","Custom")

    )
    scale_id = serializers.CharField(allow_blank=False, allow_null= False)
    workspace_id = serializers.CharField(allow_null=False, allow_blank=True)
    channel_names = serializers.ListField(child=serializers.CharField())
    instance_names = serializers.ListField(child=serializers.CharField())
    period = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=choices)

class ScaleReportRequestCustomSerializer(ScaleReportRequestSerializer):
    start_date = serializers.DateField(allow_null=False)
    end_date = serializers.DateField( allow_null=False)
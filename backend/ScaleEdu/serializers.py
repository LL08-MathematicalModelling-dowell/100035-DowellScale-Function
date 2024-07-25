from rest_framework import serializers

class ScaleReportRequestSerializer(serializers.Serializer):
    choices =(
        ("seven_days", "Seven Days"),
        ("fifteen_days", "Fifteen Days"),
        ("thirty_days", "Thirty Days"),
        ("one_year", "One Year")
    )
    scale_id = serializers.CharField(allow_blank=False, allow_null= False)
    workspace_id = serializers.CharField(allow_null=False, allow_blank=True)
    channel_names = serializers.ListField(child=serializers.CharField())
    instance_names = serializers.ListField(child=serializers.CharField())
    period = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=choices)
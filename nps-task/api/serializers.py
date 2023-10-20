from rest_framework import serializers

class ScalesPluginSerializer(serializers.Serializer):
    api_key = serializers.CharField()
    username = serializers.CharField()
    scale_id = serializers.CharField()
    instance_id = serializers.IntegerField()
    page_id = serializers.CharField()
    block_id = serializers.CharField()
    score = serializers.IntegerField(allow_null=True)

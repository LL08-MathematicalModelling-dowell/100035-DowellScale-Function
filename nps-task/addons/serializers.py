from rest_framework import serializers

class ScaleSerializer(serializers.Serializer):
    scale_name = serializers.CharField(max_length=250)
    scale_type = serializers.CharField(max_length=250)
    total_no_of_items = serializers.IntegerField()
    no_of_instances = serializers.IntegerField()

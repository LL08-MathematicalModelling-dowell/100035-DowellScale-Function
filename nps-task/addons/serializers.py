from rest_framework import serializers

class ScaleSerializer(serializers.Serializer):
    workspace_id = serializers.CharField(max_length=250)
    username = serializers.CharField(max_length=250)
    scale_name = serializers.CharField(max_length=250)
    scale_type = serializers.CharField(max_length=250)
    # total_no_of_items = serializers.IntegerField()
    no_of_instances = serializers.IntegerField()
    api_key = serializers.CharField(max_length=250, required=False,allow_null=True)
    pointers = serializers.IntegerField(required=False, allow_null=True)
    axis_limit = serializers.IntegerField(required=False, allow_null=True)
   
class ScaleResponseSerializer(serializers.Serializer):
    scale_id = serializers.CharField()
    scale_type = serializers.CharField()
    score = serializers.CharField()
    instance_id = serializers.IntegerField()

    @classmethod
    def as_view(cls):
        pass

from rest_framework import serializers
from .models import Product, NpsScaleModel, NpsScaleSetting, nps_scores

'''
class SomeModelSerializer(serializers.ModelSerializer):
	class Meta:
		model = SomeModel
		fields = '__all__'
'''

# NPSScale Starts Here

# Serializer for unAuthenticated User
class unAuthUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = Product
		fields = ['id', 'name', 'scaleQuestion']

class theScaleSerializer(serializers.ModelSerializer):
	class Meta:
		model = nps_scores
		fields = ['name', 'score']
		
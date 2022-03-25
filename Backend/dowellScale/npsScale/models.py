from django.db import models
from django.contrib.auth.models import User

# Create your models here.
'''
class SomeModel(models.Model):
	title = models.CharField(max_length=200)
	completed = models.BooleanField(default=False, blank=True, null=True)

	def __str__(self):
		return self.title
'''
# NPS Scale Starts Here		

class Product(models.Model):
	id = models.AutoField(primary_key=True)
	#user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
	name = models.CharField(max_length=200)
	scaleQuestion = models.TextField()
	def __str__(self):
		return self.name
				

class NpsScaleModel(models.Model):
	id = models.AutoField(primary_key=True)
	user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
	product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
	npsscore = models.CharField(max_length=100)
	npsoutput = models.CharField(max_length=100)
	#scaleQuestion = models.TextField()
	responseTime = models.CharField(max_length=24)
	settingID = models.CharField(max_length=200)
	eventID = models.CharField(max_length=200)
	sessionID = models.CharField(max_length=100)


	class Meta:
		verbose_name_plural = "NPS Scale"
	def __str__():
		return "NPS Scale"

		

class NpsScaleSetting(models.Model):
	id = models.AutoField(primary_key=True)	
	# See 'user' in NPSScaleSetting in Admin
	user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
	scaleSettingName = models.CharField(max_length=255)
	settingID = models.CharField(max_length=200)
	eventID = models.CharField(max_length=200)
	productCategory = models.CharField(max_length=255)
	productSubCategory = models.CharField(max_length=255)
	product = models.CharField(max_length=255)
	help_YT = models.URLField(null=True)
	orientation = models.CharField(max_length=255)
	bg_color = models.CharField(max_length=255)
	scale_color = models.CharField(max_length=255)
	font_color = models.CharField(max_length=255)
	# I don't think settings should have Response Time though
	#responseTime = models.IntegerField()
	status = models.CharField(max_length=255)

	class Meta:
		verbose_name_plural = "NPS Scale Settings"
	def __str__():
		return "NPS Scale Settings"
	

class nps_scores(models.Model):
	scale = (
				('0', '0'),
				('1', '1'),
				('2', '2'),
				('3', '3'),
				('4', '4'),
				('5', '5'),
				('6', '6'),
				('7', '7'),
				('8', '8'),
				('9', '9'),
				('10', '10'),

		)
	name = models.CharField(max_length=100, default='Innovation')
	#name = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
	score = models.CharField(max_length=50, choices=scale, default='10')
	#timer = models.CharField(max_length=100, default='Default Time')
	def __str__(self):
		return self.name






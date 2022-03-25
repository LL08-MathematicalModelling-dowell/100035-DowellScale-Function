from django import forms
#from django.forms import ModelForm
#from .models import nps_scores



class NPSScaleForm(forms.Form):
    name = forms.CharField(max_length=128)
    score = forms.CharField(max_length=200)

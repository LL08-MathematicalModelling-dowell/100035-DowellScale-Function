from django.shortcuts import render, redirect
import requests, json, time
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.clickjacking import xframe_options_exempt


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

from .serializers import unAuthUserSerializer, theScaleSerializer
from .models import Product, NpsScaleModel, NpsScaleSetting, nps_scores
from .forms import NPSScaleForm

# Create your views here.
def mainPage(request):
	session_id = request.POST.get("session_id")
	url = "http://100002.pythonanywhere.com/"
		# adding edited field in article
	payload = json.dumps({
			"cluster": "login",
			"database": "login",
			"collection": "login",
			"document": "login",
			"team_member_ID": "6752828281",
			"function_ID": "ABCDE",
			"command": "find",
			"field": {"SessionID":session_id},
			"update_field": {
				"order_nos": 21
			},
			"platform": "bangalore"
		})
	headers = {
			'Content-Type': 'application/json'
		}

	response = requests.request("POST", url, headers=headers, data=payload)
	data = json.loads(response.text)
	if 'SessionID' in data:
		print('\n#################\n', data)
		return render(request, 'npsScale/main.html')

	else:
		print('\n#################\n', data, ' \n ')    
		return redirect("https://100014.pythonanywhere.com/")


def index(request):
	print('Testttttt')  
	return render(request, 'npsScale/main.html')

def afterLogin(request):
	url = 'https://100014.pythonanywhere.com'
	payload = {"user": "Sally", "pass": "sallysally"}
	files = []
	headers = {}
	res = requests.request("POST", url, headers=headers, data=payload, files=files)
	print(res.text)
	txty = res.text
	#sts = req.status_code
	
	#elif sts == 500:
	#  HttpResponse('<h1>Request Fail Yo</h1>')
	#return HttpResponse(f'<h1>Something is Wrong</h1> \n and the Status is <p>{sts}</p>')
	return render(request, 'npsScale/redirect.html', {'txty': txty})



@api_view(['GET'])
def apiOverview(request):
	api_urls = {
			'List': '/some-list/',
			'Detail View': '/some-detail/<str:pk>/',
			'Create': '/some-create/',
			'Update': '/some-update/<str:pk>/',
			'Delete': 'some-delete/<str:pk>/',

	}

	return Response(api_urls)


@api_view(['GET'])
def someList(request):
	some_tasks = SomeModel.objects.all()
	serializer = SomeModelSerializer(some_tasks, many=True)
	return Response(serializer.data)


@api_view(['POST'])
def someCreate(request):
	serializer = SomeModelSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()

	return Response(serializer.data)


@api_view(['POST'])
def someUpdate(request, pk):
	some_tasks = SomeModel.objects.get(id=pk)
	serializer = SomeModelSerializer(instance=some_tasks, data=request.data)
	if serializer.is_valid():
		serializer.save()
	return Response(serializer.data)


@api_view(['DELETE'])
def someDelete(request, pk):
	some_tasks = SomeModel.objects.get(id=pk)
	some_tasks.delete()
	return Response("Item Sucessfully Deleted")



 
 # NPSScale Starts Here

 # For UnAuthenticated Users
@api_view(['POST'])
def unAuthUser(request):
	serializer = unAuthUserSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
	return Response(serializer.data)

@api_view(['GET'])
def listProducts(request):
	prods = Product.objects.all()
	serializer = unAuthUserSerializer(prods, many=True)
	return Response(serializer.data)

#LEGIT USE
# (Working) `API for form` w/o session thing (dowellFunction())
@api_view(['POST'])
def sendScaleScore(request):
	serializer = theScaleSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
	return Response(serializer.data)


# API with dowellFunction() for form
# Think it works. Wld need to test with a session-based site to know
# The session item is empty here to it redirects to the login page
@api_view(['POST'])
def submitScaleScore(request):
	context = {}
	get_Ses = request.session
	print('\n######', '\nSESSION ITEMS\n', get_Ses.items(), '\nSESSION KEYS\n', get_Ses.keys())
	if 'session_id' and 'username' in get_Ses:
		context['username']= request.session['username']
		serializer = theScaleSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()			
			return Response(serializer.data)
		else:
			return redirect('https://100014.pythonanywhere.com/')
		
	else:
		return redirect('https://100014.pythonanywhere.com/')		


# (works) HTML form with DowellFunction()
@csrf_exempt
@xframe_options_exempt
def showScaleScore(request):
	context = {}
	get_Ses = request.session
	form = NPSScaleForm()
	print('\n######', '\nSESSION ITEMS\n', get_Ses.items(), '\nSESSION KEYS\n', get_Ses.keys())
	if 'session_id' and 'username' in request.session:		
		context['username']= request.session['username']
		if request.method == 'POST':
			form = NPSScaleForm(request.POST)
			if form.is_valid():
				form.save(commit=True)
				print('\n####*\n', 'Form Saved')
				#return index(request)
			else:
				print(form.errors)					
			return render(request, 'npsScale/showscale.html', context)

	else:
		try:
			session_id = request.GET.get('session_id', None)
			print("Session_id", str(session_id))
		except:
			pass
	return redirect('https://100014.pythonanywhere.com/')


'''
# (works) HTML Form w/o dowellFunction()
def showScaleScore(request):
	form = NPSScaleForm()
	if request.method == 'POST':
		form = NPSScaleForm(request.POST)
		if form.is_valid():
			cleanInit= form.cleaned_data
			cleanedData = nps_scores(
										name = cleanInit['name'],
										score = cleanInit['score'],
				)
			cleanedData.save()
			return HttpResponse("Score submitted")
	else:
		print('#####', form.errors)

	return render(request, 'npsScale/showscale.html', {'form': form})
'''			

def test1(request):
	# 'main.html' has a button that renders `views.showScaleScore'
	return render(request, 'npsScale/main.html')

def test2(request):
	# Renders 'showcscale.html' which shows the scale
	return render(request, 'npsScale/showscale.html')

# Updated 1
#LEGIT USE
def checkSession(request):
	context = {}
	get_Ses = request.session
	print('\n######', '\nSESSION ITEMS\n', get_Ses.items(), '\nSESSION KEYS\n', get_Ses.keys())
	if 'session_id' and 'username' in request.session:		
		context['username']= request.session['username']
		return render(request, 'npsScale/showscale.html', context)

	else:
		try:
			session_id = request.GET.get('session_id', None)
			print("Session_id", str(session_id))
		except:
			pass
	return redirect('https://100014.pythonanywhere.com/')

#updated 2
#def sendScore(request):




#************************************************

# Test for timer in form (under construction)
def TestTimer(request):
	start = time.time()
	end = time.time()
	total = end-start
	disct = [i for i in form.fields]
	#NPscore = nps_scores(name=form.value, score=form.value, time=total)
	#NPscore.save()
	#print('######', form.value, form.value, total)	

      











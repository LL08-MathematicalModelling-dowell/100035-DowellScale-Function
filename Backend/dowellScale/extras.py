

#************************************************
# urls.py
urlpatterns = [    
    path('', views.index, name='Home Page'),
    path('confirm_sessionid/', views.mainPage, name='SessionID Confirmation'),
    path('login/', views.afterLogin, name='See Login Details'),
    
    path('endpoints/', views.apiOverview, name='List of Endpoints'),
    path('some-list/', views.someList, name='Some List'),
    path('some-create/', views.someCreate, name='Some Create'),
    path('some-update/<str:pk>/', views.someUpdate, name='Some Update'),
    path('some-delete/<str:pk>/', views.someDelete, name='Some Delete'),

    # NPSScale Starts Here
    path('add-products/', views.unAuthUser, name='Products'),
    path('list-products/', views.listProducts, name='List of Products'),
    
    # API form w/o session (LEGIT USE<send-scale-score>)
    path('send-scale-score/', views.sendScaleScore, name='Send Scale Score'),
    # API form
    path('submit-scale-score/', views.submitScaleScore, name='Scale Score'),
    # HTML form with and w/o dowellFunction()
    path('scally/', views.showScaleScore, name='Show Us Scale'),

    path('test1/', views.test1, name='Test for Scale Page'),
    path('test2/', views.test2, name='Test to Send Scale'),
    #(LEGIT USE <check-session>)
    path('check-session/', views.checkSession, name='Check Session from User'),
    #path('send-score/', views.sendScore, name='Push Score to DB'),
         
]









#************************************************
# views.py


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
@permission_classes([IsAuthenticated])
def someDelete(request, pk):
	some_tasks = SomeModel.objects.get(id=pk)
	some_tasks.delete()
	return Response("Item Sucessfully Deleted")

api_view(['GET'])
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








# Test for timer in form (under construction)
def TestTimer(request):
	start = time.time()
	end = time.time()
	total = end-start
	disct = [i for i in form.fields]
	#NPscore = nps_scores(name=form.value, score=form.value, time=total)
	#NPscore.save()
	#print('######', form.value, form.value, total)	


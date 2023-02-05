from django.shortcuts import render
from django.http import HttpResponse
# import pymongo
from collections import Counter
import math

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from scipy.stats import kurtosis,moment,norm,skew
# from scipy import *
# from django.http import JsonResponse
import json
from bson import ObjectId
# import INSERT_mongo
# import FETCH_QR_mongo
# import FETCH_mongo
# import INPUT_mongo
from nps.dowellconnection import dowellconnection
from datetime import datetime
# from collections import Counter

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

# client = pymongo.MongoClient("mongodb://127.0.0.1:27017",connectTimeoutMS=30000, socketTimeoutMS=None, socketKeepAlive=True, connect=False, maxPoolsize=1)
# db = client['mongodb']

def default(request):
    return render(request,"dashboard.html")

# def dbConnectionTest(request):
#     return HttpResponse(str(client.test))

def form(request):
    return render(request,"insertDataForm.html")

def mean(n_num):
    n = len(n_num)
    if n==0:
        return 0
    else:
        get_sum = sum(n_num)
        mean = get_sum / n
        return round(mean,2)

def median(n_num):
    n = len(n_num)
    n_num.sort()
    if n==0:
        return 0
    elif n % 2 == 0:
        median1 = n_num[n//2]
        median2 = n_num[n//2 - 1]
        median = (median1 + median2)/2
        return median
    else:
        median = n_num[n//2]
        return median

def mode(n_num):
    c = Counter(n_num)
    return [k for k, v in c.items() if v == c.most_common(1)[0][1]]

def variance(data, ddof=0):
    n = len(data)
    if n==0:
        return 0
    else:
        mean = sum(data) / n
        return sum((x - mean) ** 2 for x in data) / (n - ddof)

def stdev(data):
    var = variance(data)
    std_dev = math.sqrt(var)
    return round(std_dev,2)

def process(time):
    current_datetime = datetime.now()
    hours=current_datetime.hour
    minutes=current_datetime.minute
    seconds=current_datetime.second

def Merge(dict1, dict2):
    res = {**dict1, **dict2}
    return res

def normalDistributionFunc(response):
    # response is from the dB
    mergedSeries = list()
    Response = response["series"]

    for i in range(1, len(Response) + 1):
        series = response["series"]["1000" + str(i)]
        mergedSeries.extend(series)

    return mergedSeries



# STATRICKS API
@api_view(['POST',])
def statricks_api(request):
    current_datetime = datetime.now()
    startHours = current_datetime.hour
    startMinutes = current_datetime.minute
    startSeconds = current_datetime.second
    if request.method == "POST":
        response = request.data
        mergedRange1 = list()
        mergedRange2 = list()
        mergedRange3 = list()
        processId = response["processId"]
        processSequenceId = response["processSequenceId"]
        numOfValues = response["series"]
        # values = response["values"]
        startTricks = "yes"
        title = response["title"]
        ### result=FETCH_QR_mongo.fetch(processId)
        field = {"processId": processId}
        result = dowellconnection("FB", "bangalore", "blr", "QR_IMAGE", "qr", "123456", "ABCDE", "fetch", field, "nil")
        # print(result)
        result=json.loads(result)
        # res = result['data']
        # print(type(result))
        print("This is my data",result['data'])
        if not result['data']:
            series = {}
            # seriesValues=[]
            seriesVariance = {}
            seriesValuesMean = {}
            seriesValuesMedian = {}
            seriesValuesMode = {}
            moment1 = {}
            moment2 = {}
            moment3 = {}
            moment4 = {}
            stdValue = {}
            skewness = {}
            kurtosisValues = {}
            minimumSeriesDatapoint = {}
            normalDistribution = {}
            continousDatapoints = []
            seriesLenghts = []
            count = 0
            ranges = {"1": [], "2": [], "3": []}
            standardDeviation = {}
            for i in range(int(numOfValues)):
                temporary = response["1000" + str(i + 1)]
                temporary2 = temporary.split(',')
                temporary3 = [int(i) for i in temporary2]
                seriesValuesMean["1000" + str(i + 1)] = mean(temporary3)
                seriesValuesMedian["1000" + str(i + 1)] = median(temporary3)
                seriesValuesMode["1000" + str(i + 1)] = mode(temporary3)
                stdValue["1000" + str(i + 1)] = stdev(temporary3)
                standardDeviation["1000" + str(i + 1)] = stdev(temporary3)
                seriesVariance["1000" + str(i + 1)] = variance(temporary3)
                ranges["1"].append(temporary3[0])
                ranges["2"].append(temporary3[1])
                ranges["3"].append(temporary3[2])
                count_val = count + len(temporary3)
                normalDistribution["1000" + str(i + 1)] = str(seriesValuesMean["1000" + str(i + 1)] - stdValue[
                    "1000" + str(i + 1)])
                moment1["1000" + str(i + 1)] = str(moment(temporary3, moment=1))
                moment2["1000" + str(i + 1)] = str(moment(temporary3, moment=2))
                moment3["1000" + str(i + 1)] = str(moment(temporary3, moment=3))
                moment4["1000" + str(i + 1)] = str(moment(temporary3, moment=4))
                skewness["1000" + str(i + 1)] = str(skew(temporary3))
                kurtosisValues["1000" + str(i + 1)] = str(kurtosis(temporary3))
                series["1000" + str(i + 1)] = temporary3
                minimumSeriesDatapoint["1000" + str(i + 1)] = min(temporary3)
                for j in temporary3: continousDatapoints.append(j)
                seriesLenghts.append(len(temporary3))
            minimumContinuousDatapoint = min(continousDatapoints)
            minimumSeries = min(seriesLenghts)
            maximumSeries = max(seriesLenghts)
            qrImageData = {
                "title": title,
                "Process_id": processId,
                "processSequenceId": processSequenceId,
                "series": series,
                "minimumSeries": minimumSeries,
                "maximumSeries": maximumSeries,
                "minimumSeriesDatapoint": minimumSeriesDatapoint,
                "minimumContinuousDatapoint": minimumContinuousDatapoint,
                "mean": seriesValuesMean,
                "median": seriesValuesMedian,
                "mode": seriesValuesMode,
                "standardDeviation": stdValue,
                "moment1": moment1,
                "moment2": moment2,
                "moment3": moment3,
                "moment4": moment4,
                "normalDistribution": normalDistribution,
                "skewness": skewness,
                "kurtosis": kurtosisValues,
                "range": ranges,
                "standardDeviation": standardDeviation,
                "count_val": count_val,
                "startTricks": startTricks
            }
            inputData = {}
            inputData["Process_id"] = processId
            inputData["title"] = title
            inputData["series"] = series
            x = dowellconnection("FB", "bangalore", "blr", "input", "input", "1234567", "ABCDE", "insert", inputData,
                "nil")
            # INPUT_mongo.insert(inputData)       #INPUT CLUSTER DATA INSERTION

            # Combine observations computation
            # mergedResult = normalDistribution(result)
            # data = result["data"]
            mergedResult = normalDistributionFunc(inputData)
            # print(normalDistribution)
            # print(mergedResult)
            count = len(mergedResult)
            maxMergedResult = max(mergedResult)
            minMergedResult = min(mergedResult)
            mergedMean = mean(mergedResult)
            mergedMedian = median(mergedResult)
            mergedMode = mode(mergedResult)
            mergedStdValue = stdev(mergedResult)
            # mergedStdValue__3 indicates standard deviation multiplied by negative 3
            mergedStdValue__3 = mergedStdValue * -3
            mergedStdValue__2 = mergedStdValue * -2
            mergedStdValue__1 = mergedStdValue * -1
            mergedStdValue_3 = mergedStdValue * 3
            mergedStdValue_2 = mergedStdValue * 2
            mergedStdValue_1 = mergedStdValue * 1

            for observation in mergedResult:
                if mergedStdValue - 1 <= observation <= mergedStdValue + 1:
                    mergedRange1.append(observation)

                elif mergedStdValue - 2 <= observation <= mergedStdValue + 2:
                    mergedRange2.append(observation)

                elif mergedStdValue - 3 <= observation <= mergedStdValue + 3:
                    mergedRange3.append(observation)

            mergedVariance = variance(mergedResult)
            mergedMoment1 = moment(mergedResult, moment=1)
            mergedMoment2 = moment(mergedResult, moment=2)
            mergedMoment3 = moment(mergedResult, moment=3)
            mergedMoment4 = moment(mergedResult, moment=4)
            mergedSkewness = skew(mergedResult)
            mergedKurtosis = kurtosis(mergedResult)

            combinedObservations = {
                "title": title,
                "processId": processId,
                "processSequenceId": processSequenceId,
                "mergedResult": mergedResult,
                "maxMergedResult": maxMergedResult,
                "minMergedResult": minMergedResult,
                "mergedMean": mergedMean,
                "mergedMedian": mergedMedian,
                "mergedMode": mergedMode,
                "mergedStdValue": mergedStdValue,
                "mergedStdValue_-3": mergedStdValue__3,
                "mergedStdValue_-2": mergedStdValue__2,
                "mergedStdValue_-1": mergedStdValue__1,
                "mergedStdValue_3": mergedStdValue_3,
                "mergedStdValue_2": mergedStdValue_2,
                "mergedStdValue_1": mergedStdValue_1,
                "mergedRange1": mergedRange1,
                "mergedRange2": mergedRange2,
                "mergedRange3": mergedRange3,
                "mergedVariance": mergedVariance,
                "mergedMoment1": mergedMoment1,
                "mergedMoment2": mergedMoment2,
                "mergedMoment3": mergedMoment3,
                "mergedMoment4": mergedMoment4,
                "mergedSkewness": mergedSkewness,
                "mergedKurtosis": mergedKurtosis
            }

            endHours = current_datetime.hour
            endMinutes = current_datetime.minute
            endSeconds = current_datetime.second
            processHours = endHours - startHours
            processMinutes = endMinutes - startMinutes
            processSeconds = endSeconds - startSeconds
            processTime = str(str(processHours) + ":" + str(processMinutes) + ":" + str(processSeconds + 1))
            qrImageData["processTime"] = processTime
            # INSERT_mongo.insert(qrImageData)    #QR_IMAGE CLUSTER DATA INSERTION
            # INSERT_mongo.insert(combinedObservations) # Combined Observation Insertion
            d = dowellconnection("FB", "bangalore", "blr", "QR_IMAGE", "qr", "123456", "ABCDE", "insert", qrImageData,
                "nil")
            e = dowellconnection("FB", "bangalore", "blr", "input", "input", "1234567", "ABCDE", "insert",
                combinedObservations, "nil")
            # print("qrImageData is: ",qrImageData)
            # print("elements in qrImageData :",len(qrImageData))
            # print("elements in combinedObservations :",len(combinedObservations))
            data = {}
            # data["data1"] = qrImageData
            # data["data"] = combinedObservations

            data_m1 = qrImageData
            data_m = combinedObservations
            print("This is data_m1", data_m1 ,"\n'\n")
            print("This is data_m", data_m)
            # finaldict={}
            # finaldict["data"]=qrImageData
            # finaldict["data"]=combinedObservations
            # data=finaldict["data"]
            # return render(request,'viewInsertedData.html',data)
            return Response({"msg": "DATA", "Title |": data_m["title"],"Process Id |":data_m["processId"],"Process Sequence Id |":data_m["processSequenceId"],"Series |":data_m1["series"],"Minimum Series |": data_m1["minimumSeries"],"Minimum Series Data Point |":data_m1["minimumSeriesDatapoint"],"Minimum Continuous Data Point |":data_m1["minimumContinuousDatapoint"], "Results":data_m1["minimumContinuousDatapoint"], "Mean |":data_m1["mean"], "Median |":data_m1["median"], "Mode |":data_m1["mode"], "Moment1 |": data_m1["moment1"], "Moment2 |":data_m1["moment2"], "Moment3 |": data_m1["moment3"], "Moment4 |": data_m1["moment4"], "Normal Distribution |":data_m1["normalDistribution"], "Skewness |": data_m1["skewness"],"Kurtosis |":data_m1["kurtosis"], "Range |":data_m1["range"], "Standard Deviation |": data_m1["standardDeviation"], "StartTricks |":data_m1["startTricks"], "Process Time |":data_m1["processTime"]}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Process Id already in use. Please enter a different Process Id & try again."},status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"msg": "No Data Found"},status=status.HTTP_404_NOT_FOUND)


def insertQrImageData(request):
    current_datetime = datetime.now()
    startHours=current_datetime.hour
    startMinutes=current_datetime.minute
    startSeconds=current_datetime.second
    if request.method=="POST":
        mergedRange1 = list()
        mergedRange2 = list()
        mergedRange3 = list()
        processId = request.POST.get("processId")
        processSequenceId = request.POST.get("processSequenceId")
        numOfValues = request.POST.get("numOfValues")
        values = request.POST.get("values")
        startTricks=request.POST.get("startTricks")
        title=request.POST.get("title")
        ### result=FETCH_QR_mongo.fetch(processId)
        field={"processId" : processId}
        result = dowellconnection("FB","bangalore","blr","QR_IMAGE","qr","123456","ABCDE","fetch",field,"nil")
        # print(result)
        # result=json.loads(result)
        # res = result['data']
        # print(type(result))
        if not result['data']:
            series={}
            # seriesValues=[]
            seriesVariance={}
            seriesValuesMean={}
            seriesValuesMedian={}
            seriesValuesMode={}
            moment1={}
            moment2={}
            moment3={}
            moment4={}
            stdValue={}
            skewness={}
            kurtosisValues={}
            minimumSeriesDatapoint={}
            normalDistribution={}
            continousDatapoints=[]
            seriesLenghts=[]
            count=0
            ranges={"1":[],"2":[],"3":[]}
            standardDeviation={}
            for i in range(int(numOfValues)):
                temporary=request.POST.get("1000"+str(i+1))
                temporary2=temporary.split(',')
                temporary3=[int(i) for i in temporary2]
                seriesValuesMean["1000"+str(i+1)]=mean(temporary3)
                seriesValuesMedian["1000"+str(i+1)]=median(temporary3)
                seriesValuesMode["1000"+str(i+1)]=mode(temporary3)
                stdValue["1000"+str(i+1)]=stdev(temporary3)
                standardDeviation["1000"+str(i+1)]=stdev(temporary3)
                seriesVariance["1000"+str(i+1)]=variance(temporary3)
                ranges["1"].append(temporary3[0])
                ranges["2"].append(temporary3[1])
                ranges["3"].append(temporary3[2])
                count_val=count+len(temporary3)
                normalDistribution["1000"+str(i+1)]=seriesValuesMean["1000"+str(i+1)]-stdValue["1000"+str(i+1)]
                moment1["1000"+str(i+1)]=moment(temporary3, moment=1)
                moment2["1000"+str(i+1)]=moment(temporary3, moment=2)
                moment3["1000"+str(i+1)]=moment(temporary3, moment=3)
                moment4["1000"+str(i+1)]=moment(temporary3, moment=4)
                skewness["1000"+str(i+1)]=skew(temporary3)
                kurtosisValues["1000"+str(i+1)]=kurtosis(temporary3)
                series["1000"+str(i+1)]=temporary3
                minimumSeriesDatapoint["1000"+str(i+1)]=min(temporary3)
                for j in temporary3:continousDatapoints.append(j)
                seriesLenghts.append(len(temporary3))
            minimumContinuousDatapoint=min(continousDatapoints)
            minimumSeries=min(seriesLenghts)
            maximumSeries=max(seriesLenghts)
            qrImageData={
                "title":title,
                "Process_id":processId,
                "processSequenceId":processSequenceId,
                "series":series,
                "minimumSeries":minimumSeries,
                "maximumSeries": maximumSeries,
                "minimumSeriesDatapoint":minimumSeriesDatapoint,
                "minimumContinuousDatapoint":minimumContinuousDatapoint,
                "mean":seriesValuesMean,
                "median":seriesValuesMedian,
                "mode":seriesValuesMode,
                "standardDeviation":stdValue,
                "moment1":moment1,
                "moment2":moment2,
                "moment3":moment3,
                "moment4":moment4,
                "normalDistribution":normalDistribution,
                "skewness":skewness,
                "kurtosis":kurtosisValues,
                "range":ranges,
                "standardDeviation":standardDeviation,
                "count_val":count_val,
                "startTricks":startTricks
                }
            inputData={}
            inputData["Process_id"]=processId
            inputData["title"]=title
            inputData["series"]=series
            x = dowellconnection("FB","bangalore","blr","input","input","1234567","ABCDE","insert",inputData,"nil")
            # INPUT_mongo.insert(inputData)       #INPUT CLUSTER DATA INSERTION

            # Combine observations computation
            # mergedResult = normalDistribution(result)
            # data = result["data"]
            mergedResult = normalDistributionFunc(inputData)
            # print(normalDistribution)
            # print(mergedResult)
            count = len(mergedResult)
            maxMergedResult = max(mergedResult)
            minMergedResult = min(mergedResult)
            mergedMean = mean(mergedResult)
            mergedMedian = median(mergedResult)
            mergedMode = mode(mergedResult)
            mergedStdValue = stdev(mergedResult)
            # mergedStdValue__3 indicates standard deviation multiplied by negative 3
            mergedStdValue__3 = mergedStdValue * -3
            mergedStdValue__2 = mergedStdValue * -2
            mergedStdValue__1 = mergedStdValue * -1
            mergedStdValue_3 = mergedStdValue * 3
            mergedStdValue_2 = mergedStdValue * 2
            mergedStdValue_1 = mergedStdValue * 1

            for observation in mergedResult:
                if mergedStdValue - 1 <= observation <= mergedStdValue + 1:
                    mergedRange1.append(observation)

                elif mergedStdValue - 2 <= observation <= mergedStdValue + 2:
                    mergedRange2.append(observation)

                elif mergedStdValue - 3 <= observation <= mergedStdValue + 3:
                    mergedRange3.append(observation)

            mergedVariance = variance(mergedResult)
            mergedMoment1 = moment(mergedResult, moment=1)
            mergedMoment2 = moment(mergedResult, moment=2)
            mergedMoment3 = moment(mergedResult, moment=3)
            mergedMoment4 = moment(mergedResult, moment=4)
            mergedSkewness = skew(mergedResult)
            mergedKurtosis = kurtosis(mergedResult)

            combinedObservations = {
                                    "title": title,
                                    "processId": processId,
                                    "processSequenceId": processSequenceId,
                                    "mergedResult": mergedResult,
                                    "maxMergedResult": str(maxMergedResult),
                                    "minMergedResult": str(minMergedResult),
                                    "mergedMean": str(mergedMean),
                                    "mergedMedian": str(mergedMedian),

                                    "mergedMode": mergedMode,

                                    "mergedStdValue": str(mergedStdValue),
                                    "mergedStdValue_-3": str(mergedStdValue__3),
                                    "mergedStdValue_-2": str(mergedStdValue__2),
                                    "mergedStdValue_-1": str(mergedStdValue__1),
                                    "mergedStdValue_3": str(mergedStdValue_3),
                                    "mergedStdValue_2": str(mergedStdValue_2),
                                    "mergedStdValue_1": str(mergedStdValue_1),

                                    "mergedRange1": mergedRange1,
                                    "mergedRange2": mergedRange2,
                                    "mergedRange3": mergedRange3,

                                    "mergedVariance": str(mergedVariance),
                                    "mergedMoment1": str(mergedMoment1),
                                    "mergedMoment2": str(mergedMoment2),
                                    "mergedMoment3": str(mergedMoment3),
                                    "mergedMoment4": str(mergedMoment4),
                                    "mergedSkewness": str(mergedSkewness),
                                    "mergedKurtosis": str(mergedKurtosis)
                                    }

            endHours=current_datetime.hour
            endMinutes=current_datetime.minute
            endSeconds=current_datetime.second
            processHours=endHours-startHours
            processMinutes=endMinutes-startMinutes
            processSeconds=endSeconds-startSeconds
            processTime=str(str(processHours)+":"+str(processMinutes)+":"+str(processSeconds+1))
            qrImageData["processTime"]=processTime
            # INSERT_mongo.insert(qrImageData)    #QR_IMAGE CLUSTER DATA INSERTION
            # INSERT_mongo.insert(combinedObservations) # Combined Observation Insertion
            d = dowellconnection("FB","bangalore","blr","QR_IMAGE","qr","123456","ABCDE","insert",qrImageData,"nil")
            e = dowellconnection("FB","bangalore","blr","input","input","1234567","ABCDE","insert",combinedObservations,"nil")
            # print("qrImageData is: ",qrImageData)
            # print("elements in qrImageData :",len(qrImageData))
            # print("elements in combinedObservations :",len(combinedObservations))
            data={}
            data["data1"]=qrImageData
            data["data"]=combinedObservations
            print(data)
            # finaldict={}
            # finaldict["data"]=qrImageData
            # finaldict["data"]=combinedObservations
            # data=finaldict["data"]
            # return render(request,'viewInsertedData.html',data)
            return render(request,'viewInsertedData.html',data)
        else:
            return HttpResponse("Process Id already in use. Please enter a different Process Id & try again.")
    else:
        return HttpResponse("No Data Found")

def findDataForm(request):
    return render(request,"findDataForm.html")

def findData(request):
    if request.method=="POST":
        Process_id = request.POST.get("id")
        Process_Id = {"Process_id":Process_id}
        # result=FETCH_mongo.fetch(Process_id)
        result=dowellconnection("FB","bangalore","blr","input","input","1234567","ABCDE","fetch",Process_Id,"nil")
        res=result["data"]
        h = res[0]
        print("h is: ",h)
        if result:
            displayData=json.dumps(h)
            # data={"task":"display data"}
            data={"data1":displayData}
            print("data1 is: ",data)
            return render(request,'viewData.html',h)
        # if result:
        #     displayData=json.loads(result)
        #     data={"task":"display data"}
        #     data["data"]=displayData
        else:
            return HttpResponse("No Data Found")
    else:
        return HttpResponse("No Data Found")

def fetchDataForm(request):
    return render(request,"fetchDataForm.html")

def fetchData(request):
    if request.method=="POST":
        Process_id = request.POST.get("id")
        processId = {"Process_id":Process_id}
        # result=FETCH_QR_mongo.fetch(Process_id)
        result=dowellconnection("FB","bangalore","blr","QR_IMAGE","qr","123456","ABCDE","fetch",processId,"nil")
        res=result["data"]
        f = res[0]
        if result:
            displayData=json.dumps(f)
            # data={"task":"display data"}
            data={"data":displayData}
            print("data is: ",data)
            return render(request,'viewData.html',f)
        else:
            return HttpResponse("No Data Found")
    else:
        return HttpResponse("No Data Found")
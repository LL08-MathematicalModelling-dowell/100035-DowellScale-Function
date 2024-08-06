from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from addons.datacube import datacube_data_insertion,datacube_data_retrieval,api_key
from django.contrib.auth.hashers import make_password, check_password
import asyncio
import json

# Create your views here.

class UserManagement(APIView):
    def post(self,request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            workspace_id = serializer.validated_data["workspace_id"]
            portfolio_id = serializer.validated_data["portfolio_id"]
            password = serializer.validated_data["password"]

            payload = {
                "workspace_id":workspace_id,
                "portfolio_id":portfolio_id,
                "password":make_password(password)
            }
            print(payload)
            try:
                existing_user = json.loads(datacube_data_retrieval(api_key,"voc","voc_user_management",{ "workspace_id":workspace_id,"portfolio_id":portfolio_id},10000, 0, False))
                response_ = existing_user['data']
                if response_:
                    return Response({
                        "success":False,
                        "message":"User already exists"
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                else:
                    new_user = json.loads(datacube_data_insertion(api_key,"voc","voc_user_management",payload))
                    if new_user['data']:
                        return Response({
                            "success":True,
                            "message": f"user with portfolio_id {portfolio_id} was created successfully",
                            "response":new_user['data']

                        }, status=status.HTTP_201_CREATED)
                    else:
                        return Response({
                            "success":False,
                            "message":"An error occured during user creation"
                        }
                            ,status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                return Response({"Error":e},status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




    def get(self,request):
        workspace_id = request.GET.get("workspace_id")
        portfolio_id = request.GET.get("portfolio_id")
        password = request.GET.get("password")
        if workspace_id and portfolio_id and password:
            try:

                existing_user = json.loads(datacube_data_retrieval(api_key,"voc","voc_user_management",{ "workspace_id":workspace_id,"portfolio_id":portfolio_id},10000, 0, False))
                response_ = existing_user['data']
                print("repsonse",response_)
                if response_:
                    response_pass = response_[0]["password"]
                    if check_password(password,response_pass):
                        print(check_password(password,response_pass))
                        return Response({
                            "success":True,
                            "message":"User Found",
                            "response": response_
                        }, status=status.HTTP_200_OK)
                    else:
                        return Response({
                            "success":False,
                            "message":"Invalid password"
                        }, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({
                        "success":False,
                        "message":"User does not exist"
                    }, status=status.HTTP_400_BAD_REQUEST)
                
            except Exception as e:
                return Response({
                    "success":False,
                    "message":e
                },status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success":False,
                "message":"Provide workspace_id, porfolio_id and password"
            },status=status.HTTP_400_BAD_REQUEST)

      


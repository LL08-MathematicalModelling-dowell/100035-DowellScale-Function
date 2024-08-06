from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from addons.datacube import datacube_data_insertion,datacube_data_retrieval,api_key
from django.contrib.auth.hashers import make_password, check_password
import asyncio
import json
from .helper import *
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

jwt_utils = JWTUtils()

@method_decorator(csrf_exempt, name='dispatch')
class healthCheck(APIView):
    def get(self, request):
        return Response({
            "success":True,
            "message":"If you are seeing this, then the server is up for Voice of Customer v1.0.0!"
        }, status=status.HTTP_200_OK)

class UserManagement(APIView):
    def post(self, request):
        type = request.GET.get('type')
        if type =='sign-up':
            return self.sign_up(request)
        elif type == 'login':
            return self.login(request)
        elif type == 'get_access_token':
            return self.get_access_token(request)
        else:
            return self.handle_error(request)
    def sign_up(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            workspace_id = serializer.validated_data["workspace_id"]
            portfolio = serializer.validated_data["portfolio"]
            password = serializer.validated_data["password"]

            payload = {
                "workspace_id":workspace_id,
                "portfolio":portfolio,
                "password":make_password(password)
            }
            print(payload)
            try:
                existing_user = json.loads(datacube_data_retrieval(api_key,"voc","voc_user_management",{ "workspace_id":workspace_id,"portfolio":portfolio},10000, 0, False))
                response_ = existing_user['data']
                if response_:
                    return Response({
                        "success":False,
                        "message":"User already exists",
                        "response": response_
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                else:
                    new_user = json.loads(datacube_data_insertion(api_key,"voc","voc_user_management",payload))

                    if new_user['data']:
                        return Response({
                            "success":True,
                            "message": f"user with portfolio_id {portfolio} was created successfully",
                            "response":{
                                "_id": new_user['data']['inserted_id'],
                                "workspace_id":workspace_id,
                                "portfolio":portfolio
                            }

                        }, status=status.HTTP_201_CREATED)
                    else:
                        return Response({
                            "success":False,
                            "message":"An error occured during user creation"
                        },status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                return Response({
                    "success": False,
                    "message":"An error occured during user creation",
                    "error":e
                },status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({
                "success":False,
                "message":"Posting wrong data to api",
                "errors": serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)

    def login(self,request):
        workspace_id = request.data.get("workspace_id")
        portfolio = request.data.get("portfolio")
        password = request.data.get("password")
        if workspace_id and portfolio and password:
            try:

                existing_user = json.loads(datacube_data_retrieval(api_key,"voc","voc_user_management",{ "workspace_id":workspace_id,"portfolio":portfolio},0, 0, False))
                response_ = existing_user['data']
                print("repsonse",response_)
                if response_:
                    response_pass = response_[0]["password"]
                    if check_password(password,response_pass):

                        token = jwt_utils.generate_jwt_tokens(response_[0]["_id"],workspace_id,portfolio)
                        print("token",token)
                        return Response({
                            "success":True,
                            "message":"User Found",
                            "access_token":token["access_token"],
                            "refresh_token":token["refresh_token"],
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

    def get_access_token(self,request):
        refresh_token = request.COOKIES.get('refresh_token') or request.headers.get('Authorization', '').replace('Bearer ', '') or request.data.get('refresh_token')

        if not refresh_token:
            return Response({
                "success": False,
                "message": "Refresh token not provided"
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        decoded_payload = jwt_utils.decode_jwt_token(refresh_token)
        if not decoded_payload:
            return Response({
                "success": False,
                "message": "Refresh token expired"
            }, status=status.HTTP_401_UNAUTHORIZED)
        user_response = json.loads(datacube_data_retrieval(
            api_key, 
            "voc", 
            "voc_user_management", 
            {
                "_id": decoded_payload["_id"]
            },
            0,
            0,
            False
        ))

        if not user_response['success']:
            return Response({
                "success": False,
                "message": "User not found"
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        token = jwt_utils.generate_jwt_tokens(
            user_response['data'][0]['_id'], 
            user_response['data'][0]['workspace_id'], 
            user_response['data'][0]['portfolio']
        )
        return Response({
            "success": True,
            "message": "Access token generated successfully",
            "access_token": token["access_token"],
            "refresh_token": token["refresh_token"],
            "response": user_response['data'][0]
        })
    
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)
      

class ScaleManagement(APIView):

    def post(self, request):
        type = request.GET.get('type')
        if type =='save_scale_details':
            return self.save_scale_details(request)
        elif type == 'scale_details':
            return self.scale_details(request)
        else:
            return self.handle_error(request)

    def save_scale_details(self, request):
        pass  

    def scale_details(self, request):
        workspace_id = request.data.get("workspace_id")
        portfolio = request.data.get("portfolio")

        serializer = ScaleDetailsSerializer(data={
            "workspace_id": workspace_id,
            "portfolio": portfolio
        })
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Invalid data",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        response = json.loads(datacube_data_retrieval(
            api_key,
            "voc",
            "voc_scales",
            {
                "workspace_id": workspace_id,
                "portfolio": portfolio
            },
            0,
            0,
            False
        ))

        if not response['success']:
            return Response({
                "success": False,
                "message": "No scale details found"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            "success": True,
            "message": f"Scale details for portfolio {portfolio} found",
            "response": response['data']
        }, status=status.HTTP_200_OK)
        
        

    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)
    

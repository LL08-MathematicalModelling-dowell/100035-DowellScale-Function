from django.shortcuts import render,redirect
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
@method_decorator(csrf_exempt, name='dispatch')
class UserManagement(APIView):
    def post(self, request):
        type = request.GET.get('type')
        if type =='sign-up':
            return self.sign_up(request)
        elif type == 'login':
            return self.login(request)
        elif type == 'get_access_token':
            return self.get_access_token(request)
        elif type == 'update_userprofile':
            return self.update_userprofile(request)
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
                if response_:
                    response_pass = response_[0]["password"]
                    if check_password(password,response_pass):

                        token = jwt_utils.generate_jwt_tokens(response_[0]["_id"],workspace_id,portfolio)
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
      
@method_decorator(csrf_exempt, name='dispatch')
class ScaleManagement(APIView):

    def post(self, request):
        type = request.GET.get('type')
        if type =='save_scale_details':
            return self.save_scale_details(request)
        elif type == 'scale_details':
            return self.scale_details(request)
        else:
            return self.handle_error(request)

    @login_required
    def save_scale_details(self, request):
        workspace_id = request.data.get("workspace_id")
        username = request.data.get("username")
        portfolio = request.data.get("portfolio")

        serializer = ScaleRetrieveSerializer(data={
            "workspace_id": workspace_id,
            "username": username,
            "portfolio": portfolio
        })
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Invalid data",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        voc_scale_data = json.loads(datacube_data_retrieval(
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

        if not voc_scale_data['success']:
            return Response({
                "success": False,
                "message": "Failed to retrieve scale data",
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if voc_scale_data["data"]:
            return Response({
                "success": False,
                "message": "Scale details already exist for this workspace, username, and portfolio",
            }, status=status.HTTP_400_BAD_REQUEST)
        
        scale_data_response = scale_data(workspace_id, username)
        if not scale_data_response["success"]:
            return Response({
                "success": False,
                "message": "Failed to retrieve scale data",
            }, status=status.HTTP_400_BAD_REQUEST)
        
        
        data_for_voc_scale = json.loads(datacube_data_retrieval(
            api_key,
            "voc",
            "voc_scales",
            {},
            0,
            0,
            False
        ))

        if not data_for_voc_scale['success']:
            return Response({
                "success": False,
                "message": "Failed to retrieve scale data for VOC",
            }, status=status.HTTP_400_BAD_REQUEST)

        
        existing_scale_ids = {scale['scale_id'] for scale in data_for_voc_scale.get('data', [])}
        
        
        available_scales = [scale for scale in scale_data_response['response'] if scale['scale_id'] not in existing_scale_ids]

        if not available_scales:
            return Response({
                "success": False,
                "message": "No new scale data available to assign",
            }, status=status.HTTP_400_BAD_REQUEST)

        assigned_scale = available_scales[0]  

       
        links_details = []
        scale_type = assigned_scale.get('scale_type')
        for channel in assigned_scale.get('channel_instance_details', []):
            channel_name = channel.get('channel_name', '') 
            channel_display_name = channel.get('channel_display_name', '')
            for instance in channel.get('instances_details', []):
                instance_name = instance.get('instance_name', '')  
                instance_display_name = instance.get('instance_display_name', '')
                link = (
                    f"https://100035.pythonanywhere.com/voc/?workspace_id={workspace_id}&username={username}&"
                    f"scale_id={assigned_scale['scale_id']}&scale_type={scale_type}&channel={channel_name}&"
                    f"instance_name={instance_name}&channel_display_name={channel_display_name}&instance_display_name={instance_display_name}"
                )
                qrcode_image = generate_qr_code(link)
                file_name = generate_file_name(prefix='qrcode', extension='png')
                qrcode_image_url = upload_qr_code_image(qrcode_image, file_name)
                links_details.append({
                    "scale_link": link,
                    "qrcode_image_url": qrcode_image_url
                })
        
        
        report_link = {
            "report_link": f"https://100035.pythonanywhere.com/voc/report/?workspace_id={workspace_id}&username={username}&scale_id={assigned_scale['scale_id']}",
            "qrcode_image_url": None
        }
        
       
        report_qrcode_image = generate_qr_code(report_link["report_link"])
        report_qrcode_file_name = generate_file_name(prefix='report_qrcode', extension='png')
        report_qrcode_image_url = upload_qr_code_image(report_qrcode_image, report_qrcode_file_name)
        report_link["qrcode_image_url"] = report_qrcode_image_url

        
        data_to_be_inserted = {
            "workspace_id": workspace_id,
            "username": username,
            "portfolio": portfolio,
            "scale_id": assigned_scale['scale_id'],
            "links_details": links_details,
            "report_link": report_link,
            "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "records": [{"record": "1", "type": "overall"}]
        }

        response = json.loads(datacube_data_insertion(
            api_key,
            "voc",
            "voc_scales",
            data_to_be_inserted
        ))
        
        if not response['success']:
            return Response({
                "success": False,
                "message": "Failed to save scale details"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            "success": True,
            "message": "Scale details saved successfully",
            "response": data_to_be_inserted
        })

    @login_required
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

        

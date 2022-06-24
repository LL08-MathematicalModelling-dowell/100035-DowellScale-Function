from os import system
from django.conf import settings
from rest_framework import status
from .serializer import SystemSettingsSerializer, ResponseSerializer
from rest_framework.generics import ListAPIView
from .models import system_settings, response 
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.filters import SearchFilter

@api_view(['POST',])
def system_settings_create(request):
    product = system_settings()

    if request.method == 'POST':
        serializer = SystemSettingsSerializer(product, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST',])
def response_create(request):
    client = response()

    if request.method == 'POST':
        serializer = ResponseSerializer(client, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class ClientResponses(ListAPIView):
#     queryset = ClientModel.objects.all()
#     serializer_class = ClientSerializer
#     filter_backends = (SearchFilter,)
#     search_fields = ('product_id__id',)
#
class SystemSettingsAll(ListAPIView):
    queryset = system_settings.objects.all()
    serializer_class = SystemSettingsSerializer
    

@api_view(['GET',])
def setting_view_detail(request, pk=None):
    try:
        settings = system_settings.objects.get(id=pk)
    except system_settings.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SystemSettingsSerializer(settings)
        return Response(serializer.data)



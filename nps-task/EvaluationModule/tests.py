import sys
sys.path.append('F:/dowell/100035-DowellScale-Function/nps-task')
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dowellnps_scale_function.settings')
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .views import evaluation_api

class EvaluationAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.base_url = reverse('evaluation_module:evaluation_api')  # Assuming the namespace is correctly set

    # Test for valid 'process' report type
    def test_valid_process_report(self):
        url = f'{self.base_url}?report_type=process'
        data = {'process_id': 'abcdef12345'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Test for invalid 'process' report type
    def test_invalid_process_report(self):
        url = f'{self.base_url}?report_type=process'
        response = self.client.post(url, {}, format='json')  # No 'process_id' provided
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test for valid 'document' report type
    def test_valid_document_report(self):
        url = f'{self.base_url}?report_type=document'
        data = {'document_id': 'zyx12345', 'process_id': 'abcdef12345'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Test for invalid 'document' report type
    def test_invalid_document_report(self):
        url = f'{self.base_url}?report_type=document'
        response = self.client.post(url, {'document_id': '123'}, format='json')  # No 'process_id' provided
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test for valid 'scale' report type
    def test_valid_scale_report(self):
        url = f'{self.base_url}?report_type=scale'
        data = {
            "process_id": "abcdef12345",
            "template_id": "6501693fd2cbd3e0c5b61acd",
            "element id": "t2",
            "type_of_element": "TEXT_INPUT"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Test for invalid 'scale' report type
    def test_invalid_scale_report(self):
        url = f'{self.base_url}?report_type=scale'
        data = {
            'template_id': 'template123',
            'type_of_element': 'element_type',
            'process_id': 'process123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


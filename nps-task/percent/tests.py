from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class CreateScaleSettingsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_scale_settings(self):
        # Define the request data for creating scale settings
        url = reverse('percent:percent_create_scale_settings_api')
        payload = {
                "username" : "natan",
                "time" : 100,
                "scale_name" : "test_scale",
                "no_of_scale" : 1,
                "orientation" : "horizontal",
                "scale_color" : "FFFFFF",
                "product_count" : 3,
                "product_names" : ["Product 1", "Product 2", "Product 3"],
                "user" : "yes"
                }

        # Send a POST request to the API endpoint
        response = self.client.post(url, data=payload, format='json')

        # Assert the response status code
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Assert the response data
        self.assertIn('success', response.data)
        self.assertIn('data', response.data)

        # Assert that the created scale settings are returned in the response data
        created_settings = response.data['data']
        self.assertEqual(created_settings['settings']['orientation'], 'horizontal')
        self.assertEqual(created_settings['settings']['scale_color'], 'FFFFFF')
        self.assertEqual(created_settings['settings']['product_count'], 3)
        self.assertEqual(created_settings['settings']['product_names'], ['Product 1', 'Product 2', 'Product 3'])
        
    def test_create_scale_settings_with_invalid_data(self):
        # Define the request data for creating scale settings
        url = reverse('percent:percent_create_scale_settings_api')
        payload = {
                "username" : "natan",
                "time" : 100,
                "scale_name" : "test_scale",
                "no_of_scale" : 1,
                "orientation" : "horizontal",
                "scale_color" : "FFFFFF",
                "product_count" : 3,
                "product_names" : ["Product 1", "Product 2", "Product 3"],
                }

        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('user missing', response.data['error'])
        
        
    def test_create_scale_settings_with_missing_requierd_field(self):
        url = reverse('percent:percent_create_scale_settings_api')
        payload = {
                "username" : "natan",
                "time" : 100,
                "scale_name" : "test_scale",
                "no_of_scale" : 1,
                "orientation" : "horizontal",
                "scale_color" : "FFFFFF",
                "product_count" : 3,
                "user" : "yes"
                }

        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('product_names missing', response.data['error'])
        
    
    def test_create_scale_settings_with_invalid_product_count(self):
        url = reverse('percent:percent_create_scale_settings_api')
        payload = {
                "username" : "natan",
                "time" : 100,
                "scale_name" : "test_scale",
                "no_of_scale" : 1,
                "orientation" : "horizontal",
                "scale_color" : "FFFFFF",
                "product_count" : 0,
                "product_names" : ["Product 1", "Product 2", "Product 3"],
                "user" : "yes"
                }

        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('Product count and number of product names count should be same', response.data['error'])
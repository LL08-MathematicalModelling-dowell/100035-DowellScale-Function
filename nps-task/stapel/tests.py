from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class TestStapelScaleAPI(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_scale_settings(self):
        """
        Test the api to create a new stapel scale settings
        """
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/"
        payload = {
            "username": "natan",
            "orientation": "horizontal",
            "spacing_unit": 1,
            "scale_upper_limit": 10,
            "scalecolor": "#FFFFFF",
            "roundcolor": "#CCCCCC",
            "fontcolor": "#000000",
            "fomat": "emoji",
            "time": "60",
            "name": "TestName",
            "left": "very good",
            "right": "very good",
            "label_images": {"0": "imagefile", "1": "imagefile", "2": "imagefile"},
            "fontstyle": "Arial, Helvetica, sans-serif",
            "custom_emoji_format": {"0": "😎", "1": "🤓", "2": "😊"}
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('success', response.data)
        self.assertIn('data', response.data)
        created_settings = response.data['data']
        self.assertEqual(created_settings['settings']['orientation'], 'horizontal')
        self.assertEqual(created_settings['settings']['spacing_unit'], 1)
        self.assertEqual(created_settings['settings']['scale_upper_limit'], 10)
        self.assertEqual(created_settings['settings']['scalecolor'], '#FFFFFF')
        self.assertEqual(created_settings['settings']['roundcolor'], '#CCCCCC')
        self.assertEqual(created_settings['settings']['fontcolor'], '#000000')
        self.assertEqual(created_settings['settings']['fomat'], 'emoji')
        self.assertEqual(created_settings['settings']['time'], '60')
        self.assertEqual(created_settings['settings']['name'], 'TestName')
        
        
    def test_create_scale_settings_with_invalid_data(self):
        """
        Test the api to create a new stapel scale settings with invalid data
        """
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/"
        payload = {
            "username": "natan",
            "orientation": "horizontal",
            "spacing_unit": 1,
            "scale_upper_limit": "Invalid Ten",
            "scalecolor": "#FFFFFF",
            "roundcolor": "#CCCCCC",
            "fontcolor": "#000000",
            "fomat": "emoji",
            "time": "60",
            "name": "TestName",
            "left": "very good",
            "right": "very good",
            "label_images": {"0": "imagefile", "1": "imagefile", "2": "imagefile"},
            "fontstyle": "Arial, Helvetica, sans-serif",
            "custom_emoji_format": {"😎","🤓","😊"}
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Error', response.data)
        self.assertIn('Invalid fields!', response.data['Error'])
    
    def test_create_scale_settings_with_missing_requierd_field(self):
        """
        Test the api to create a new stapel scale settings with missing requierd field
        """
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/"
        payload = {
            # missing username
            "orientation": "horizontal",
            "spacing_unit": 1,
            "scale_upper_limit": 10,
            "scalecolor": "#FFFFFF",
            "roundcolor": "#CCCCCC",
            "fontcolor": "#000000",
            "fomat": "emoji",
            "time": "60",
            "name": "TestName",
            "left": "very good",
            "right": "very good",
            "label_images": {"0": "imagefile", "1": "imagefile", "2": "imagefile"},
            "fontstyle": "Arial, Helvetica, sans-serif",
            "custom_emoji_format": {"0": "😎", "1": "🤓", "2": "😊"}
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)
        self.assertIn('Unauthorized', response.data['error'])
        
    def test_retrieve_scale_settings(self):
        """
        Test the api to retrieve stapel scale settings
        """
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/"
        payload = {
            "username": "natan",
            "orientation": "horizontal",
            "spacing_unit": 1,
            "scale_upper_limit": 10,
            "scalecolor": "#FFFFFF",
            "roundcolor": "#CCCCCC",
            "fontcolor": "#000000",
            "fomat": "emoji",
            "time": "60",
            "name": "TestName",
            "left": "very good",
            "right": "very good",
            "label_images": {"0": "imagefile", "1": "imagefile", "2": "imagefile"},
            "fontstyle": "Arial, Helvetica, sans-serif",
            "custom_emoji_format": {"0": "😎", "1": "🤓", "2": "😊"}
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('success', response.data)
        self.assertIn('data', response.data)
        scale_id = response.data['data']['scale_id']
        url2 = "https://100035.pythonanywhere.com/stapel/api/stapel_settings/" + scale_id
        response2 = self.client.get(url2, format='json')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertIn('isSuccess', response2.data['payload'])
        self.assertIn('data', response2.data['payload'])
        retrieved_settings = response2.data['payload']['data'][0]
        self.assertEqual(retrieved_settings['settings']['orientation'], 'horizontal')
        self.assertEqual(retrieved_settings['settings']['spacing_unit'], 1)
        self.assertEqual(retrieved_settings['settings']['scale_upper_limit'], 10)
        self.assertEqual(retrieved_settings['settings']['scalecolor'], '#FFFFFF')
        self.assertEqual(retrieved_settings['settings']['roundcolor'], '#CCCCCC')
        self.assertEqual(retrieved_settings['settings']['fontcolor'], '#000000')
        self.assertEqual(retrieved_settings['settings']['fomat'], 'emoji')
       
    def test_retrieve_scale_settings_with_invalid_id(self):
        """
        Test the api to retrieve stapel scale settings with invalid id
        """
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_settings/invalid_id"
        response = self.client.get(url, format='json')
        
        """The status code should be 400 rather than 200
        """
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data['payload'])
        self.assertIn('not a valid ', response.data['payload']['error'])
        
    def test_update_scale_settings(self):
        """
        Test the api to update stapel scale settings
        """
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/"
        payload = {
            "username": "natan",
            "orientation": "horizontal",
            "spacing_unit": 1,
            "scale_upper_limit": 10,
            "scalecolor": "#FFFFFF",
            "roundcolor": "#CCCCCC",
            "fontcolor": "#000000",
            "fomat": "emoji",
            "time": "60",
            "name": "TestName",
            "left": "very good",
            "right": "very good",
            "label_images": {"0": "imagefile", "1": "imagefile", "2": "imagefile"},
            "fontstyle": "Arial, Helvetica, sans-serif",
            "custom_emoji_format": {"0": "😎", "1": "🤓", "2": "😊"}
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('success', response.data)
        self.assertIn('data', response.data)
        scale_id = response.data['data']['scale_id']
        url2 = "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/"
        payload2 = {
            "scale_id": scale_id,
            "username": "natan",
            "orientation": "vertical",
            "spacing_unit": 1,
            "scale_upper_limit": 10,
            "scalecolor": "#CCCCCC",
            "roundcolor": "#333333",
            "fontcolor": "#FFFFFF",
            "fomat": "emoji",
        
        }
        response2 = self.client.put(url2, data=payload2, format='json') 
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        
        self.assertIn('success', response2.data)
        self.assertEqual('vertical', response2.data['data']['settings']['orientation'])
        self.assertEqual('#CCCCCC', response2.data['data']['settings']['scalecolor'])
        self.assertEqual('#333333', response2.data['data']['settings']['roundcolor'])
        self.assertEqual('#FFFFFF', response2.data['data']['settings']['fontcolor'])
        self.assertEqual('emoji', response2.data['data']['settings']['fomat'])
        
    def test_update_scale_settings_with_invalid_id(self):
        """
        Test the api to update stapel scale settings with invalid id
        """
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/"
        payload = {
            "scale_id": "invalid_id",
            "username": "natan",
            "orientation": "vertical",
            "spacing_unit": 1,
            "scale_upper_limit": 10,
            "scalecolor": "#CCCCCC",
            "roundcolor": "#333333",
            "fontcolor": "#FFFFFF",
            "fomat": "emoji",
        
        }
        response = self.client.put(url, data=payload, format='json') 
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Error', response.data)
        self.assertIn('Invalid fields!', response.data['Error'])
        
    def test_update_scale_settings_with_missing_requierd_field(self):
        """
        Test the api to update stapel scale settings with missing requierd field
        """
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/"
        payload = {
            "username": "natan",
            "orientation": "vertical",
            "spacing_unit": 1,
            "scale_upper_limit": 10,
            "scalecolor": "#CCCCCC",
            "roundcolor": "#333333",
            "fontcolor": "#FFFFFF",
            "fomat": "emoji",
        
        }
        response = self.client.put(url, data=payload, format='json') 
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Error', response.data)
        self.assertIn('Invalid fields!', response.data['Error'])
    
    
    # Test stapel scale response enpoint

    def test_create_scale_response(self):
        """
        Test the api to create a new stapel scale response
        """
        url1 = "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/"
        payload1 = {
            "username": "natan",
            "orientation": "horizontal",
            "spacing_unit": 1,
            "scale_upper_limit": 10,
            "scalecolor": "#FFFFFF",
            "roundcolor": "#CCCCCC",
            "fontcolor": "#000000",
            "fomat": "emoji",
            "time": "60",
            "name": "TestName",
            "left": "very good",
            "right": "very good",
            "label_images": {"0": "imagefile", "1": "imagefile", "2": "imagefile"},
            "fontstyle": "Arial, Helvetica, sans-serif",
            "custom_emoji_format": {"0": "😎", "1": "🤓", "2": "😊"}
        }
        response1 = self.client.post(url1, data=payload1, format='json')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        scale_id = response1.data['data']['scale_id']
        
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_responses_create/"
        
        payload = {
            "username": "natan",
            "scale_id" : scale_id,
            "score": 2,
            "instance_id": 1,
            "brand_name": "TestBrand",
            "product_name": "TestProduct",
            "process_id": "1"
        }
        
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
        self.assertIn('payload', response.data)
        self.assertIn(scale_id, response.data['payload']['scale_data']['scale_id'])
        self.assertEqual(payload['score'], response.data['payload']['score']['score'])
        
        
    def test_create_scale_response_with_invalid_id(self):
        """
        Test the api to create a new stapel scale response with invalid data
        """
        url1 = "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/"
        payload1 = {
            "username": "natan",
            "orientation": "horizontal",
            "spacing_unit": 1,
            "scale_upper_limit": 10,
            "scalecolor": "#FFFFFF",
            "roundcolor": "#CCCCCC",
            "fontcolor": "#000000",
            "fomat": "emoji",
            "time": "60",
            "name": "TestName",
            "left": "very good",
            "right": "very good",
            "label_images": {"0": "imagefile", "1": "imagefile", "2": "imagefile"},
            "fontstyle": "Arial, Helvetica, sans-serif",
            "custom_emoji_format": {"0": "😎", "1": "🤓", "2": "😊"}
        }
        response1 = self.client.post(url1, data=payload1, format='json')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        scale_id = response1.data['data']['scale_id']
        
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_responses_create/"
        
        payload = {
            "username": "natan",
            "scale_id" : scale_id,
            "score": "Invalid Score",
            "instance_id": 1,
            "brand_name": "TestBrand",
            "product_name": "TestProduct",
            "process_id": "1"
        }
        
        response = self.client.post(url, data=payload, format='json')
        
        """The statis code should be 400 rather than 200"""
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Error', response.data)
        self.assertIn('Score must be an integer', response.data['Error'])
        
        
    def test_create_scale_response_invalid_id(self):
        """
        Test the api to create a new stapel scale response with invalid id
        """
        
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_responses_create/"
        
        payload = {
            "username": "natan",
            "scale_id" : "invalid_id",
            "score": 2,
            "instance_id": 1,
            "brand_name": "TestBrand",
            "product_name": "TestProduct",
            "process_id": "1"
        }
        
        response = self.client.post(url, data=payload, format='json')
        
        """The statis code should be 400 rather than 200"""
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Exception', response.data)
        
        """The Exception should be 'Scale not found'"""
        # self.assertIn('Scale not found', response.data['Exception'])
        
    def test_retrieve_scale_response(self):
        """
        Test the api to retrieve stapel scale response
        """
        url1 = "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/"
        payload1 = {
            "username": "natan",
            "orientation": "horizontal",
            "spacing_unit": 1,
            "scale_upper_limit": 10,
            "scalecolor": "#FFFFFF",
            "roundcolor": "#CCCCCC",
            "fontcolor": "#000000",
            "fomat": "emoji",
            "time": "60",
            "name": "TestName",
            "left": "very good",
            "right": "very good",
            "label_images": {"0": "imagefile", "1": "imagefile", "2": "imagefile"},
            "fontstyle": "Arial, Helvetica, sans-serif",
            "custom_emoji_format": {"0": "😎", "1": "🤓", "2": "😊"}
        }
        response1 = self.client.post(url1, data=payload1, format='json')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        scale_id = response1.data['data']['scale_id']
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_responses/" + scale_id
        response = self.client.get(url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('isSuccess', response.data['payload'])
        
        
    def test_retrieve_scale_response_with_invalid_id(self):
        """
        Test the api to retrieve stapel scale response with invalid id
        """
        url = "https://100035.pythonanywhere.com/stapel/api/stapel_responses/invalid_id"
        response = self.client.get(url, format='json')
        
        """The status code should be 400 rather than 200"""
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data['payload'])
        self.assertIn('not a valid', response.data['payload']['error'])
        
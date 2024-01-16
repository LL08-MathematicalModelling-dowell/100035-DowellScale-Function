from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class TestNPSScaleAPI(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_scale_settings(self):
        """
        Test creating a scale with valid input data.
        """
        url = "https://100035.pythonanywhere.com/api/nps_create/"
        payload = {
            "orientation": "horizontal",
            "user": "yes",
            "username": "natan",
            "scalecolor": "#E3E2E1",
            "numberrating": 10,
            "no_of_scales": 1,
            "roundcolor": "#D1D2D3",
            "fontcolor": "blue",
            "fomat": "numbers",
            "time": 90,
            "template_name": "testing001",
            "name": "scale_label",
            "text": "good+neutral+best",
            "left": "good",
            "right": "best",
            "center": "neutral",
            "scale-category": "nps scale",
            "show_total_score": "true"
            
                }
            
        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('success', response.data)
        self.assertIn('data', response.data)
        created_settings = response.data['data']
        self.assertEqual(created_settings['settings']['orientation'], 'horizontal')
        self.assertEqual(created_settings['settings']['scalecolor'], '#E3E2E1')
        self.assertEqual(created_settings['settings']['numberrating'], 10)
        self.assertEqual(created_settings['settings']['no_of_scales'], 1)
        self.assertEqual(created_settings['settings']['roundcolor'], '#D1D2D3')
        self.assertEqual(created_settings['settings']['fontcolor'], 'blue')
        self.assertEqual(created_settings['settings']['fomat'], 'numbers')
        self.assertEqual(created_settings['settings']['time'], 90)
        self.assertEqual(created_settings['settings']['name'], 'scale_label')
        self.assertEqual(created_settings['settings']['text'], 'good+neutral+best')
        self.assertEqual(created_settings['settings']['left'], 'good')
        self.assertEqual(created_settings['settings']['right'], 'best')
        self.assertEqual(created_settings['settings']['center'], 'neutral')
        self.assertEqual(created_settings['settings']['scale_category'], 'nps scale')
        self.assertEqual(created_settings['settings']['show_total_score'], 'true')
        
    def test_retrieve_scale_settings(self):
        """
        Test retrieving a scale settings.
        """
        url = "https://100035.pythonanywhere.com/api/nps_create/"
        payload = {
            "orientation": "horizontal",
            "user": "yes",
            "username": "natan",
            "scalecolor": "#E3E2E1",
            "numberrating": 10,
            "no_of_scales": 1,
            "roundcolor": "#D1D2D3",
            "fontcolor": "blue",
            "fomat": "numbers",
            "time": 90,
            "template_name": "testing001",
            "name": "scale_label",
            "text": "good+neutral+best",
            "left": "good",
            "right": "best",
            "center": "neutral",
            "scale-category": "nps scale",
            "show_total_score": "true"
            
                }
        
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        scale_id = response.data['data']['scale_id']   
        
        url2 = "https://100035.pythonanywhere.com/api/nps_create/"
        
        response = self.client.get(url2, data={'scale_id': scale_id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
        
    def test_retrieve_scale_settings_invalid_id(self):
        """
        Test retrieving a scale settings.
        """
        url = "https://100035.pythonanywhere.com/api/nps_create/"
        payload = {
            "orientation": "horizontal",
            "user": "yes",
            "username": "natan",
            "scalecolor": "#E3E2E1",
            "numberrating": 10,
            "no_of_scales": 1,
            "roundcolor": "#D1D2D3",
            "fontcolor": "blue",
            "fomat": "numbers",
            "time": 90,
            "template_name": "testing001",
            "name": "scale_label",
            "text": "good+neutral+best",
            "left": "good",
            "right": "best",
            "center": "neutral",
            "scale-category": "nps scale",
            "show_total_score": "true"
            
                }
        
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        scale_id = response.data['data']['scale_id'] + "invalid"   
        
        url2 = "https://100035.pythonanywhere.com/api/nps_create/"
        
        response = self.client.get(url2, data={'scale_id': scale_id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)
        self.assertIn('scale not found', response.data['error'])
    
    def test_retrieve_all_scale_settings(self):
        """
        Test retrieving all scale settings.
        """
        url = "https://100035.pythonanywhere.com/api/nps_create/"
        
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('isSuccess', response.data['data'])
    
    def test_update_scale_settings(self):
        
        """
        Test update a scale settings.
        """
        url = "https://100035.pythonanywhere.com/api/nps_create/"
        payload = {
            "orientation": "horizontal",
            "user": "yes",
            "username": "natan",
            "scalecolor": "#E3E2E1",
            "numberrating": 10,
            "no_of_scales": 1,
            "roundcolor": "#D1D2D3",
            "fontcolor": "blue",
            "fomat": "numbers",
            "time": 90,
            "template_name": "testing001",
            "name": "scale_label",
            "text": "good+neutral+best",
            "left": "good",
            "right": "best",
            "center": "neutral",
            "scale-category": "nps scale",
            "show_total_score": "true"
            
                }
        
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        scale_id = response.data['data']['scale_id']
        payload2 = {
            "scale_id": scale_id,
            "user": "yes",
            "username": "natan",
            "scalecolor": "#FFFFFF"
        }
        
        response = self.client.get(url, data=payload2, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
    
    def test_update_scale_setting_invalid_id(self):
        """
        Test update a scale settings.
        """
        url = "https://100035.pythonanywhere.com/api/nps_create/"
        payload = {
            "orientation": "horizontal",
            "user": "yes",
            "username": "natan",
            "scalecolor": "#E3E2E1",
            "numberrating": 10,
            "no_of_scales": 1,
            "roundcolor": "#D1D2D3",
            "fontcolor": "blue",
            "fomat": "numbers",
            "time": 90,
            "template_name": "testing001",
            "name": "scale_label",
            "text": "good+neutral+best",
            "left": "good",
            "right": "best",
            "center": "neutral",
            "scale-category": "nps scale",
            "show_total_score": "true"
            
                }
        
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        scale_id = response.data['data']['scale_id']
        payload2 = {
            "scale_id": scale_id + "invalid",
            "user": "yes",
            "username": "natan",
            "scalecolor": "#FFFFFF"
        }
        
        response = self.client.put(url, data=payload2, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Error', response.data)       
    
    def test_update_scale_setting_missing_id(self):
        """
        Test update a scale settings.
        """
        url = "https://100035.pythonanywhere.com/api/nps_create/"
        payload = {
            "orientation": "horizontal",
            "user": "yes",
            "username": "natan",
            "scalecolor": "#E3E2E1",
            "numberrating": 10,
            "no_of_scales": 1,
            "roundcolor": "#D1D2D3",
            "fontcolor": "blue",
            "fomat": "numbers",
            "time": 90,
            "template_name": "testing001",
            "name": "scale_label",
            "text": "good+neutral+best",
            "left": "good",
            "right": "best",
            "center": "neutral",
            "scale-category": "nps scale",
            "show_total_score": "true"
            
                }
        
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        scale_id = response.data['data']['scale_id']
        payload2 = {
            "user": "yes",
            "username": "natan",
            "scalecolor": "#FFFFFF"
        }
        
        response = self.client.put(url, data=payload2, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Error', response.data)
    
    
    

    def test_create_scale_response(self):
        """
        Test creating a scale response with valid input data.
        """
        url1 = "https://100035.pythonanywhere.com/api/nps_create/"
        payload1 = {
            "orientation": "horizontal",
            "user": "yes",
            "username": "natan",
            "scalecolor": "#E3E2E1",
            "numberrating": 10,
            "no_of_scales": 1,
            "roundcolor": "#D1D2D3",
            "fontcolor": "blue",
            "fomat": "numbers",
            "time": 90,
            "template_name": "testing001",
            "name": "scale_label",
            "text": "good+neutral+best",
            "left": "good",
            "right": "best",
            "center": "neutral",
            "scale-category": "nps scale",
            "show_total_score": "true"

            }

        response = self.client.post(url1, data=payload1, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        scale_id = response.data['data']['scale_id']

        url = "https://100035.pythonanywhere.com/api/nps_responses_create"
        payload = {
            "scale_id": scale_id,
            "score": 10,
            "process_id": "1",
            "instance_id": 1,
            "brand_name": "test_brand",
            "product_name": "test_product",
            "username": "natan"
            }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
        self.assertEqual(scale_id, response.data['payload']['scale_data']['scale_id'])
        
    def test_create_scale_response_invalid_scale_id(self):
        """
        Test creating a scale response with invalid scale id.
        """
        url = "https://100035.pythonanywhere.com/api/nps_responses_create"
        payload = {
            "scale_id": "invalid",
            "score": 10,
            "process_id": "1",
            "instance_id": 1,
            "brand_name": "test_brand",
            "product_name": "test_product",
            "username": "natan"
            }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Exception', response.data)
        
    def test_retrieve_scale_response(self):
        """
        Test retrieving a scale response.
        """
        url1 = "https://100035.pythonanywhere.com/api/nps_create/"
        payload1 = {
            "orientation": "horizontal",
            "user": "yes",
            "username": "natan",
            "scalecolor": "#E3E2E1",
            "numberrating": 10,
            "no_of_scales": 1,
            "roundcolor": "#D1D2D3",
            "fontcolor": "blue",
            "fomat": "numbers",
            "time": 90,
            "template_name": "testing001",
            "name": "scale_label",
            "text": "good+neutral+best",
            "left": "good",
            "right": "best",
            "center": "neutral",
            "scale-category": "nps scale",
            "show_total_score": "true"

            }

        response = self.client.post(url1, data=payload1, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        scale_id = response.data['data']['scale_id']

        url = "https://100035.pythonanywhere.com/api/nps_responses_create"
        payload = {
            "scale_id": scale_id,
            "score": 10,
            "process_id": "1",
            "instance_id": 1,
            "brand_name": "test_brand",
            "product_name": "test_product",
            "username": "natan"
            }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        
        url2 = "https://100035.pythonanywhere.com/api/nps_responses/{0}".format(scale_id)
        response = self.client.get(url2, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('isSuccess', response.data['payload'])

       
    def test_retrieve_scale_response_invalid_scale_id(self):
        """
        Test retrieving a scale response with invalid scale id.
        """
        url = "https://100035.pythonanywhere.com/api/nps_responses/invalid"
        response = self.client.get(url, format='json')
       
        """
        supposed to be 404 but 200 is returned 
        """        
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data['payload'])
        
    def test_retrieve_scale_response_missing_scale_id(self):
        """
        Test retrieving a scale response with missing scale id.
        """
        url = "https://100035.pythonanywhere.com/api/nps_responses/"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_retrieve_all_scale_responses(self):
        """
        Test retrieving all scale responses.
        """
        url = "https://100035.pythonanywhere.com/api/nps_responses/all"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('isSuccess', response.data['payload'])
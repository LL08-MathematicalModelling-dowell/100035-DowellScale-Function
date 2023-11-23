from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class TestQSortScaleAPI(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_scale_settings(self):
        """
        Test creating a scale with valid input data.
        """
        url = reverse('nps:create_scale_settings_api')
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

        self.assertEqual(response.status_code, status.HTTP_200_OK)
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
        self.assertEqual(created_settings['settings']['scale-category'], 'nps scale')
        self.assertEqual(created_settings['settings']['show_total_score'], 'true')
        
    def test_retrieve_scale_settings(self):
        """
        Test retrieving a scale settings.
        """
        url = reverse('nps:scale_settings_api')
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
        
        response = self.client.get(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        scale_id = response.data['data']['_id']
        
        url2 = reverse('nps:single_scale_settings_api')
        
        response = self.client.get(url2, data={'scale_id': scale_id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Response', response.data)
        scale_data = response.data['Response']
        self.assertEqual(scale_data['_id'], scale_id)
        
    
    def test_update_scale_settings(self):
        
        """
        Test update a scale settings.
        """
        url = reverse('nps:scale_settings_api')
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
        
        response = self.client.get(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        scale_id = response.data['data']['_id']
        payload2 = {
            "scale_id": scale_id
            "user": "yes",
            "username": "natan",
            "scalecolor": "#FFFFFF"
        }
        
        response = self.client.get(url, data=payload2, format='json')
        self.assertEqual(response.status_code, ststus.HTTP_200_OK)
        
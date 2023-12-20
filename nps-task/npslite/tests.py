import random
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class TestLikertScaleAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.settings_url = "nps-lite:npslite_create_scale_settings_api"
        self.response_url = "nps-lite:npslite_nps_response_submit_api"

    def test_create_scale(self):
        """
        Test creating a scale with valid input data.
        """
        url = reverse(self.settings_url)
        payload = {
            "user": "natan",
            "question": "What feedback do you have for us?",
            "orientation": "horizontal",
            "scalecolor": "#CCCCCC",
            "fontcolor": "#000000",
            "time": 60,
            "template_name": "temp202",
            "name": "NPSLite Scale",
            "center": "Neutral",
            "left": "Good",
            "right": "Very Good"
            }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        scale_data = response.data["data"]["settings"]
        self.assertEqual(scale_data["orientation"], payload["orientation"])
        self.assertEqual(scale_data["name"], payload["scale_name"])

    def test_create_scale_unauthorized(self):
        """
        Test creating a scale without username.
        """
        url = reverse(self.settings_url)
        payload = {
            "question": "What feedback do you have for us?",
            "orientation": "horizontal",
            "scalecolor": "#CCCCCC",
            "fontcolor": "#000000",
            "time": 60,
            "template_name": "temp202",
            "name": "NPSLite Scale",
            "center": "Neutral",
            "left": "Good",
            "right": "Very Good",
            "no_of_scales": 5
            }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["error"],  "Unauthorized.")

    def test_create_scale_missing_fields(self):
        """
        Test creating a scale with missing required field.
        """
        url = reverse(self.settings_url)
        payload = {
            "user": "natan",
            "question": "What feedback do you have for us?",
            "orientation": "horizontal",
            "scalecolor": "#CCCCCC",
            "fontcolor": "#000000",
            "time": 60,
            "template_name": "temp202",
            "name": "NPSLite Scale",
            "center": "Neutral",
            "left": "Good",
            "right": "Very Good",
            "no_of_scales": 5
            }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "scalecolor missing or mispelt")

    def test_retrieve_scale(self):
        """
        Test retrieving a scale with valid scale_id.
        """
        # Using existing scale ID
        scale_id = '64bfa8c4034a06fd33fc79e9'
        url = reverse(self.settings_url)

        response = self.client.get(f'{url}?scale_id={scale_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("_id", response.data)

    def test_retrieve_scale_invalid_scale_id(self):
        """
        Test retrieving a scale with invalid scale_id.
        """
        # Using non existing scale ID
        scale_id = '64bfa8c4034a06fd33fc79e3'
        url = reverse(self.settings_url)
        response = self.client.get(f'{url}?scale_id={scale_id}')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_all_percent_scale_settings(self):
        """
        Test retrieving all percent_sum scales.
        """
        url = reverse(self.settings_url)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_scale(self):
        """
        Test update scale succesfully.
        """
        url = reverse(self.settings_url)
        payload = {
                "scale_id" : "64bfa8c4034a06fd33fc79e9",
                "center": "Medium",
                "left": "Low",
                "right": "High",
                }
        response = self.client.put(url, data=payload, format='json')
        scale_data = response.data["data"]

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(scale_data['center'], payload['center'])
        self.assertEqual(scale_data['left'], payload['left'])
        self.assertEqual(scale_data['right'], payload['right'])

    def test_update_scale_missing_scale_id(self):
        """
        Test update scale with scale_id missing in payload.
        """
        url = reverse(self.settings_url)
        payload = {
                "center": "Medium",
                "left": "Low",
                "right": "High",
                }
        response = self.client.put(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "scale_id missing or mispelt")

    def test_update_scale_invalid_id(self):
        """
        Test updating a scale with an invalid ID.
        """
        # Using non existent scale ID
        scale_id = '64a67ea5cba05170y85d4eb0'
        url = reverse(self.settings_url)
        payload = {
                "scale_id" : "64bfa8c4034a06fd33fc79e3",
                "center": "Medium",
                "left": "Low",
                "right": "High",
                }

        response = self.client.put(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_scale_response_succes(self):
        url = reverse(self.response_url)
        payload = {
                    "user": "natan",
                    "scale_id": "64bfa8c4034a06fd33fc79e9",
                    "event_id": "169028218037707",
                    "scale_category": "npslite scale",
                    "response": "9"
                    }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('response_id', response.data)

    def test_create_scale_response_for_non_existent_scale(self):
        url = reverse(self.response_url)
        payload = {
                    "user": "natan",
                    "scale_id": "64bfa8c4034a06fd33fc79e5",
                    "event_id": "169028218037707",
                    "scale_category": "npslite scale",
                    "response": "9"
                    }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual("Scale does not exist", response.data["Error"])

    def test_fetch_scale_response_by_id(self):
        scale_id = "64bfaf7f6433d81bcaea3052"
        url = reverse(self.response_url)
        response = self.client.get(f'{url}?scale_id={scale_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("_id", response.data["data"])
    

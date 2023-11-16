from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class TestLikertScaleAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.settings_url = "thurstone:thurstone_settings"
        self.response_url = "thurstone:thurstone_response"

    def test_create_scale(self):
        """
        Test creating a scale with valid input data.
        """
        url = reverse(self.settings_url)
        payload = {
                    "username" : "pfactorial",
                    "time" : 100,
                    "scale_color" : "#0000",
                    "fontstyle" : "Arial, Helvetica, sans-serif",
                    "fontcolor" : "#C5GFW8",
                    "scale_name" : "testscale1",
                    "no_of_scale" : 1,
                    "allow_resp" : "true",
                    "topic" : "Elmet Research",
                    "statement_count" : 3,
                    "statements" : [[2,"Elmet is a good product"], [0,"I will recommed Elmet to friends"], [1,"Elmet customer service is helpful"]],
                    "sorting_order" : "custom",
                    "percentage_accuracy" : 80  
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        scale_data = response.data["data"]["settings"]
        self.assertEqual(scale_data["orientation"], payload["orientation"])
        self.assertEqual(scale_data["scale_name"], payload["scale_name"])

    def test_create_scale_unauthorized(self):
        """
        Test creating a scale without username.
        """
        url = reverse(self.settings_url)
        payload = {
                    "time" : 100,
                    "scale_color" : "#0000",
                    "fontstyle" : "Arial, Helvetica, sans-serif",
                    "fontcolor" : "#C5GFW8",
                    "scale_name" : "testscale1",
                    "no_of_scale" : 1,
                    "allow_resp" : "true",
                    "topic" : "Elmet Research",
                    "statement_count" : 3,
                    "statements" : [[2,"Elmet is a good product"], [0,"I will recommed Elmet to friends"], [1,"Elmet customer service is helpful"]],
                    "sorting_order" : "custom",
                    "percentage_accuracy" : 80  
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
                    "username" : "pfactorial",
                    "time" : 100,
                    "scale_color" : "#0000",
                    "fontstyle" : "Arial, Helvetica, sans-serif",
                    "fontcolor" : "#C5GFW8",
                    "scale_name" : "testscale1",
                    "no_of_scale" : 1,
                    "allow_resp" : "true",
                    "topic" : "Elmet Research",
                    "statements" : [[2,"Elmet is a good product"], [0,"I will recommed Elmet to friends"], [1,"Elmet customer service is helpful"]],
                    "sorting_order" : "custom",
                    "percentage_accuracy" : 80  
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "Missing required parameter statement_count")

    def test_create_scale_statement_count_mismatch(self):
        """
        Test creating a scale with mismatch between statement_count and statements.
        """
        url = reverse(self.settings_url)
        payload = {
                    "username" : "pfactorial",
                    "time" : 100,
                    "scale_color" : "#0000",
                    "fontstyle" : "Arial, Helvetica, sans-serif",
                    "fontcolor" : "#C5GFW8",
                    "scale_name" : "testscale1",
                    "no_of_scale" : 1,
                    "allow_resp" : "true",
                    "topic" : "Elmet Research",
                    "statement_count" : 4,
                    "statements" : [[2,"Elmet is a good product"], [0,"I will recommed Elmet to friends"], [1,"Elmet customer service is helpful"]],
                    "sorting_order" : "custom",
                    "percentage_accuracy" : 80  
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "statement count must be equal to length of statements")

    def test_retrieve_scale(self):
        """
        Test retrieving a scale with valid scale_id.
        """
        # Using existing scale ID
        scale_id = '652fcb03727325d534570e60'
        url = reverse(self.settings_url)

        response = self.client.get(f'{url}?scale_id={scale_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("success", response.data)

    def test_retrieve_scale_invalid_scale_id(self):
        """
        Test retrieving a scale with invalid scale_id.
        """
        # Using non existing scale ID
        scale_id = '653fa827hrykiiueaebeb1b342b9f'
        url = reverse(self.settings_url)
        response = self.client.get(f'{url}?scale_id={scale_id}')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_all_scale_settings(self):
        """
        Test retrieving all scales settings.
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
                "scale_id" : "652fcb03727325d534570e60",
                "orientation" : "horizontal",
                "scale_color" : "fffff",
                }
        response = self.client.put(url, data=payload, format='json')
        scale_data = response.data["data"]

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(scale_data['orientation'], payload['orientation'])
        self.assertEqual(scale_data['scale_color'], payload['scale_color'])

    def test_update_scale_missing_scale_id(self):
        """
        Test update scale with scale_id missing in payload.
        """
        url = reverse(self.settings_url)
        payload = {
                "orientation" : "horizontal",
                "scale_color" : "fffff",
                }
        response = self.client.put(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "scale_id missing or mispelt")

    def test_update_scale_invalid_id(self):
        """
        Test updating a scale with an invalid ID.
        """
        # Using non existent scale ID
        scale_id = '653fa827grhfaebeb1b342b9f'
        url = reverse(self.settings_url)
        payload = {
                "scale_id" : scale_id,
                "orientation" : "horizontal",
                "scale_color" : "fffff",
                }

        response = self.client.put(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_scale_response_success(self):
        url = reverse(self.response_url)
        payload = {
                    "scale_id": "653b6c9d38ec7dcbdb556c1d",
                    "username": "natan",
                    "instance_id": 1,
                    "brand_name": "Brand XYZ",
                    "statements": [    
                        { "1": "Elmet customer service is helpful", "score": 11 },
                        { "2": "Elmet is a good product", "score": 3 },
                        { "3": "I will recommed elmet to friends", "score": 10 }
                ]
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("response_id", response.data)

    def test_create_scale_response_missing_fields(self):
        url = reverse(self.response_url)
        payload = {
                    "scale_id": "653b6c9d38ec7dcbdb556c1d",
                    "instance_id": 1,
                    "brand_name": "Brand XYZ",
                    "statements": [    
                        { "1": "Elmet customer service is helpful", "score": 11 },
                        { "2": "Elmet is a good product", "score": 3 },
                        { "3": "I will recommed elmet to friends", "score": 10 }
                ]
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Missing required parameter username", response.data["error"])

    def test_create_scale_response_for_non_existent_scale(self):
        url = reverse(self.response_url)
        payload = {
                    "scale_id": "653b6c9d38ec7dcbdbc1d",
                    "username": "natan",
                    "instance_id": 1,
                    "brand_name": "Brand XYZ",
                    "statements": [    
                        { "1": "Elmet customer service is helpful", "score": 11 },
                        { "2": "Elmet is a good product", "score": 3 },
                        { "3": "I will recommed elmet to friends", "score": 10 }
                ]
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Scale does not exist", response.data["Error"])

    def test_fetch_scale_response_by_id(self):
        scale_id = "653118cb406f2c7f2fb37555"
        url = reverse(self.response_url)
        response = self.client.get(f'{url}?scale_id={scale_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


import random
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class TestPercentScaleApi(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.settings_url = "percent:percent_create_scale_settings_api"
        self.response_url = "percent:percent_percent_response_submit_api"
        
    def test_create_scale(self):
        """
        Test creating a scale with valid input data.
        """
        url = reverse(self.settings_url)
        payload = {
                    "username" : "pfactorial",
                    "time" : 100,
                    "scale_name" : "envue 2 scale",
                    "no_of_scale" : 1,
                    "orientation" : "vertical",
                    "scale_color" : "ffff",
                    "product_count" : 3,
                    "product_names" : ["brand2", "brand4", "brand5"],
                    "user" : "yes"
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
                    "time" : 100,
                    "scale_name" : "envue 2 scale",
                    "no_of_scale" : 1,
                    "orientation" : "vertical",
                    "scale_color" : "ffff",
                    "product_count" : 3,
                    "product_names" : ["brand2", "brand4", "brand5"],
                    "user" : "yes"
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
                    "scale_name" : "envue 2 scale",
                    "no_of_scale" : 1,
                    "orientation" : "vertical",
                    "scale_color" : "ffff",
                    "product_names" : ["brand2", "brand4", "brand5"],
                    "user" : "yes"
                    }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "product_count missing or mispelt")

    def test_create_scale_product_count_mismatch(self):
        """
        Test creating a scale with mismatch between product_count and product_names.
        """
        url = reverse(self.settings_url)
        payload = {
                    "username" : "pfactorial",
                    "time" : 100,
                    "scale_name" : "envue 2 scale",
                    "no_of_scale" : 1,
                    "orientation" : "vertical",
                    "scale_color" : "ffff",
                    "product_count" : 2,
                    "product_names" : ["brand2", "brand4", "brand5"],
                    "user" : "yes"
                    }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "Product count and number of product names count should be same")

    def test_create_scale_duplicate_product_names(self):
        url = reverse(self.settings_url)
        payload = {
                    "username" : "pfactorial",
                    "time" : 100,
                    "scale_name" : "envue 2 scale",
                    "no_of_scale" : 1,
                    "orientation" : "vertical",
                    "scale_color" : "ffff",
                    "product_count" : 3,
                    "product_names" : ["brand2", "brand2", "brand5"],
                    "user" : "yes"
                    }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "Product names must be unique")

    def test_retrieve_scale(self):
        """
        Test retrieving a scale with valid scale_id.
        """
        # Using existing scale ID
        scale_id = '64c233ea77ab65c89c13f227'
        url = reverse(self.settings_url)

        response = self.client.get(f'{url}?scale_id={scale_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("_id", response.data)

    def test_retrieve_scale_invalid_scale_id(self):
        """
        Test retrieving a scale with invalid scale_id.
        """
        # Using non existing scale ID
        scale_id = '653fa827hrykiiueaebeb1b342b9f'
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
                "scale_id" : "64c233ea77ab65c89c13f227",
                "orientation" : "horizontal",
                "scale_color" : "fffff",
                "product_count" : 1,
                "product_names" : ["brand3"]
                }
        response = self.client.put(url, data=payload, format='json')
        scale_data = response.data["data"]

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(scale_data['orientation'], payload['orientation'])
        self.assertEqual(scale_data['scale_color'], payload['scale_color'])
        self.assertEqual(scale_data['product_names'], payload['product_names'])

    def test_update_scale_missing_scale_id(self):
        """
        Test update scale with scale_id missing in payload.
        """
        url = reverse(self.settings_url)
        payload = {
                "orientation" : "horizontal",
                "scale_color" : "fffff",
                "product_count" : 1,
                "product_names" : ["brand3"]
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
                "scale_id" : "64c233ea78ab65c89c13f227",
                "orientation" : "horizontal",
                "scale_color" : "fffff",
                "product_count" : 1,
                "product_names" : ["brand3"]
                }

        response = self.client.put(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_scale_response_with_incorrect_number_of_scores(self):
        url = reverse(self.response_url)
        payload = {
                    "score": [30, 60, 90],
                    "scale_id": "64c233ea77ab65c89c13f227",
                    "username": f"natan{random.randint(0,1000)}",
                    "instance_id": "2",
                    "process_id": "1",
                    "brand_name": "ella",
                    "product_name": "testprod"                    
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual('Incorrect number of responses.', response.data["error"])

    def test_create_scale_response_with_score_greater_than_100(self):
        url = reverse(self.response_url)
        payload = {
                    "score": [120],
                    "scale_id": "64c233ea77ab65c89c13f227",
                    "username": f"natan{random.randint(0,1000)}",
                    "instance_id": "2",
                    "process_id": "1",
                    "brand_name": "ella",
                    "product_name": "testprod"                    
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual('Invalid response.', response.data["error"])

    def test_create_scale_response_succes(self):
        url = reverse(self.response_url)
        payload = {
                    "score": [40],
                    "scale_id": "64c233ea77ab65c89c13f227",
                    "username": f"natan{random.randint(0,1000)}",
                    "instance_id": "2",
                    "process_id": "1",
                    "brand_name": "ella",
                    "product_name": "testprod"                    
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('response_id', response.data)

    def test_create_scale_response_for_non_existent_scale(self):
        url = reverse(self.response_url)
        payload = {
                    "score":[30, 60, 90],
                    "scale_id": "650be48df801e87c9a43132b",
                    "username": f"natan{random.randint(0,1000)}",
                    "instance_id": "2",
                    "process_id": "1",
                    "brand_name": "ella",
                    "product_name": "testprod"
                    
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual("Scale does not exist", response.data["Error"])

    def test_fetch_scale_response_by_id(self):
        scale_id = "64ccb6bff1a077b2acb4efe8"
        url = reverse(self.response_url)
        response = self.client.get(f'{url}?scale_id={scale_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("_id", response.data["data"])
     

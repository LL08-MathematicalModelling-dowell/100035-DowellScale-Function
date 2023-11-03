from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class TestLikertScaleAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.settings_url = "percent_sum:settings_api_view_create"
        self.response_url = "percent_sum:percent_sum_response_submit"

    def test_create_scale(self):
        """
        Test creating a scale with valid input data.
        """
        url = reverse(self.settings_url)
        payload = {
                "username" : "pfactorial",
                "time" : 100,
                "scale_name" : "envue 2 scale",
                "no_of_scales" : 1,
                "orientation" : "vertical",
                "scale_color" : "ffff",
                "product_count" : 3,
                "product_names" : ["brand2", "brand4", "brand5"],
                "user" : "yes",
                "no_of_scale" : 2
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
                "scale_name" : "envue 2 scale",
                "no_of_scales" : 1,
                "orientation" : "vertical",
                "scale_color" : "ffff",
                "product_count" : 3,
                "product_names" : ["brand2", "brand4", "brand5"],
                "user" : "yes",
                "no_of_scale" : 2
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
                "no_of_scales" : 1,
                "orientation" : "vertical",
                "scale_color" : "ffff",
                # Missing required field: product_count
                "product_names" : ["brand2", "brand4", "brand5"],
                "user" : "yes",
                "no_of_scale" : 2
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "Missing required parameter product_count")

    def test_create_scale_invalid_product_count(self):
        """
        Test creating a scale with invalid number of products.
        """
        url = reverse(self.settings_url)
        payload = {
                "username" : "pfactorial",
                "time" : 100,
                "scale_name" : "envue 2 scale",
                "no_of_scales" : 1,
                "orientation" : "vertical",
                "scale_color" : "ffff",
                # Invalid product_count
                "product_count" : 1,
                "product_names" : ["brand2"],
                "user" : "yes",
                "no_of_scale" : 2
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "Product count should be between 2 to 10")

    def test_create_scale_product_count_mismatch(self):
        """
        Test creating a scale with mismatch between product_count and product_names.
        """
        url = reverse(self.settings_url)
        payload = {
                "username" : "pfactorial",
                "time" : 100,
                "scale_name" : "envue 2 scale",
                "no_of_scales" : 1,
                "orientation" : "vertical",
                "scale_color" : "ffff",
                # Mismatch between product_count and length of product_names
                "product_count" : 2,
                "product_names" : ["brand2", "brand3", "brand4"],
                "user" : "yes",
                "no_of_scale" : 2
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
                "no_of_scales" : 1,
                "orientation" : "vertical",
                "scale_color" : "ffff",
                "product_count" : 2,
                # Duplicate product_names
                "product_names" : ["brand2", "brand2"],
                "user" : "yes",
                "no_of_scale" : 2
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "Product names must be unique")

    def test_retrieve_scale(self):
        """
        Test retrieving a scale with valid scale_id.
        """
        # Using existing scale ID
        scale_id = '64a6b2c00b4945419035af18'
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

    def test_retrieve_all_percent_sum_scale_settings(self):
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
                "scale_id" : "64a67ea5cba05170f85d4eb0",
                "orientation" : "horizontal",
                "scale_color" : "fffff",
                "product_count" : 2,
                "product_names" : ["brand3", "brand5"]
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
                # scale_id missing in payload
                "orientation" : "horizontal",
                "scale_color" : "fffff",
                "product_count" : 2,
                "product_names" : ["brand3", "brand5"]
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
                "product_count" : 2,
                "product_names" : ["brand3", "brand5"]
                }

        response = self.client.put(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        
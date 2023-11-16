from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class TestLikertScaleAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.settings_url = "paired-comparison:paired_comparison_scale_settings"
        self.response_url = "paired-comparison:paired_comparison_scale_responses"

    def test_create_scale(self):
        """
        Test creating a scale with valid input data.
        """
        url = reverse(self.settings_url)
        payload = {
                "username":"pfactorial",
                "scale_name":"scale6",
                "orientation":"horizontal",
                "fontcolor":"#4a4a4a",
                "fontstyle":"sans",
                "scalecolor":"#hde34c",
                "roundcolor":"fffff",
                "time":100,
                "item_count":4,
                "item_list": ["coke", "fanta", "malt", "sprite"]
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
                "scale_name":"scale6",
                "orientation":"horizontal",
                "fontcolor":"#4a4a4a",
                "fontstyle":"sans",
                "scalecolor":"#hde34c",
                "roundcolor":"fffff",
                "time":100,
                "item_count":4,
                "item_list": ["coke", "fanta", "malt", "sprite"]
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
                "username":"pfactorial",
                "scale_name":"scale6",
                "orientation":"horizontal",
                "fontcolor":"#4a4a4a",
                "fontstyle":"sans",
                "scalecolor":"#hde34c",
                "roundcolor":"fffff",
                "time":100,
                "item_list": ["coke", "fanta", "malt", "sprite"]
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "Missing required parameter item_count")

    def test_create_scale_item_count_mismatch(self):
        """
        Test creating a scale with mismatch between item_count and item_list.
        """
        url = reverse(self.settings_url)
        payload = {
                "username":"pfactorial",
                "scale_name":"scale6",
                "orientation":"horizontal",
                "fontcolor":"#4a4a4a",
                "fontstyle":"sans",
                "scalecolor":"#hde34c",
                "roundcolor":"fffff",
                "time":100,
                "item_count":3,
                "item_list": ["coke", "fanta", "malt", "sprite"]
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "item count does not match length of item list")

    def test_create_scale_invalid_product_count(self):
        """
        Test creating a scale with invalid number of products.
        """
        url = reverse(self.settings_url)
        payload = {
                "username":"pfactorial",
                "scale_name":"scale6",
                "orientation":"horizontal",
                "fontcolor":"#4a4a4a",
                "fontstyle":"sans",
                "scalecolor":"#hde34c",
                "roundcolor":"fffff",
                "time":100,
                "item_count":1,
                "item_list": ["sprite"]
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "2 or more items needed for paired comparison scale.")

    def test_retrieve_scale(self):
        """
        Test retrieving a scale with valid scale_id.
        """
        # Using existing scale ID
        scale_id = '6525cb40d274abb7aa1ee7c6'
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
                "scale_id" : "6525cb40d274abb7aa1ee7c6",
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
                    "username" : "pfactorial09",
                    "scale_id" : "64d633f2f74c77f2b88e2b99",
                    "brand_name" : "envue",
                    "process_id" : "1",
                    "product_name" : "workflow_AI",
                    "products_ranking" : ["A","A","A","A","B","B","B","C","C","D"]
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("response_id", response.data)

    def test_create_scale_response_missing_fields(self):
        url = reverse(self.response_url)
        payload = {
                    "scale_id" : "64d633f2f74c77f2b88e2b99",
                    "brand_name" : "envue",
                    "process_id" : "1",
                    "product_name" : "workflow_AI",
                    "products_ranking" : ["A","A","A","A","B","B","B","C","C","D"]
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Missing required parameter username", response.data["error"])

    def test_create_scale_response_for_non_existent_scale(self):
        url = reverse(self.response_url)
        payload = {
                    "username" : "pfactorial09",
                    "scale_id" : "64d633f2c77f2b88e2b99",
                    "brand_name" : "envue",
                    "process_id" : "1",
                    "product_name" : "workflow_AI",
                    "products_ranking" : ["A","A","A","A","B","B","B","C","C","D"]
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Scale does not exist", response.data["Error"])

    def test_fetch_scale_response_by_id(self):
        scale_id = "64d63ca2be7f305101fc2beb"
        url = reverse(self.response_url)
        response = self.client.get(f'{url}?scale_id={scale_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


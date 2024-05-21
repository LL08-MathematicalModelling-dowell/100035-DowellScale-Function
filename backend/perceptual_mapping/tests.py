from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class PerceptualMappingScaleAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.settings_url = "perceptual-mapping:perceptual_maping_scale_settings"
        self.response_url = "perceptual-mapping:perceptual_mapping_response"

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
                    "item_list" : ["prodcut1", "product2"],
                    "item_count" : 2,
                    "X_upper_limit" : 5,
                    "Y_upper_limit" : 4,
                    "X_left" : "slow",
                    "X_right" : "fast",
                    "Y_top" : "expensive",
                    "Y_bottom" : "cheap",
                    "marker_type" : "dot",
                    "marker_color" : "#0000",
                    "X_spacing" : 2,
                    "Y_spacing" : 2
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        scale_data = response.data["data"]["settings"]
        self.assertEqual(scale_data["item_count"], payload["item_count"])
        self.assertEqual(scale_data["marker_type"], payload["marker_type"])

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
                    "item_list" : ["prodcut1", "product2"],
                    "item_count" : 2,
                    "X_upper_limit" : 5,
                    "Y_upper_limit" : 4,
                    "X_left" : "slow",
                    "X_right" : "fast",
                    "Y_top" : "expensive",
                    "Y_bottom" : "cheap",
                    "marker_type" : "dot",
                    "marker_color" : "#0000",
                    "X_spacing" : 2,
                    "Y_spacing" : 2
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
                    "item_count" : 2,
                    "X_upper_limit" : 5,
                    "Y_upper_limit" : 4,
                    "X_left" : "slow",
                    "X_right" : "fast",
                    "Y_top" : "expensive",
                    "Y_bottom" : "cheap",
                    "marker_type" : "dot",
                    "marker_color" : "#0000",
                    "X_spacing" : 2,
                    "Y_spacing" : 2
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "item_list missing or mispelt")

    def test_create_scale_statement_count_mismatch(self):
        """
        Test creating a scale with mismatch between item_count and item_list.
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
                    "item_list" : ["prodcut1", "product2"],
                    "item_count" : 4,
                    "X_upper_limit" : 5,
                    "Y_upper_limit" : 4,
                    "X_left" : "slow",
                    "X_right" : "fast",
                    "Y_top" : "expensive",
                    "Y_bottom" : "cheap",
                    "marker_type" : "dot",
                    "marker_color" : "#0000",
                    "X_spacing" : 2,
                    "Y_spacing" : 2
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "item_count must be equal to length of item_list")

    def test_create_scale_statement_upper_limit_out_of_bounds(self):
        """
        Test creating a scale with upper limit out of bounds
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
                    "item_list" : ["prodcut1", "product2"],
                    "item_count" : 2,
                    "X_upper_limit" : 120,
                    "Y_upper_limit" : 4,
                    "X_left" : "slow",
                    "X_right" : "fast",
                    "Y_top" : "expensive",
                    "Y_bottom" : "cheap",
                    "marker_type" : "dot",
                    "marker_color" : "#0000",
                    "X_spacing" : 2,
                    "Y_spacing" : 2
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "X_upper_limit and Y_upper_limit must be between 1 and 100")

    def test_create_scale_statement_spacing_out_of_bounds(self):
        """
        Test creating a scale with mismatch between upper limit out of bounds
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
                    "item_list" : ["prodcut1", "product2"],
                    "item_count" : 2,
                    "X_upper_limit" : 5,
                    "Y_upper_limit" : 4,
                    "X_left" : "slow",
                    "X_right" : "fast",
                    "Y_top" : "expensive",
                    "Y_bottom" : "cheap",
                    "marker_type" : "dot",
                    "marker_color" : "#0000",
                    "X_spacing" : 55,
                    "Y_spacing" : 2
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "X_spacing and Y_spacing must be between 1 and 50")

    def test_retrieve_scale(self):
        """
        Test retrieving a scale with valid scale_id.
        """
        # Using existing scale ID
        scale_id = '651ab8ba0985da4a4741d3d7'
        url = reverse(self.settings_url)

        response = self.client.get(f'{url}?scale_id={scale_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("success", response.data)

    def test_retrieve_scale_invalid_scale_id(self):
        """
        Test retrieving a scale with invalid scale_id.
        """
        # Using non existing scale ID
        scale_id = '651ab8ba0985da4a4841d3d7'
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
                    "scale_id" : "651ab8ba0985da4a4741d3d7",
                    "marker_type" : "cross",
                    "marker_color" : "#ffff",
                }
        response = self.client.put(url, data=payload, format='json')
        scale_data = response.data["data"]

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(scale_data["marker_type"], payload["marker_type"])
        self.assertEqual(scale_data["marker_color"], payload["marker_color"])

    def test_update_scale_missing_scale_id(self):
        """
        Test update scale with scale_id missing in payload.
        """
        url = reverse(self.settings_url)
        payload = {
                    "marker_type" : "cross",
                    "marker_color" : "#ffff",
                }
        response = self.client.put(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"],  "scale_id missing or mispelt")

    def test_update_scale_invalid_id(self):
        """
        Test updating a scale with an invalid ID.
        """
        # Using non existent scale ID
        scale_id = '651ab8ba0885da4a4741d3d7'
        url = reverse(self.settings_url)
        payload = {
                "scale_id" : scale_id,
                    "marker_type" : "cross",
                    "marker_color" : "#ffff",
                }

        response = self.client.put(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_scale_response_success(self):
        url = reverse(self.response_url)
        payload = {
                    "username": "natan",
                    "instance_id": 1,
                    "process_id": "1",
                    "brand_name": "SAMSUNG",
                    "product_name": "Galaxy Z Flip5",
                    "scale_id": "656045d85185b5aa8a50d717",
                    "positions": {
                            "itemA": [2, -2],
                            "itemB": [-2, 2],
                        }
                    }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)

    def test_create_scale_response_missing_fields(self):
        url = reverse(self.response_url)
        payload = {
                    "instance_id": 1,
                    "process_id": "1",
                    "brand_name": "SAMSUNG",
                    "product_name": "Galaxy Z Flip5",
                    "scale_id": "656045d85185b5aa8a50d717",
                    "positions": {
                            "itemA": [2, -2],
                            "itemB": [-2, 2],
                        }
                    }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Unauthorized.", response.data["error"])

    def test_create_scale_response_for_non_existent_scale(self):
        url = reverse(self.response_url)
        payload = {
                    "username": "natan",
                    "instance_id": 1,
                    "process_id": "1",
                    "brand_name": "SAMSUNG",
                    "product_name": "Galaxy Z Flip5",
                    "scale_id": "656045d85185b5aa8a50d718",
                    "positions": {
                            "itemA": [2, -2],
                            "itemB": [-2, 2],
                        }
                    }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual("Scale does not exist.", response.data["Error"])

    def test_fetch_scale_response_by_id(self):
        scale_id = "6560485731e1653c2d250ca2"
        url = reverse(self.response_url)
        response = self.client.get(f'{url}?scale_id={scale_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)


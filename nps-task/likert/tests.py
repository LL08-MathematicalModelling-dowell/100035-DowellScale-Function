from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class TestLikertScaleAPI(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_scale(self):
        """
        Test creating a scale with valid input data.
        """
        url = reverse("likert:settings_api_view_create")
        payload = {
                    "username" : "pfactorial",
                    "orientation": "vertical",
                    "font_color": "#4a4a4a",
                    "no_of_scales": 1,
                    "instance_id": 1,
                    "fontstyle": "Aria",
                    "time": 100,
                    "scale_name": "uv_scale",
                    "user": "yes",
                    "round_color": "fffff",
                    "scale_color": "#0000",
                    "fomat": "emoji",
                    "label_scale_selection": 2,
                    "label_scale_input": [
                        "😀",
                        "😃"
                    ],
                    "custom_emoji_format": {
                        "0": "😀",
                        "1": "😃"
                    }
                }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        scale_data = response.data["data"]["settings"]
        self.assertEqual(scale_data["orientation"], payload["orientation"])

    def test_create_scale_missing_fields(self):
        """
        Test creating a scale with missing required fields.
        """
        url = reverse("likert:settings_api_view_create")
        payload = {
                "username" : "pfactorial",
                "orientation": "vertical",
                "font_color": "#4a4a4a",
                "no_of_scales": 1,
                "instance_id": 1,
                "fontstyle": "Aria",
                "time": 100,
                "scale_name": "uv_scale",
                "scale_color": "#0000",
                "user": "yes",
                "round_color": "fffff",
                "fomat": "emoji",
                # Missing required field: label_selection
                "label_scale_input": [
                    "😀",
                    "😃"
                ],
                "custom_emoji_format": {
                    "0": "😀",
                    "1": "😃"
                }
            }
        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("label_scale_selection missing or mispelt", response.data["error"])

    def test_create_scale_invalid_field_values(self):
        """
        Test creating a scale with invalid field values.
        """
        url = reverse("likert:settings_api_view_create")
        payload = {
                    "username" : "pfactorial",
                    "orientation": "vertical",
                    "font_color": "#4a4a4a",
                    "no_of_scales": 1,
                    "instance_id": 1,
                    "fontstyle": "Aria",
                    "time": 100,
                    "scale_name": "uv_scale",
                    "scale_color": "#0000",
                    "user": "yes",
                    "round_color": "fffff",
                    # Invalid fomat field
                    "fomat": "string",
                    "label_scale_selection": 2,
                    "label_scale_input": [
                        "😀",
                        "😃"
                    ],
                    "custom_emoji_format": {
                        "0": "😀",
                        "1": "😃"
                    }
                }

        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Label type should be text or emoji", response.data["error"])

    def test_retrieve_scale(self):
        """
        Test retrieving a scale by its ID.
        """
        # Using existing scale ID
        scale_id = '653fa827a0eaebeb1b342b9f'
        url = reverse('likert:settings_api_view_create')

        response = self.client.get(f'{url}?scale_id={scale_id}')
        # scale_data = response.data['Response']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("success", response.data)

    def test_retrieve_scale_invalid_id(self):
        """
        Test retrieving a scale with an invalid ID.
        """
        # Using non existing scale ID
        scale_id = '653fa827hrykiiueaebeb1b342b9f'
        url = reverse('likert:settings_api_view_create')

        response = self.client.get(f'{url}?scale_id={scale_id}')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_scale(self):
        
        url = reverse('likert:settings_api_view_create')        
        """
        Test updating a scale with valid input data.
        """
        # Assuming an existing scale ID
        payload = {
            'scale_id': "653fa827a0eaebeb1b342b9f",
            'orientation': 'horizontal',
            'fontstyle': 'Verdana',
            'font_color': '#000000',
        }

        response = self.client.put(url, data=payload, format='json')
        scale_data = response.data["data"]

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(scale_data['orientation'], payload['orientation'])
        self.assertEqual(scale_data['fontstyle'], payload['fontstyle'])
        self.assertEqual(scale_data['font_color'], payload['font_color'])

    def test_update_scale_invalid_id(self):
        """
        Test updating a scale with an invalid ID.
"""
        # Using non existent scale ID
        scale_id = '653fa827grhfaebeb1b342b9f'
        url = reverse('likert:settings_api_view_create')
        payload = {
            'scale_id': scale_id,
            'orientation': 'horizontal',
            'fontstyle': 'Verdana',
            'font_color': '#000000',
        }

        response = self.client.put(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_scale_missing_field(self):
        """
        Test updating a scale with a missing required field.
        """
        url = reverse('likert:settings_api_view_create')
        payload = {
            'orientation': 'horizontal',
            'fontstyle': 'Verdana',
            'font_color': '#000000',
            # Missing required field: scale_id
        }

        response = self.client.put(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('scale_id missing or mispelt', response.data['error'])




from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class TestQSortScaleAPI(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_scale(self):
        """
        Test creating a scale with valid input data.
        """
        url = reverse('Qsort:createScale')
        payload = {
            'user': 'natan',
            'sort_order': 'random',
            'statements': ['Statement 1', 'Statement 2', 'Statement 3'],
            'product_name': 'Product X',
            'scalecolor': '#000000',
            'fontstyle': 'Arial',
            'fontcolor': '#FFFFFF',
            'name': 'Test Scale'
        }

        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('Response', response.data)
        scale_data = response.data['Response']
      
        self.assertEqual(scale_data['sort_order'], 'random')
        self.assertEqual(scale_data['product_name'], 'Product X')
        self.assertEqual(scale_data['settings']['scalecolor'], '#000000')
        self.assertEqual(scale_data['settings']['fontstyle'], 'Arial')
        self.assertEqual(scale_data['settings']['fontcolor'], '#FFFFFF')

    def test_create_scale_missing_fields(self):
        """
        Test creating a scale with missing required fields.
        """
        url = reverse('Qsort:createScale')
        payload = {
            'user': 'natan',
            'statements': ['Statement 1', 'Statement 2', 'Statement 3'],
            'product_name': 'Product X',
            'scalecolor': '#000000',
            'fontstyle': 'Arial',
            'fontcolor': '#FFFFFF',
            'name': 'Test Scale'
            # Missing required field: sort_order
        }

        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('sort_order', response.data['Error'])

    def test_create_scale_invalid_field_values(self):
        """
        Test creating a scale with invalid field values.
        """
        url = reverse('Qsort:createScale')
        payload = {
            'user': 'natan',
            'sort_order': 'invalid_sort_order',
            'scalecolor': '#CCCCCC',
            'statements': ['Statement 1', 'Statement 2', 'Statement 3'],
            'fontstyle': 'Arial',
            'fontcolor': '#000000',
            'product_name': 'Product X',
            'name': 'Test Scale'
        }

        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('sort_order', response.data['Error'])

    def test_retrieve_scale(self):
        """
        Test retrieving a scale by its ID.
        """
        # Assuming an existing scale ID
        scale_id = '652fcb03727325d534570e60'

        url = reverse('Qsort:createScale')

        response = self.client.get(f'{url}?scale_id={scale_id}')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Response', response.data)

        scale_data = response.data['Response']
        self.assertEqual(scale_data['_id'], scale_id)

    def test_retrieve_scale_invalid_id(self):
        """
        Test retrieving a scale with an invalid ID.
        """
        # Assuming an invalid scale ID
        scale_id = 'invalid_scale_id'

        url = reverse('Qsort:createScale')

        response = self.client.get(f'{url}?scale_id={scale_id}')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_scale(self):
        """
        Test updating a scale with valid input data.
        """
        # Assuming an existing scale ID
        scale_id = '652fcb03727325d534570e60'

        url = reverse('Qsort:createScale')
        payload = {
            'scale_id': scale_id,
            'sort_order': 'alphabetical',
            'scalecolor': '#FFFFFF',
            'fontstyle': 'Verdana',
            'fontcolor': '#000000',
            'product_name': 'Product X'
        }

        response = self.client.put(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Response', response.data)

        scale_data = response.data['Response']
        self.assertEqual(scale_data['scale_id'], scale_id)
        self.assertEqual(scale_data['sort_order'], 'alphabetical')
        self.assertEqual(scale_data['fontstyle'], 'Verdana')
        self.assertEqual(scale_data['fontcolor'], '#000000')
        self.assertEqual(scale_data['product_name'], 'Product X')

    def test_update_scale_invalid_id(self):
        """
        Test updating a scale with an invalid ID.
"""
        # Assuming an invalid scale ID
        scale_id = 'invalid_scale_id'

        url = reverse('Qsort:createScale')
        payload = {
            'scale_id': scale_id,
            'sort_order': 'random',
            'scalecolor': '#FFFFFF',
            'fontstyle': 'Arial',
            'fontcolor': '#000000',
            'product_name': 'Product X'
        }

        response = self.client.put(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_scale_missing_field(self):
        """
        Test updating a scale with a missing required field.
        """
        url = reverse('Qsort:createScale')
        scale_id = ''
        payload = {
            'user': 'natan',
            'sort_order': 'random',
            'statements': ['Statement 1', 'Statement 2', 'Statement 3'],
            'product_name': 'Product X',
            'scalecolor': '#000000',
            'fontstyle': 'Arial',
            'fontcolor': '#FFFFFF',
            'name': 'Test Scale'
            # Missing required field: scale_id
        }

        response = self.client.put(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('scale_id', response.data['Error'])
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class CreateScaleSettingsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_scale_settings_valid_data(self):
        url = reverse('ranking:ranking_create_scale_settings_api')
        payload = {
            'username': 'natan',
            'scalename': 'Scale001',
            'num_of_stages': 5,
            'stages': ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item 1', 'Item 2', 'Item 3'],
            'orientation': 'vertical',
            'scalecolor': '#e6e6e6',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'start_with_zero': True,
            'reference': 'Overall Ranking',
            'display_ranks': True,
        }
        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('settings', response.data['data'])
        self.assertIn('scale_id', response.data)

        created_settings = response.data['data']['settings']
        self.assertEqual(created_settings['username'], payload['username'])
        self.assertEqual(created_settings['scalename'], payload['scalename'])
        self.assertEqual(created_settings['num_of_stages'], payload['num_of_stages'])

    def test_create_scale_settings_missing_fields(self):
        url = reverse('ranking:ranking_create_scale_settings_api')
        payload = {
            # Missing required fields (number of stages)
            'username': 'natan',
            'scalename': 'Scale002',
            'stages': ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item 1', 'Item 2', 'Item 3'],
            'orientation': 'vertical',
            'scalecolor': '#e6e6e6',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'start_with_zero': True,
            'reference': 'Overall Ranking',
            'display_ranks': True,
        }
        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('num_of_stages missing', response.data['error'])

    def test_create_scale_settings_empty_stages_list(self):
        url = reverse('ranking:ranking_create_scale_settings_api')
        payload = {
            'username': 'natan',
            'scalename': 'Scale003',
            'num_of_stages': 5,
            'stages': [],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item 1', 'Item 2', 'Item 3'],
            'orientation': 'vertical',
            'scalecolor': '#e6e6e6',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'start_with_zero': True,
            'reference': 'Overall Ranking',
            'display_ranks': True,
        }
        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('stages is missing', response.data['error'])

    def test_create_scale_settings_mismatched_stages_length(self):
        url = reverse('ranking:ranking_create_scale_settings_api')
        payload = {
            'username': 'natan',
            'scalename': 'Scale004',
            'num_of_stages': 5,
            'stages': ['Stage 1', 'Stage 2', 'Stage 3'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item 1', 'Item 2', 'Item 3'],
            'orientation': 'vertical',
            'scalecolor': '#e6e6e6',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'start_with_zero': True,
            'reference': 'Overall Ranking',
            'display_ranks': True,

        }
        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Number of stages does not match length of stages', response.data['error'])

    def test_create_scale_settings_mismatched_items_length(self):
        url = reverse('ranking:ranking_create_scale_settings_api')
        payload = {
            'username': 'natan',
            'scalename': 'Scale005',
            'num_of_stages': 6,
            'stages': ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item 1', 'Item 2'],
            'orientation': 'vertical',
            'scalecolor': '#e6e6e6',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'start_with_zero': True,
            'reference': 'Overall Ranking',
            'display_ranks': True,
        }
        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Number of items does not match length of items list', response.data['error'])

    def test_create_scale_settings_different_stages_arrangement(self):
        url = reverse('ranking:ranking_create_scale_settings_api')
        payload = {
            'username': 'natan',
            'scalename': 'Scale006',
            'num_of_stages': 6,
            'stages': ['Stage 3', 'Stage 1', 'Stage 2', 'Stage 5', 'Stage 4', 'Stage 6'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item 1', 'Item 2', 'Item 3'],
            'orientation': 'vertical',
            'scalecolor': '#e6e6e6',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'start_with_zero': True,
            'reference': 'Overall Ranking',
            'display_ranks': True,
        }
        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_settings = response.data['data']['settings']
        self.assertEqual(created_settings['stages'], sorted(payload['stages']))
        

    def test_create_scale_settings_optional_fields(self):
        url = reverse('ranking:ranking_create_scale_settings_api')
        payload = {
            'username': 'natan',
            'scalename': 'Scale007',
            'num_of_stages': 5,
            'stages': ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item 1','Item 2', 'Item 3'],
            'num_of_substages': 1,
            'time': 60,
            'start_with_zero': True,
            'orientation': 'vertical',
            'scalecolor': '#e6e6e6',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'reference': 'Overall Ranking',
            'display_ranks': True,
            
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_settings = response.data['data']['settings']
        self.assertEqual(created_settings['num_of_substages'], payload['num_of_substages'])
        self.assertEqual(created_settings['time'], payload['time'])
        self.assertEqual(created_settings['start_with_zero'], payload['start_with_zero'])
        
        
        
        
    def test_create_scale_settings_with_max_num_of_stages(self):
        url = reverse('ranking:ranking_create_scale_settings_api')
        payload = {
            'username': 'natan',
            'scalename': 'Scale008',
            'num_of_stages': 1000,
            'stages': [f"Stage {stage}" for stage in range(1, 1001, 1)],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item 1','Item 2', 'Item 3'],
            'num_of_substages': 1,
            'time': 60,
            'start_with_zero': True,
            'orientation': 'vertical',
            'scalecolor': '#e6e6e6',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'reference': 'Overall Ranking',
            'display_ranks': True,
            
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_settings = response.data['data']['settings']
    
        self.assertEqual(created_settings['num_of_stages'], payload['num_of_stages'])
        self.assertEqual(created_settings['time'], payload['time'])
        self.assertEqual(created_settings['start_with_zero'], payload['start_with_zero'])
       
   
   # Test GET requests
   
    def test_retrieve_scale_settings_valid_scale_id(self):
        # Create a scale settings object for testing
        settings = {
            'username': 'natan',
            'scalename': 'Scale001',
            'num_of_stages': 5,
            'stages': ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item 1', 'Item 2', 'Item 3'],
            'orientation': 'horizontal',
            'scalecolor': '#e6e6e6',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'reference': 'Overall Ranking',
            'display_ranks': True,
            
        }
        created_settings = self.client.post(reverse('ranking:ranking_create_scale_settings_api'), data=settings, format='json')
        created_settings = created_settings.data
        scale_id = created_settings['scale_id']
  
        # Retrieve the scale settings using the valid scale_id
        url = reverse('ranking:ranking_create_scale_settings_api')
        response = self.client.get(f'{url}?scale_id={scale_id}')

        retrieved_settings = response.data
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(retrieved_settings['settings'], created_settings['data']['settings'])

    def test_retrieve_scale_settings_all(self):
        # Create multiple scale settings objects for testing
        settings1 = {
            'username': 'natalia',
            'scalename': 'Scale002',
            'num_of_stages': 3,
            'stages': ['Stage 1', 'Stage 2', 'Stage 3'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item 1', 'Item 2', 'Item 3'],
            'orientation': 'horizontal',
            'scalecolor': '#e6e6e6',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'reference': 'Overall Ranking',
            'display_ranks': True,
        }
        settings2 = {
            'username': 'natan',
            'scalename': 'Scale003',
            'num_of_stages': 4,
            'stages': ['Stage A', 'Stage B', 'Stage C', 'Stage D'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item 1', 'Item 2', 'Item 3'],
            'orientation': 'horizontal',
            'scalecolor': '#e6e6e6',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'reference': 'Overall Ranking',
            'display_ranks': True,
        }
        self.client.post(reverse('ranking:ranking_create_scale_settings_api'), data=settings1, format='json')
        self.client.post(reverse('ranking:ranking_create_scale_settings_api'), data=settings2, format='json')

        # Retrieve all scale settings
        url = reverse('ranking:ranking_create_scale_settings_api')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)

    def test_retrieve_scale_settings_invalid_scale_id(self):
        # Trying to retrieve scale settings with an invalid scale_id
        scale_id = 'invalid_scale_id'
        url = reverse('ranking:ranking_create_scale_settings_api')
        response = self.client.get(f'{url}?scale_id={scale_id}')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        
        
    # Test PUT requests
    
    def test_update_scale_settings_valid_scale_id_and_fields(self):
        # Create a scale settings object for testing
        settings = {
            'username': 'natan',
            'scalename': 'Scale001',
            'num_of_stages': 3,
            'stages': ['Stage 1', 'Stage 2', 'Stage 3'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item 1', 'Item 2', 'Item 3'],
            'orientation': 'horizontal',
            'scalecolor': '#FFFFFF',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'reference': 'Overall Ranking',
            'display_ranks': True,
            
            
        }
        created_settings = self.client.post(reverse('ranking:ranking_create_scale_settings_api'), data=settings, format='json')
        scale_id = created_settings.data['scale_id']

        # Update the scale settings with valid fields
        url = reverse('ranking:ranking_create_scale_settings_api')
        updated_fields = {
            'scale_id': scale_id,
            'scalename': 'UpdatedScale001',
            'num_of_stages': 4,
            'stages': {'1': 'Stage A', '2': 'Stage B', '3': 'Stage C', '4': 'Stage D'},
            'stages_arrangement': 'Using ID numbers',
            
        }
        response = self.client.put(url, data=updated_fields, format='json')
        scale_id = response.data['scale_id']
        settings = response.data['data']
 
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(scale_id, updated_fields['scale_id'])
        self.assertEqual(settings['scalename'], updated_fields['scalename'])
        self.assertEqual(settings['num_of_stages'], updated_fields['num_of_stages'])
        self.assertEqual(settings['stages'], updated_fields['stages'])
        self.assertEqual(settings['stages_arrangement'], updated_fields['stages_arrangement'])
        
        

    def test_update_scale_settings_missing_or_misspelled_scale_id(self):
        # Trying to update scale settings with a missing or misspelled scale_id
        url = reverse('ranking:ranking_create_scale_settings_api')
        updated_fields = {
            'scalename': 'UpdatedScale002',
            'num_of_stages': 3,
            'stages': ['Stage 1', 'Stage 2', 'Stage 3'],
            'stages_arrangement': 'Alphabetically ordered',
        }
        response = self.client.put(url, data=updated_fields, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_scale_settings_invalid_scale_id(self):
        # Create a scale settings object for testing
        settings = {
            'username': 'natalia',
            'scalename': 'Scale003',
            'num_of_stages': 9,
            'stages': ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6', 'Stage 7', 'Stage 8', 'Stage 9'],
            'stages_arrangement': 'Shuffled (Randomly)',
            'item_count': 6,
            'item_list': ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
            'orientation': 'vertical',
            'scalecolor': '#FFFFFF',
            'fontcolor': '#000000',
            'fontstyle': 'Arial',
            'ranking_method_stages': 'Unique Ranking',
            'reference': 'Overall Ranking',
            'display_ranks': True,
            
            
        }
        created_settings = self.client.post(reverse('ranking:ranking_create_scale_settings_api'), data=settings, format='json')

        # Trying to update scale settings with an invalid or non-existent scale_id
        url = reverse('ranking:ranking_create_scale_settings_api')
        updated_fields = {
            'scale_id': 'invalid_scale_id',
            'scalename': 'Updated Scale',
            # other fields to update
        }
        response = self.client.put(url, data=updated_fields, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_scale_settings_change_stages_arrangement(self):
        # Create a scale settings object for testing
        settings = {
            'username': 'john_doe',
            'scalename': 'My Scale',
            'num_of_stages': 5,
            'stages': ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 6,
            'item_list': ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
            'orientation': 'vertical',
            'scalecolor': '#FFFFFF',
            'fontcolor': '#000000',
            'fontstyle': 'Arial',
            'ranking_method_stages': 'Unique Ranking',
            'reference': 'Overall Ranking',
            'display_ranks': True,
            
            
        }
        created_settings = self.client.post(reverse('ranking:ranking_create_scale_settings_api'), data=settings, format='json')
        scale_id = created_settings.data['scale_id']

        # Update the scale settings by changing the stages arrangement method
        url = reverse('ranking:ranking_create_scale_settings_api')
        updated_fields = {
            'scale_id': scale_id,
            'stages_arrangement': 'Using ID numbers',
            'stages': {'1': 'Stage A', '2': 'Stage B', '3': 'Stage C', '4': 'Stage D', '5': 'Stage E'},
            
        }
        response = self.client.put(url, data=updated_fields, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['stages_arrangement'], updated_fields['stages_arrangement'])
        self.assertEqual(response.data['data']['stages'], updated_fields['stages'])
    def test_update_scale_settings_change_number_of_stages_without_changing_stages(self):
        settings = {
            'username': 'natanem',
            'scalename': 'Scale004',
            'num_of_stages': 3,
            'stages': ['Stage 1', 'Stage 2', 'Stage 3'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item A', 'Item B', 'Item C'],
            'orientation': 'horizontal',
            'scalecolor': '#FFFFFF',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'reference': 'Overall Ranking',
            'display_ranks': True,
            
            
        }
        url = reverse('ranking:ranking_create_scale_settings_api')
        created_settings = self.client.post(url, data=settings, format='json')
        scale_id = created_settings.data['scale_id']
        
        # Update the scale settings by changing the number of stages without changing the stages
        updated_fields = {
            'scale_id': scale_id,
            'num_of_stages': 9,
            
        }
        
        response = self.client.put(url, data=updated_fields, format='json')
  
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Number of stages does not match', response.data['error'])
        
        
    def test_update_scale_settings_change_item_count_without_changing_the_items(self):
        settings = {
            'username': 'natanem',
            'scalename': 'Scale004',
            'num_of_stages': 3,
            'stages': ['Stage 1', 'Stage 2', 'Stage 3'],
            'stages_arrangement': 'Alphabetically ordered',
            'item_count': 3,
            'item_list': ['Item A', 'Item B', 'Item C'],
            'orientation': 'horizontal',
            'scalecolor': '#FFFFFF',
            'fontcolor': '#000000',
            'fontstyle': 'Sans-serif',
            'ranking_method_stages': 'Unique Ranking',
            'reference': 'Overall Ranking',
            'display_ranks': True,
            
            
        }
        url = reverse('ranking:ranking_create_scale_settings_api')
        created_settings = self.client.post(url, data=settings, format='json')
        scale_id = created_settings.data['scale_id']
        
        # Update the scale settings by changing the item count without changing the items
        
        updated_fields = {
            'scale_id': scale_id,
            'item_count': 6,
            
        }
        response = self.client.put(url, data=updated_fields, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Number of items does not match', response.data['error'])
        
        

# Test Response endpoints




        
# Invalid requests test cases        
class InvalidRequestsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()


    def test_invalid_http_method_delete(self):
        # Send an invalid HTTP method (DELETE ) and ensure it returns the expected error response
        url = reverse('ranking:ranking_create_scale_settings_api')
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertIn('Method "DELETE" not allowed', response.data['detail'])
    
    def test_invalid_http_method_patch(self):
        # Send an invalid HTTP method (PATCH ) and ensure it returns the expected error response
        url = reverse('ranking:ranking_create_scale_settings_api')
        response = self.client.patch(url)

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertIn('Method "PATCH" not allowed', response.data['detail'])

    def test_invalid_endpoint(self):
        # Send a request to an invalid or non-existent endpoint and ensure it returns the expected error response
        url = reverse('ranking:ranking_create_scale_settings_api') + 'invalid_endpoint/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
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
        scale_id = '64cb6c5152f5e485ec5bf4dd'
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
        
        url = reverse('Qsort:createScale')
        payload = {
            'sort_order': 'random',
            'statements': ['Statement 1', 'Statement 2', 'Statement 3'],
            'product_name': 'Product X',
            'scalecolor': '#000000',
            'fontstyle': 'Arial',
            'fontcolor': '#FFFFFF',
            'user': 'testuser',
            'name': 'Test Scale'
        }
        create_response = self.client.post(url, data=payload, format='json')
        scale_id = create_response.data['Response']['scale_id']
        
        """
        Test updating a scale with valid input data.
        """
        # Assuming an existing scale ID
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
    
    
    
    
    
    
    
    


    # Response Endpoint Tests
    def test_create_scale_response_success(self):
        url1 = reverse('Qsort:createScale')
        payload = {
            'sort_order': 'random',
            'statements': ['Statement 1', 'Statement 2', 'Statement 3'],
            'product_name': 'Product X',
            'scalecolor': '#000000',
            'fontstyle': 'Arial',
            'fontcolor': '#FFFFFF',
            'user': 'testuser',
            'name': 'Test Scale'
        }
        create_response = self.client.post(url1, data=payload, format='json')
        scale_id = create_response.data['Response']['scale_id']
        
        url = reverse('Qsort:responseAPI')
        payload = {
            "disagree": {
                "statements": [
                    {"card": 1, "text": "I prefer vegetarian meals over non-vegetarian ones."},
                    {"card": 7, "text": "I find seafood to be delicious."},
                    {"card": 3, "text": "I have a sweet tooth and love desserts."},
                    {"card": 4, "text": "I dislike fast food and try to avoid it."},
                    {"card": 5, "text": "I enjoy eating fruits regularly."},
                    {"card": 6, "text": "I often indulge in comfort foods."},
                    {"card": 2, "text": "I prefer eating healthy and balanced meals."},
                    {"card": 8, "text": "I don't like the taste of bitter foods."},
                    {"card": 9, "text": "I enjoy cooking at home."},
                    {"card": 10, "text": "I don't like trying new foods."},
                    {"card": 11, "text": "I prefer salty snacks over sweet ones."},
                    {"card": 12, "text": "I avoid eating processed foods."},
                    {"card": 13, "text": "I enjoy trying dishes from different cultures."},
                    {"card": 14, "text": "I dislike strong-smelling foods."},
                    {"card": 15, "text": "I prefer eating homemade meals over restaurant food."},
                    {"card": 16, "text": "I dislike certain food textures."},
                    {"card": 17, "text": "I don't enjoy spicy or hot dishes."},
                    {"card": 18, "text": "I have specific dietary restrictions or preferences."},
                    {"card": 19, "text": "I enjoy trying vegan or plant-based alternatives."},
                    {"card": 20, "text": "I don't like drinking coffee."},
                   
                ]
            },
            "neutral": {
                "statements": [
                    {"card": 21, "text": "I enjoy exploring local cuisines while traveling."},
                    {"card": 22, "text": "I don't mind layovers during long flights."},
                    {"card": 23, "text": "I like visiting museums and galleries."},
                    {"card": 24, "text": "I often travel for work."},
                    {"card": 25, "text": "I prefer Airbnb stays over hotels."},
                    {"card": 26, "text": "I like to learn basic local phrases before traveling."},
                    {"card": 27, "text": "I enjoy beach vacations."},
                    {"card": 28, "text": "I find guided tours helpful."},
                    {"card": 29, "text": "I prefer offline maps when traveling."},
                    {"card": 30, "text": "I find technology essential while traveling."},
                    {"card": 31, "text": "I enjoy using the latest gadgets."},
                    {"card": 32, "text": "I am wary of online privacy and data leaks."},
                    {"card": 33, "text": "I find voice assistants like Alexa or Siri useful."},
                    {"card": 34, "text": "I prefer physical books over e-books."},
                    {"card": 35, "text": "I use social media moderately."},
                    {"card": 36, "text": "I enjoy video gaming in my free time."},
                    {"card": 37, "text": "I often attend tech conferences or webinars."},
                    {"card": 38, "text": "I find it hard to keep up with the rapid tech advancements."},
                    {"card": 39, "text": "I use multiple devices for my daily tasks."},
                    {"card": 40, "text": "I am open to using alternative tech platforms."}
                ]
            },
            "agree": {
                "statements": [
                    {"card": 41, "text": "I find technology has made life more convenient."},
                    {"card": 42, "text": "I enjoy experimenting with new tech tools."},
                    {"card": 43, "text": "I am concerned about the impact of AI on jobs."},
                    {"card": 44, "text": "I use technology to stay fit and monitor my health."},
                    {"card": 45, "text": "I prefer online shopping over in-store shopping."},
                    {"card": 46, "text": "I often read tech blogs and follow tech influencers."},
                    {"card": 47, "text": "I enjoy DIY tech projects."},
                    {"card": 48, "text": "I am excited about the future of virtual reality."},
                    {"card": 49, "text": "I am conscious about my digital carbon footprint."},
                    {"card": 50, "text": "I often use digital payments over cash."},
                    {"card": 51, "text": "I believe in the potential of renewable energy sources."},
                    {"card": 52, "text": "I am optimistic about space travel in the future."},
                    {"card": 53, "text": "I find the concept of smart homes intriguing."},
                    {"card": 54, "text": "I am eager to try self-driving cars."},
                    {"card": 55, "text": "I believe technology can solve major global challenges."},
                    {"card": 56, "text": "I support the development of clean and green tech solutions."},
                    {"card": 57, "text": "I think wearable tech will be the future."},
                    {"card": 58, "text": "I am aware of the importance of cybersecurity."},
                    {"card": 59, "text": "I find the idea of living on another planet fascinating."},
                    {"card": 60, "text": "I often engage in online learning platforms."},
                    {"card": 61, "text": "I consider myself tech-savvy."},
                    {"card": 62, "text": "I see the potential in blockchain and cryptocurrency."},
                ]
            },
            "scale_id": scale_id,
            "user": "natan",
            "name": "food_preferences_scale",
            "product_name": "Product X",
            "sort_order": "ascending",
            "scalecolor": "#888888",
            "fontstyle": "Arial",
            "fontcolor": "#000000"
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add additional assertions to validate the response data

    def test_invalid_total_statements(self):
        url = reverse('Qsort:responseAPI')
        payload = {
            # Invalid total statements (less than 60)
            "scale_id": "64cb6c5152f5e485ec5bf4dd",
            "disagree": {
                "statements": [
                    {"card": "1", "text": "Statement 1"},
                    {"card": "2", "text": "Statement 2"}
                ]
            },
            "neutral": {
                "statements": [
                    {"card": "3", "text": "Statement 3"}
                ]
            },
            "agree": {
                "statements": [
                    {"card": "4", "text": "Statement 4"},
                    {"card": "5", "text": "Statement 5"}
                ]
            },
            "product_name": "Product A",
            "scalecolor": "#FFFFFF",
            "fontstyle": "Arial",
            "fontcolor": "#000000"
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Add additional assertions to validate the error response

    def test_missing_required_field(self):
        url = reverse('Qsort:responseAPI')
        payload = {
            # Missing required field (scale_id)
            "disagree": {
                "statements": [
                    {"card": "1", "text": "Statement 1"},
                    {"card": "2", "text": "Statement 2"}
                ]
            },
            "neutral": {
                "statements": [
                    {"card": "3", "text": "Statement 3"}
                ]
            },
            "agree": {
                "statements": [
                    {"card": "4", "text": "Statement 4"},
                    {"card": "5", "text": "Statement 5"}
                ]
            },
            "scalecolor": "#FFFFFF",
            "fontstyle": "Arial",
            "fontcolor": "#000000"
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Add additional assertions to validate the error response

    def test_scale_response_already_exists(self):
        url = reverse('Qsort:responseAPI')
        payload = {
            "scale_id": "64cb6c5152f5e485ec5bf4dd",
            "disagree": {
                "statements": [
                    {"card": "1", "text": "Statement 1"},
                    {"card": "2", "text": "Statement 2"}
                ]
            },
            "neutral": {
                "statements": [
                    {"card": "3", "text": "Statement 3"}
                ]
            },
            "agree": {
                "statements": [
                    {"card": "4", "text": "Statement 4"},
                    {"card": "5", "text": "Statement 5"}
                ]
            },
            "product_name": "Product A",
            "scalecolor": "#FFFFFF",
            "fontstyle": "Arial",
            "fontcolor": "#000000"
        }

        # Create a scale response before testing duplication
        self.client.post(url, data=payload, format='json')
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Add additional assertions to validate the error response

    def test_fetch_scale_response_by_id(self):
        scale_id = "64cb6c5152f5e485ec5bf4dd"
        url = reverse('Qsort:responseAPI')
        response = self.client.get(f'{url}?scale_id={scale_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
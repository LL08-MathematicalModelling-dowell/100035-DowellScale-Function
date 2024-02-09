from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

# Create your tests here.

class ScaleReportTestCase(APITestCase):
    def setUp(self):
        self.url = "/scale/"

    def test_nps_scale(self):
        response = self.client.get(reverse("scale_report:report" , kwargs={"scale_id" : "6577189d4302b9938f99b9e2"}) , format='json')
        self.assertEqual(response.status_code , status.HTTP_200_OK)

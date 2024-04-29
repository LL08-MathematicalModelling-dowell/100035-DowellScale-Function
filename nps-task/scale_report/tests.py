from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

# Create your tests here.


class NotEnoughResponse(APITestCase):
    def test_nps_scale(self):
        response = self.client.get(reverse("scale_report:report" , kwargs={"scale_id" : "65571c1d38d836ae6238fbf3"}) , format='json')
        self.assertEqual(response.status_code , status.HTTP_200_OK)


class ScaleReportTestCase(APITestCase):

    def test_nps_scale(self):
        response = self.client.get(reverse("scale_report:report" , kwargs={"scale_id" : "6577189d4302b9938f99b9e2"}) , format='json')
        self.assertEqual(response.status_code , status.HTTP_200_OK)

class LikertScaleReportTestCase(APITestCase):

    def test_likert_scale(self):
        response = self.client.get(reverse("scale_report:report" , kwargs={"scale_id" : "6585ddc4a6a7247b20d52313"}) , format='json')
        self.assertEqual(response.status_code , status.HTTP_200_OK)


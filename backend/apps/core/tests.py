from json import loads as json_load

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

UserModel = get_user_model()


class HomeAPIViewTestCase(APITestCase):
    """
    LogoutAPIView test case.

    supported methods:
    - GET
        cases:
        - visit home not authenticated
        - visit home authenticated
    """

    home_url = reverse('home')

    def setUp(self):
        """
        Initial setup that will be performed before each test
        """

        # Create a new user
        username = 'anon'
        password = 'Change_me_123!'
        UserModel.objects.create_user(username=username, password=password)

        # Make the request for login with user and retrieve JWT tokens
        login_url = reverse('token_obtain_pair')
        payload = {'username': username, 'password': password}
        response = self.client.post(login_url, data=payload, format='json')
        response_data = json_load(response.content)

        # Save JWT tokens for authentication during test
        self.access_token = response_data['access']
        self.refresh_token = response_data['refresh']

    def test_homepage_successful(self):
        # Make the request for logout as authenticated user
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.home_url)
        response_data = json_load(response.content)

        # Assertion for a successful logout
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response_data['message'],
            'Welcome to the JWT Authentication page using React JS and Django.',
        )

    def test_homepage_not_authenticated(self):
        # Make the request for logout as unauthenticated user
        response = self.client.get(self.home_url)

        # Assertion for an unauthorized logout
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

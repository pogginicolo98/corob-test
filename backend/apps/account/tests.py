from json import loads as json_loads

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

UserModel = get_user_model()


class LogoutAPIViewTestCase(APITestCase):
    """
    LogoutAPIView test case.

    supported methods:
    - POST
        cases:
        - logout without data
        - logout without 'refresh' parameter in data
        - logout with invalid refresh token
        - logout not authenticated with valid refresh token
        - logout with valid refresh token
    """

    logout_url = reverse('logout_api')

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
        response_data = json_loads(response.content)

        # Save JWT tokens for authentication during test
        self.access_token = response_data['access']
        self.refresh_token = response_data['refresh']

    def test_logout_successful(self):
        # Make the request for logout as authenticated user
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        payload = {'refresh': self.refresh_token}
        response = self.client.post(self.logout_url, data=payload, format='json')

        # Assertion for a successful logout
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_logout_no_data(self):
        # Make the request for logout as authenticated user
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.post(self.logout_url, format='json')
        response_data = json_loads(response.content)

        # Assertion for a failing logout cause invalid refresh token
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['error'], 'Refresh token not provided')

    def test_logout_no_refresh(self):
        # Make the request for logout as authenticated user
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        payload = {'token': self.refresh_token}
        response = self.client.post(self.logout_url, data=payload, format='json')
        response_data = json_loads(response.content)

        # Assertion for a failing logout cause invalid refresh token
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['error'], 'Refresh token not provided')

    def test_logout_invalid_refresh(self):
        # Make the request for logout as authenticated user
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        payload = {'refresh': 'invalid_refresh_token'}
        response = self.client.post(self.logout_url, data=payload, format='json')
        response_data = json_loads(response.content)

        # Assertion for a failing logout cause invalid refresh token
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['error'], 'Token is invalid or expired')

    def test_logout_not_authenticated_valid_refresh(self):
        # Make the request for logout as unauthenticated user
        payload = {'refresh': self.refresh_token}
        response = self.client.post(self.logout_url, data=payload, format='json')

        # Assertion for an unauthorized logout
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserAPIViewTestCase(APITestCase):
    """
    UserAPIView test case.

    supported methods:
    - GET
        cases:
        - retrieve user not authenticated
        - retrieve user authenticated
    """

    user_url = reverse('user_api')

    def setUp(self):
        """
        Initial setup that will be performed before each test
        """

        # Create a new user
        username = 'anon'
        password = 'Change_me_123!'
        first_name = 'name'
        last_name = 'surname'
        email = 'anon@django.org'
        user = UserModel.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email,
        )

        # Make the request for login with user and retrieve JWT tokens
        login_url = reverse('token_obtain_pair')
        payload = {'username': username, 'password': password}
        response = self.client.post(login_url, data=payload, format='json')
        response_data = json_loads(response.content)

        # Save JWT tokens for authentication during test
        self.access_token = response_data['access']
        self.refresh_token = response_data['refresh']
        self.user_data = {
            'id': user.id,
            'username': username,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
        }

    def test_retrieve_user_successful(self):
        # Make the request for logout as authenticated user
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.user_url)
        response_data = json_loads(response.content)

        # Assertion for a successful retrieve user
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data, self.user_data)

    def test_retrieve_user_not_authenticated(self):
        # Make the request for logout as authenticated user
        response = self.client.get(self.user_url)

        # Assertion for a failing retrieve user cause missing authentication
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RegisterAPIViewTestCase(APITestCase):
    """
    RegisterAPIView test case.

    supported methods:
    - POST
        cases:
        - Sign up with valid data
        - Sign up without username
        - Sign up with existing username
        - Sign up with invalid username
        - Sign up without email
        - Sign up with existing email
        - Sign up without password
        - Sign up without password2
        - Sign up with invalid password
        - Sign up with common password
        - Sign up with non matching passwords
        - Sign up without first_name
        - Sign up without last_name
    """

    register_url = reverse('register_api')

    def setUp(self):
        """
        Initial setup that will be performed before each test
        """

        # Create a new user
        username = 'anon'
        password = 'Change_me_123!'
        first_name = 'name'
        last_name = 'surname'
        email = 'anon@django.org'
        user = UserModel.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email,
        )

        # Make the request for login with user and retrieve JWT tokens
        login_url = reverse('token_obtain_pair')
        payload = {'username': username, 'password': password}
        response = self.client.post(login_url, data=payload, format='json')
        response_data = json_loads(response.content)

        # Save JWT tokens for authentication during test
        self.access_token = response_data['access']
        self.refresh_token = response_data['refresh']
        self.user_data = {
            'id': user.id,
            'username': username,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
        }

    def test_signup_with_valid_data(self):
        payload = {
            'username': 'test_user',
            'email': 'test@user.org',
            'password': 'Change_me_123!',
            'password2': 'Change_me_123!',
            'first_name': 'name',
            'last_name': 'surname',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_signup_without_username(self):
        payload = {
            'email': 'test@user.org',
            'password': 'Change_me_123!',
            'password2': 'Change_me_123!',
            'first_name': 'name',
            'last_name': 'surname',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        response_data = json_loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['username'], ['This field is required.'])

    def test_signup_with_existing_username(self):
        payload = {
            'username': self.user_data['username'],
            'email': 'test@user.org',
            'password': 'Change_me_123!',
            'password2': 'Change_me_123!',
            'first_name': 'name',
            'last_name': 'surname',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        response_data = json_loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['username'], ['This field must be unique.'])

    def test_signup_with_invalid_username(self):
        payload = {
            'username': 'invalid username',
            'email': 'test@user.org',
            'password': 'Change_me_123!',
            'password2': 'Change_me_123!',
            'first_name': 'name',
            'last_name': 'surname',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        response_data = json_loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['username'],
            [
                'Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.'
            ],
        )

    def test_signup_without_email(self):
        payload = {
            'username': 'test_user',
            'password': 'Change_me_123!',
            'password2': 'Change_me_123!',
            'first_name': 'name',
            'last_name': 'surname',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        response_data = json_loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['email'], ['This field is required.'])

    def test_signup_with_existing_email(self):
        payload = {
            'username': 'test_user',
            'email': self.user_data['email'],
            'password': 'Change_me_123!',
            'password2': 'Change_me_123!',
            'first_name': 'name',
            'last_name': 'surname',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        response_data = json_loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['email'], ['This field must be unique.'])

    def test_signup_without_password(self):
        payload = {
            'username': 'test_user',
            'email': 'test@user.org',
            'password2': 'Change_me_123!',
            'first_name': 'name',
            'last_name': 'surname',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        response_data = json_loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['password'], ['This field is required.'])

    def test_signup_without_password2(self):
        payload = {
            'username': 'test_user',
            'email': 'test@user.org',
            'password': 'Change_me_123!',
            'first_name': 'name',
            'last_name': 'surname',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        response_data = json_loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['password2'], ['This field is required.'])

    def test_signup_with_non_matching_password(self):
        payload = {
            'username': 'test_user',
            'email': 'test@user.org',
            'password': 'Change_me_123!',
            'password2': 'Change_me_456!',
            'first_name': 'name',
            'last_name': 'surname',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        response_data = json_loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['password'], ['Password fields didn\'t match.'])

    def test_signup_without_first_name(self):
        payload = {
            'username': 'test_user',
            'email': 'test@user.org',
            'password': 'Change_me_123!',
            'password2': 'Change_me_456!',
            'last_name': 'surname',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        response_data = json_loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['first_name'], ['This field is required.'])

    def test_signup_without_last_name(self):
        payload = {
            'username': 'test_user',
            'email': 'test@user.org',
            'password': 'Change_me_123!',
            'password2': 'Change_me_456!',
            'first_name': 'name',
        }
        response = self.client.post(self.register_url, data=payload, format='json')
        response_data = json_loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['last_name'], ['This field is required.'])


# TODO Add unit tests for RegisterSerializer

from json import loads as json_loads
from random import choice
from string import ascii_uppercase

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.post.models import Post

UserModel = get_user_model()


class PostTestCase(TestCase):
    """
    Post model test case.

    methods:
    - __str__
        cases:
        - String representation with content length lower than 17 characters
        - String representation with content length equal to 17 characters
        - String representation with content length greter than 17 characters
    """

    def setUp(self):
        """
        Initial setup that will be performed before each test
        """

        # Create a new user
        username = 'anon'
        password = 'Change_me_123!'
        self.user = UserModel.objects.create_user(username=username, password=password)

    def test_str_repr_with_content_length_lower_than_17_chars(self):
        # Create a new post
        content = ''.join(choice(ascii_uppercase) for i in range(16))
        post = Post.objects.create(author=self.user, content=content, hidden=False)

        # Assertion for string representation equal to content
        self.assertEqual(post.__str__(), post.content)

    def test_str_repr_with_content_length_equal_to_17_chars(self):
        # Create a new post
        content = ''.join(choice(ascii_uppercase) for i in range(17))
        post = Post.objects.create(author=self.user, content=content, hidden=False)

        # Assertion for string representation equal to content
        self.assertEqual(post.__str__(), post.content)

    def test_str_repr_with_content_length_greater_than_17_chars(self):
        # Create a new post
        content = ''.join(choice(ascii_uppercase) for i in range(18))
        post = Post.objects.create(author=self.user, content=content, hidden=False)

        # Assertion for truncated string representation
        self.assertEqual(post.__str__(), post.content[:17] + '...')

    def test_get_created_at(self):
        # Create a new post
        post = Post.objects.create(author=self.user, content='test_content', hidden=False)

        # Assertion for truncated string representation
        self.assertEqual(post.get_created_at(), post.created_at.strftime('%d %B %Y'))


class PublicPostsAPIViewTestCase(APITestCase):
    """
    PublicPostsAPIView viewset test case.

    supported methods:
    - List
        cases:
        - List public posts with existing user's public post
        - List public posts with existing other user's public post
        - List public posts with hidden user's post
        - List public posts with hidden other user's post
        - List public posts without existing posts
        - List public posts not authenticated
    """

    public_posts_url = reverse('public-posts-list')

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
        self.user = user

    def test_list_public_posts_with_existing_user_public_post(self):
        # Create a new user's public post
        post = Post.objects.create(author=self.user, content='test_content', hidden=False)

        # Make the request for public post list
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.public_posts_url)
        response_data = json_loads(response.content)

        # Assertion for a successful list of public posts
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response_data['results'],
            [
                {
                    'id': post.id,
                    'author': post.author.username,
                    'content': post.content,
                    'created_at': post.get_created_at(),
                }
            ],
        )
        self.assertEqual(post.hidden, False)

    def test_list_public_posts_with_existing_other_user_public_post(self):
        # Create a new other user's public post
        user = UserModel.objects.create_user(
            username='some_user',
            password='Change_me_123!',
            first_name='name',
            last_name='surname',
            email='some_user@django.org',
        )
        post = Post.objects.create(author=user, content='test_content', hidden=False)

        # Make the request for public post list
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.public_posts_url)
        response_data = json_loads(response.content)

        # Assertion for a successful list of public posts
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response_data['results'],
            [
                {
                    'id': post.id,
                    'author': post.author.username,
                    'content': post.content,
                    'created_at': post.get_created_at(),
                }
            ],
        )
        self.assertNotEqual(post.author, self.user)
        self.assertEqual(post.hidden, False)

    def test_list_public_posts_with_hidden_user_post(self):
        # Create a new user's hidden post
        post = Post.objects.create(author=self.user, content='test_content', hidden=True)

        # Make the request for public post list
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.public_posts_url)
        response_data = json_loads(response.content)

        # Assertion for a successful list of public posts that not include hidden posts
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response_data['results'],
            [],
        )
        self.assertEqual(post.hidden, True)

    def test_list_public_posts_with_hidden_other_user_post(self):
        # Create a new other user's hidden post
        user = UserModel.objects.create_user(
            username='some_user',
            password='Change_me_123!',
            first_name='name',
            last_name='surname',
            email='some_user@django.org',
        )
        post = Post.objects.create(author=user, content='test_content', hidden=True)

        # Make the request for public post list
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.public_posts_url)
        response_data = json_loads(response.content)

        # Assertion for a successful list of public posts that not include hidden posts
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response_data['results'],
            [],
        )
        self.assertNotEqual(post.author, self.user)
        self.assertEqual(post.hidden, True)

    def test_list_public_posts_without_existing_posts(self):
        # Make the request for public post list without existing posts
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.public_posts_url)
        response_data = json_loads(response.content)

        # Assertion for a successful empty list of public posts
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response_data['results'],
            [],
        )
        self.assertEqual(Post.objects.all().count(), 0)

    def test_list_public_posts_without_authentication(self):
        # Make the request for public posts list without authentication
        response = self.client.get(self.public_posts_url)

        # Assertion for unauthorized request
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserPostsAPIViewTestCase(APITestCase):
    """
    UserPostsAPIView viewset test case.

    supported methods:
    - Create
        cases:
        - create new post successfull
        - create new post without content
        - create new post without hidden
        - create new post not authenticated
    - List
        cases:
        - list user's public posts
        - list user's hidden posts
        - list user's posts with existing other user's public posts
        - list user's posts with existing other user's hidden posts
        - list user's posts not authenticated
    - Update
        cases:
        - update content of user's post
        - update hidden of user's post
        - update post that don't exists
        - update other user's post
        - update user's post not authenticated
    - Delete
        cases:
        - delete user's post
        - delete post that don't exists
        - delete other user's post
        - delete user's post not authenticated
    """

    user_posts_list_url = reverse('user-posts-list')
    user_posts_detail_url_name = reverse('user-posts-detail', kwargs={'pk': 1})

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
        self.user = user

    def test_create_new_post_successfull(self):
        # Make the request for create a new post
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        payload = {'content': 'test_content', 'hidden': False}
        response = self.client.post(self.user_posts_list_url, data=payload, format='json')
        response_data = json_loads(response.content)

        # Assertion for a successful post creation
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['author'], self.user.username)
        self.assertEqual(response_data['content'], payload['content'])
        self.assertEqual(response_data['hidden'], payload['hidden'])

    def test_create_new_post_without_content(self):
        # Make the request for create a new post without content field
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        payload = {'hidden': False}
        response = self.client.post(self.user_posts_list_url, data=payload, format='json')
        response_data = json_loads(response.content)

        # Assertion for a failing post creation
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['content'], ['This field is required.'])

    def test_create_new_post_without_hidden(self):
        # Make the request for create a new post without hidden field
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        payload = {'content': 'test_content'}
        response = self.client.post(self.user_posts_list_url, data=payload, format='json')
        response_data = json_loads(response.content)

        # Assertion for a failing post creation
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['hidden'], ['This field is required.'])

    def test_create_new_post_not_authenticated(self):
        # Make the request for create a new post
        payload = {'content': 'test_content', 'hidden': False}
        response = self.client.post(self.user_posts_list_url, data=payload, format='json')

        # Assertion for a failing post creation
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_user_public_post(self):
        # Create a new user's public post
        post = Post.objects.create(author=self.user, content='test_content', hidden=False)

        # Make the request for list user's posts
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.user_posts_list_url)
        response_data = json_loads(response.content)

        # Assertion for a successful user's posts list request
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response_data['results'],
            [
                {
                    'id': post.id,
                    'author': post.author.username,
                    'content': post.content,
                    'hidden': post.hidden,
                    'created_at': post.get_created_at(),
                }
            ],
        )
        self.assertEqual(post.author, self.user)
        self.assertEqual(post.hidden, False)

    def test_list_user_hidden_post(self):
        # Create a new user's hidden post
        post = Post.objects.create(author=self.user, content='test_content', hidden=True)

        # Make the request for list user's posts
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.user_posts_list_url)
        response_data = json_loads(response.content)

        # Assertion for a successful user's posts list request
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response_data['results'],
            [
                {
                    'id': post.id,
                    'author': post.author.username,
                    'content': post.content,
                    'hidden': post.hidden,
                    'created_at': post.get_created_at(),
                }
            ],
        )
        self.assertEqual(post.author, self.user)
        self.assertEqual(post.hidden, True)

    def test_list_user_posts_with_other_user_public_post(self):
        # Create a new other user's public post
        user = UserModel.objects.create_user(
            username='some_user',
            password='Change_me_123!',
            first_name='name',
            last_name='surname',
            email='some_user@django.org',
        )
        Post.objects.create(author=user, content='test_content', hidden=False)

        # Create a new user's post
        post = Post.objects.create(author=self.user, content='test_content', hidden=False)

        # Make the request for list user's posts
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.user_posts_list_url)
        response_data = json_loads(response.content)

        # Assertion for a successful user's posts list request
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response_data['results'],
            [
                {
                    'id': post.id,
                    'author': post.author.username,
                    'content': post.content,
                    'hidden': post.hidden,
                    'created_at': post.get_created_at(),
                }
            ],
        )
        self.assertEqual(post.author, self.user)

    def test_list_user_posts_with_other_user_hidden_post(self):
        # Create a new other user's hidden post
        user = UserModel.objects.create_user(
            username='some_user',
            password='Change_me_123!',
            first_name='name',
            last_name='surname',
            email='some_user@django.org',
        )
        Post.objects.create(author=user, content='test_content', hidden=True)

        # Create a new user's post
        post = Post.objects.create(author=self.user, content='test_content', hidden=False)

        # Make the request for list user's posts
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.user_posts_list_url)
        response_data = json_loads(response.content)

        # Assertion for a successful user's posts list request
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response_data['results'],
            [
                {
                    'id': post.id,
                    'author': post.author.username,
                    'content': post.content,
                    'hidden': post.hidden,
                    'created_at': post.get_created_at(),
                }
            ],
        )
        self.assertEqual(post.author, self.user)

    def test_list_user_post_not_authenticated(self):
        # Make the request for list user's post without authentication
        payload = {'content': 'test_content', 'hidden': False}
        response = self.client.get(self.user_posts_list_url, data=payload, format='json')

        # Assertion for a failing user's posts list request
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

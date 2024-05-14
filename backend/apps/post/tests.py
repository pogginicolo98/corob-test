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

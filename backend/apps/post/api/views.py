from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin, UpdateModelMixin

from apps.post.models import Post
from apps.post.api.serializers import UserPostSerializer, PublicPostSerializer


class UserPostsAPIView(CreateModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    """
    User's posts ViewSet:
    - Create a new post.
    - List all user's posts
    - Update a specific user's post.

    * Only authenticated users can perform any action.
    """

    serializer_class = UserPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PublicPostsAPIView(ListModelMixin, GenericViewSet):
    """
    Public posts ViewSet:
    - Lists all posts that are not set as hidden.

    * Only authenticated users can perform any action.
    """

    serializer_class = PublicPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.exclude(hidden=True).order_by('-created_at')

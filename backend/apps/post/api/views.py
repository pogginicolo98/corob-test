from django.db.models import Q

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from apps.post.models import Post
from apps.post.api.permissions import IsAuthorOrReadOnly
from apps.post.api.serializers import PostSerializer


class PostViewSet(ModelViewSet):
    """
    CRUD ViewSet:
    - Create a new Post.
    - Retrieve a list of all Post or a specific one.
    - Update a specific Post.
    - Delete a specific Post.

    * Only authenticated users can perform any action.
    * Users can update/delete only their own Post.
    * Hidden posts are visible only to their author.
    """

    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]

    def get_queryset(self):
        return Post.objects.exclude(Q(hidden=True), ~Q(author=self.request.user)).order_by(
            '-created_at'
        )

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

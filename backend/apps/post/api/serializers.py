from rest_framework import serializers

from apps.post.models import Post


class PublicPostSerializer(serializers.ModelSerializer):
    """
    ModelSerializer for Post.

    fields:
    - id
    - author
    - content
    - created_at: Date format '1 January 2021'.
    """

    id = serializers.PrimaryKeyRelatedField(read_only=True)
    author = serializers.StringRelatedField(read_only=True)
    content = serializers.StringRelatedField(read_only=True)
    created_at = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        exclude = ['hidden', 'updated_at']

    def get_created_at(self, instance):
        return instance.get_created_at()


class UserPostSerializer(serializers.ModelSerializer):
    """
    ModelSerializer for Post.

    fields:
    - id
    - author
    - content
    - hidden
    - created_at: Date format '1 January 2021'.
    """

    id = serializers.PrimaryKeyRelatedField(read_only=True)
    author = serializers.StringRelatedField(read_only=True)
    created_at = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        exclude = ['updated_at']

    def get_created_at(self, instance):
        return instance.get_created_at()

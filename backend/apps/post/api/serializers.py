from rest_framework import serializers

from apps.post.models import Post


class PostSerializer(serializers.ModelSerializer):
    """
    ModelSerializer for Post.

    fields:
    - author
    - content
    - hidden
    - last_update: Date format '1 January 2021'.
    """

    author = serializers.StringRelatedField(read_only=True)
    created_at = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        exclude = ['updated_at']

    def get_created_at(self, instance):
        return instance.created_at.strftime('%d %B %Y')

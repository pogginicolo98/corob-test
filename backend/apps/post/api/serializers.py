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

    class Meta:
        model = Post
        exclude = ['created_at', 'updated_at']

    def get_last_update(self, instance):
        return instance.updated_at.strftime('%d %B %Y')

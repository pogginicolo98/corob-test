from django.urls import include, path

from rest_framework.routers import DefaultRouter

from apps.post.api.views import UserPostsAPIView, PublicPostsAPIView

router = DefaultRouter()
router.register(r'public', PublicPostsAPIView, basename='public-posts')
router.register(r'user', UserPostsAPIView, basename='user-posts')

urlpatterns = [path('', include(router.urls))]

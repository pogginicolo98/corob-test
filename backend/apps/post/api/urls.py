from django.urls import include, path

from rest_framework.routers import DefaultRouter

from apps.post.api.views import PostViewSet

router = DefaultRouter()
router.register(r"", PostViewSet, basename='Post')
urlpatterns = [path('', include(router.urls))]

from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from .views import LogoutAPIView, UserAPIView

urlpatterns = [
    # JWT authentication
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutAPIView.as_view(), name='logout_api'),
    path('user/', UserAPIView.as_view(), name='user_api'),
]

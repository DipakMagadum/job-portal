from django.urls import path
from .views import (
    RegisterView, LoginView, MeView, StudentResumeUploadView,
    AdminDashboardStatsView, AdminUserListView, AdminToggleActiveView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('resume/upload/', StudentResumeUploadView.as_view(), name='resume-upload'),

    # Admin
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),
    path('admin/users/<int:pk>/toggle-active/', AdminToggleActiveView.as_view(), name='admin-toggle-active'),
]

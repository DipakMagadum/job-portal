from django.db.models import Count
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from companies.models import Company
from jobs.models import Job
from applications.models import Application

from .models import User, StudentProfile, RecruiterProfile
from .serializers import (
    RegisterSerializer, UserSerializer, StudentProfileSerializer,
    RecruiterProfileSerializer, CustomTokenObtainPairSerializer,
)
from .permissions import IsAdminRole


class RegisterView(generics.CreateAPIView):
    """Public registration endpoint for students & recruiters."""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(TokenObtainPairView):
    """Login endpoint. Returns access + refresh tokens plus user info."""
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    """Get / update the logged-in user's profile (role-aware)."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        user = request.user
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()

        if user.is_student and 'student_profile' in request.data:
            profile, _ = StudentProfile.objects.get_or_create(user=user)
            ps = StudentProfileSerializer(profile, data=request.data['student_profile'], partial=True)
            ps.is_valid(raise_exception=True)
            ps.save()

        if user.is_recruiter and 'recruiter_profile' in request.data:
            profile, _ = RecruiterProfile.objects.get_or_create(user=user)
            ps = RecruiterProfileSerializer(profile, data=request.data['recruiter_profile'], partial=True)
            ps.is_valid(raise_exception=True)
            ps.save()

        return Response(UserSerializer(user).data)


class StudentResumeUploadView(APIView):
    """Dedicated endpoint for uploading/replacing a resume PDF."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not request.user.is_student:
            return Response({'detail': 'Only students can upload resumes.'}, status=status.HTTP_403_FORBIDDEN)

        profile, _ = StudentProfile.objects.get_or_create(user=request.user)
        resume = request.FILES.get('resume')
        if not resume:
            return Response({'detail': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        if not resume.name.lower().endswith('.pdf'):
            return Response({'detail': 'Only PDF files are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

        profile.resume = resume
        profile.save()
        return Response(StudentProfileSerializer(profile).data, status=status.HTTP_201_CREATED)


class AdminDashboardStatsView(APIView):
    """Aggregate stats for the Admin dashboard."""
    permission_classes = [IsAdminRole]

    def get(self, request):
        data = {
            'total_students': User.objects.filter(role=User.Role.STUDENT).count(),
            'total_recruiters': User.objects.filter(role=User.Role.RECRUITER).count(),
            'total_companies': Company.objects.count(),
            'pending_companies': Company.objects.filter(is_approved=False).count(),
            'total_jobs': Job.objects.count(),
            'open_jobs': Job.objects.filter(status=Job.Status.OPEN).count(),
            'total_applications': Application.objects.count(),
            'applications_by_status': list(
                Application.objects.values('status').order_by('status').annotate(count=Count('id'))
            ),
        }
        return Response(data)


class AdminUserListView(generics.ListAPIView):
    """List all users, filterable by ?role=STUDENT/RECRUITER."""
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        qs = User.objects.all().order_by('-date_joined')
        role = self.request.query_params.get('role')
        if role:
            qs = qs.filter(role=role.upper())
        return qs


class AdminToggleActiveView(APIView):
    """Activate/deactivate a user account (e.g. suspend a recruiter/student)."""
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        user.is_active = not user.is_active
        user.save()
        return Response(UserSerializer(user).data)

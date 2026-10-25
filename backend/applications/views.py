from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsStudent, IsRecruiter
from .models import Application
from .serializers import ApplicationSerializer, ApplicationStatusUpdateSerializer


class IsStudentOwnerOrRecruiterOfJob(permissions.BasePermission):
    """Students can view/withdraw their own applications; recruiters can view/update
    applications for jobs they posted; admins can view everything."""

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_admin_role:
            return True
        if user.is_student:
            return obj.student == user
        if user.is_recruiter:
            return obj.job.posted_by == user
        return False


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.select_related('job', 'job__company', 'student').all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudentOwnerOrRecruiterOfJob]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsStudent()]
        return super().get_permissions()

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_admin_role:
            pass
        elif user.is_student:
            qs = qs.filter(student=user)
        elif user.is_recruiter:
            qs = qs.filter(job__posted_by=user)

        job_id = self.request.query_params.get('job')
        if job_id:
            qs = qs.filter(job_id=job_id)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter.upper())
        return qs

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        return ctx

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated, IsRecruiter])
    def update_status(self, request, pk=None):
        application = self.get_object()
        if application.job.posted_by != request.user and not request.user.is_admin_role:
            return Response({'detail': 'Not your job posting.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = ApplicationStatusUpdateSerializer(application, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ApplicationSerializer(application).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsStudent])
    def withdraw(self, request, pk=None):
        application = self.get_object()
        if application.student != request.user:
            return Response({'detail': 'Not your application.'}, status=status.HTTP_403_FORBIDDEN)
        application.status = Application.Status.WITHDRAWN
        application.save()
        return Response(ApplicationSerializer(application).data)

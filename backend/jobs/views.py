from rest_framework import viewsets, permissions, filters
from django.db.models import Q

from accounts.permissions import IsRecruiter, IsOwnerOrReadOnly
from .models import Job
from .serializers import JobSerializer
from .filters import JobFilter


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.select_related('company', 'posted_by').all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_class = JobFilter
    search_fields = ['title', 'description', 'skills_required', 'location', 'company__name']
    ordering_fields = ['created_at', 'salary_min', 'salary_max', 'deadline']

    def get_permissions(self):
        if self.action == 'create':
            return [IsRecruiter()]
        return super().get_permissions()

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        # Recruiters see all their own jobs (open + closed) via ?mine=true
        if self.request.query_params.get('mine') == 'true' and user.is_authenticated:
            return qs.filter(posted_by=user)

        # public / student view: only open jobs from approved companies by default
        if not (user.is_authenticated and user.is_admin_role):
            qs = qs.filter(status=Job.Status.OPEN, company__is_approved=True)

        keyword = self.request.query_params.get('q')
        if keyword:
            qs = qs.filter(
                Q(title__icontains=keyword) |
                Q(skills_required__icontains=keyword) |
                Q(description__icontains=keyword)
            )
        return qs

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

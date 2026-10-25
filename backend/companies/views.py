from django.db.models import Q
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsRecruiter, IsAdminRole
from .models import Company
from .serializers import CompanySerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'industry', 'location']
    ordering_fields = ['created_at', 'name']

    def get_permissions(self):
        if self.action in ['create']:
            return [IsRecruiter()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        if self.action == 'approve':
            return [IsAdminRole()]
        return super().get_permissions()

    def perform_create(self, serializer):
        company = serializer.save(created_by=self.request.user)
        # auto-link recruiter's profile to the company they created
        recruiter_profile = getattr(self.request.user, 'recruiter_profile', None)
        if recruiter_profile and not recruiter_profile.company:
            recruiter_profile.company = company
            recruiter_profile.save()

    def get_queryset(self):
        qs = super().get_queryset()
        # Only show approved companies to the public; recruiters/admins see all incl. their own
        user = self.request.user
        if not user.is_authenticated:
            return qs.filter(is_approved=True)
        if user.is_admin_role:
            return qs
        return qs.filter(Q(is_approved=True) | Q(created_by=user))

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        company = self.get_object()
        company.is_approved = True
        company.save()
        return Response(CompanySerializer(company).data)

import django_filters
from .models import Job


class JobFilter(django_filters.FilterSet):
    location = django_filters.CharFilter(lookup_expr='icontains')
    title = django_filters.CharFilter(lookup_expr='icontains')
    skills_required = django_filters.CharFilter(lookup_expr='icontains')
    job_type = django_filters.CharFilter(lookup_expr='iexact')
    company = django_filters.NumberFilter(field_name='company__id')
    salary_min = django_filters.NumberFilter(field_name='salary_min', lookup_expr='gte')
    salary_max = django_filters.NumberFilter(field_name='salary_max', lookup_expr='lte')

    class Meta:
        model = Job
        fields = ['location', 'title', 'skills_required', 'job_type', 'company', 'status']

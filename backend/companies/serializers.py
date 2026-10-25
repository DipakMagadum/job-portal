from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    open_jobs_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'description', 'website', 'industry', 'location',
            'logo', 'created_by', 'created_by_username', 'is_approved',
            'created_at', 'open_jobs_count',
        ]
        read_only_fields = ['id', 'created_by', 'is_approved', 'created_at']

    def get_open_jobs_count(self, obj):
        return obj.jobs.filter(status='OPEN').count()

from rest_framework import serializers
from companies.models import Company
from companies.serializers import CompanySerializer
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    company_detail = CompanySerializer(source='company', read_only=True)
    posted_by_username = serializers.CharField(source='posted_by.username', read_only=True)
    applications_count = serializers.IntegerField(read_only=True)
    has_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'company', 'company_detail', 'posted_by', 'posted_by_username',
            'title', 'description', 'requirements', 'skills_required', 'location',
            'job_type', 'salary_min', 'salary_max', 'status', 'openings', 'deadline',
            'created_at', 'updated_at', 'applications_count', 'has_applied',
        ]
        read_only_fields = ['id', 'posted_by', 'created_at', 'updated_at']

    def get_has_applied(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated or not request.user.is_student:
            return False
        return obj.applications.filter(student=request.user).exists()

    def validate_company(self, company):
        request = self.context.get('request')
        user = request.user
        if not user.is_admin_role and company.created_by != user:
            raise serializers.ValidationError("You can only post jobs for your own company.")
        return company

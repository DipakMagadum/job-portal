from rest_framework import serializers
from jobs.models import Job
from jobs.serializers import JobSerializer
from accounts.models import StudentProfile
from .models import Application


class ApplicationStudentSerializer(serializers.Serializer):
    """Lightweight nested representation of the applicant for recruiters."""
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()


class ApplicationSerializer(serializers.ModelSerializer):
    job_detail = JobSerializer(source='job', read_only=True)
    student_username = serializers.CharField(source='student.username', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    student_name = serializers.SerializerMethodField()
    student_skills = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_detail', 'student', 'student_username', 'student_email',
            'student_name', 'student_skills', 'resume', 'cover_letter', 'status',
            'recruiter_notes', 'applied_at', 'updated_at',
        ]
        read_only_fields = ['id', 'student', 'applied_at', 'updated_at']

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}".strip() or obj.student.username

    def get_student_skills(self, obj):
        profile = getattr(obj.student, 'student_profile', None)
        return profile.skills if profile else ''

    def validate_job(self, job):
        if job.status != Job.Status.OPEN:
            raise serializers.ValidationError("This job is no longer accepting applications.")
        return job

    def validate(self, attrs):
        request = self.context.get('request')
        job = attrs.get('job')
        if request and job and self.instance is None:
            if Application.objects.filter(job=job, student=request.user).exists():
                raise serializers.ValidationError("You have already applied to this job.")
        return attrs

    def create(self, validated_data):
        request = self.context['request']
        student = request.user
        # default resume to the one on the student's profile if not explicitly provided
        if 'resume' not in validated_data or not validated_data.get('resume'):
            profile = StudentProfile.objects.filter(user=student).first()
            if profile and profile.resume:
                validated_data['resume'] = profile.resume
        validated_data['student'] = student
        return super().create(validated_data)


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status', 'recruiter_notes']

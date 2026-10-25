from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, StudentProfile, RecruiterProfile


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['college', 'degree', 'graduation_year', 'skills', 'bio', 'resume', 'linkedin_url']


class RecruiterProfileSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = RecruiterProfile
        fields = ['designation', 'company', 'company_name']


class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    recruiter_profile = RecruiterProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'date_joined', 'is_active', 'student_profile', 'recruiter_profile',
        ]
        read_only_fields = ['id', 'role', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    role = serializers.ChoiceField(choices=[User.Role.STUDENT, User.Role.RECRUITER])

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role', 'phone']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if user.role == User.Role.STUDENT:
            StudentProfile.objects.create(user=user)
        elif user.role == User.Role.RECRUITER:
            RecruiterProfile.objects.create(user=user)

        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds user role/info to the JWT response payload."""

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data

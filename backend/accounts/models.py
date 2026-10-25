from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'STUDENT', 'Student'
        RECRUITER = 'RECRUITER', 'Recruiter'
        ADMIN = 'ADMIN', 'Admin'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
    phone = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

    @property
    def is_student(self):
        return self.role == self.Role.STUDENT

    @property
    def is_recruiter(self):
        return self.role == self.Role.RECRUITER

    @property
    def is_admin_role(self):
        return self.role == self.Role.ADMIN or self.is_superuser


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    college = models.CharField(max_length=200, blank=True)
    degree = models.CharField(max_length=150, blank=True)
    graduation_year = models.PositiveIntegerField(null=True, blank=True)
    skills = models.CharField(max_length=500, blank=True, help_text="Comma separated skills")
    bio = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    linkedin_url = models.URLField(blank=True)

    def __str__(self):
        return f"StudentProfile: {self.user.username}"


class RecruiterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recruiter_profile')
    designation = models.CharField(max_length=150, blank=True)
    company = models.ForeignKey(
        'companies.Company', on_delete=models.SET_NULL, null=True, blank=True, related_name='recruiters'
    )

    def __str__(self):
        return f"RecruiterProfile: {self.user.username}"

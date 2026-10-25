from django.conf import settings
from django.db import models

from jobs.models import Job


class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = 'APPLIED', 'Applied'
        SHORTLISTED = 'SHORTLISTED', 'Shortlisted'
        INTERVIEW = 'INTERVIEW', 'Interview Scheduled'
        REJECTED = 'REJECTED', 'Rejected'
        SELECTED = 'SELECTED', 'Selected'
        WITHDRAWN = 'WITHDRAWN', 'Withdrawn'

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    resume = models.FileField(upload_to='application_resumes/', blank=True, null=True)
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.APPLIED)
    recruiter_notes = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']
        unique_together = ['job', 'student']

    def __str__(self):
        return f"{self.student.username} -> {self.job.title}"

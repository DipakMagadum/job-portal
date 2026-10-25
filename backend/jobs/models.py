from django.conf import settings
from django.db import models

from companies.models import Company


class Job(models.Model):
    class JobType(models.TextChoices):
        FULL_TIME = 'FULL_TIME', 'Full Time'
        PART_TIME = 'PART_TIME', 'Part Time'
        INTERNSHIP = 'INTERNSHIP', 'Internship'
        CONTRACT = 'CONTRACT', 'Contract'

    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        CLOSED = 'CLOSED', 'Closed'

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='jobs_posted')

    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    skills_required = models.CharField(max_length=500, blank=True, help_text="Comma separated skills")
    location = models.CharField(max_length=200)
    job_type = models.CharField(max_length=20, choices=JobType.choices, default=JobType.FULL_TIME)
    salary_min = models.PositiveIntegerField(null=True, blank=True)
    salary_max = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.OPEN)
    openings = models.PositiveIntegerField(default=1)
    deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} @ {self.company.name}"

    @property
    def applications_count(self):
        return self.applications.count()

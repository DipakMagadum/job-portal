from django.conf import settings
from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    industry = models.CharField(max_length=150, blank=True)
    location = models.CharField(max_length=200, blank=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='companies_created'
    )
    is_approved = models.BooleanField(default=False, help_text="Approved by admin")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Companies'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

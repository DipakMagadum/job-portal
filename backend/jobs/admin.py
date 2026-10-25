from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'job_type', 'location', 'status', 'created_at']
    list_filter = ['status', 'job_type']
    search_fields = ['title', 'company__name']

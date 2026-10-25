from django.contrib import admin
from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'industry', 'location', 'created_by', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'industry']
    search_fields = ['name']
    actions = ['approve_companies']

    def approve_companies(self, request, queryset):
        queryset.update(is_approved=True)
    approve_companies.short_description = "Approve selected companies"

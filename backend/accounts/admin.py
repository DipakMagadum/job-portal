from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, StudentProfile, RecruiterProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Role Info', {'fields': ('role', 'phone')}),
    )


admin.site.register(StudentProfile)
admin.site.register(RecruiterProfile)

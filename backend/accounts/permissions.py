from rest_framework import permissions


class IsStudent(permissions.BasePermission):
    message = "Only students can perform this action."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_student)


class IsRecruiter(permissions.BasePermission):
    message = "Only recruiters can perform this action."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_recruiter)


class IsAdminRole(permissions.BasePermission):
    message = "Only admins can perform this action."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin_role)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Object-level permission: only the owner can edit/delete."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, 'posted_by', None) or getattr(obj, 'created_by', None) or getattr(obj, 'user', None)
        return owner == request.user

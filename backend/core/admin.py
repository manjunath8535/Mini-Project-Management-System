from django.contrib import admin
from .models import Organization
from .models import Project
from .models import Task
from .models import TaskComment

# Register your models here.
admin.site.register(Organization)
admin.site.register(Project)
admin.site.register(Task)
admin.site.register(TaskComment)

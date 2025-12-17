# schema.py file is for to tells django which database models are allowed to be seen by the reactjs frontend.

import graphene
from graphene_django import DjangoObjectType
from .models import Organization, Project, Task, TaskComment

# Types.
class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = "__all__"

class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = "__all__"

class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_task_count = graphene.Int()

    class Meta:
        model = Project
        fields = "__all__"

    def resolve_task_count(self, info):
        return self.tasks.count()

    def resolve_completed_task_count(self, info):
        return self.tasks.filter(status='DONE').count()

class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = "__all__"

# Mutations.
class CreateProject(graphene.Mutation):
    class Arguments:
        org_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, info, org_slug, name, description="", due_date=None):
        org = Organization.objects.get(slug=org_slug)
        project = Project.objects.create(
            organization=org, name=name, description=description, due_date=due_date
        )
        return CreateProject(project=project)

class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        assignee_email = graphene.String()

    task = graphene.Field(TaskType)

    def mutate(self, info, project_id, title, assignee_email=""):
        project = Project.objects.get(pk=project_id)
        task = Task.objects.create(project=project, title=title, assignee_email=assignee_email)
        return CreateTask(task=task)

class UpdateTaskStatus(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        status = graphene.String(required=True)

    task = graphene.Field(TaskType)

    def mutate(self, info, task_id, status):
        task = Task.objects.get(pk=task_id)
        task.status = status
        task.save()
        return UpdateTaskStatus(task=task)

# Main Query & Mutation Classes.
class Query(graphene.ObjectType):
    # Retrieve organization by slug.
    organization = graphene.Field(OrganizationType, slug=graphene.String(required=True))
    
    def resolve_organization(self, info, slug):
        return Organization.objects.get(slug=slug)

class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    create_task = CreateTask.Field()
    update_task_status = UpdateTaskStatus.Field()
import graphene
from graphene_django import DjangoObjectType
from .models import Organization, Project, Task, TaskComment

# Conveting django model into GraphQL type of TaskCommentType.
class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = "__all__"

# Conveting django model into GraphQL type of TaskType.
class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = "__all__"

# Conveting django model into GraphQL type of ProjectType.
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

# Conveting django model into GraphQL type of OrganizationType.
class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = "__all__"

# CreatingProject mutation.
class CreateProject(graphene.Mutation):
    class Arguments:
        org_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, info, org_slug, name, due_date=None):
        org = Organization.objects.get(slug=org_slug)
        project = Project.objects.create(organization=org, name=name, due_date=due_date)
        return CreateProject(project=project)

# Updating mutation.
class UpdateProject(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        name = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, info, project_id, name=None, status=None, due_date=None):
        project = Project.objects.get(pk=project_id)
        if name:
            project.name = name
        if status:
            project.status = status
        if due_date:
            project.due_date = due_date
        project.save()
        return UpdateProject(project=project)

# CreatingTask mutation.
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

# Updatingtaskstatus mutation.
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

# Addcomment mutation.
class AddComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
    
    comment = graphene.Field(TaskCommentType)

    def mutate(self, info, task_id, content):
        task = Task.objects.get(pk=task_id)
        comment = TaskComment.objects.create(task=task, content=content, author_email="user@demo.com")
        return AddComment(comment=comment)

# Query for reading (fetching data), Mutation for creating data (changing or creating record).
class Query(graphene.ObjectType):
    organization = graphene.Field(OrganizationType, slug=graphene.String(required=True))
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))

    def resolve_organization(self, info, slug):
        return Organization.objects.get(slug=slug)

    def resolve_project(self, info, id):
        return Project.objects.get(pk=id)

# All mutations.
class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    create_task = CreateTask.Field()
    update_task_status = UpdateTaskStatus.Field()
    add_comment = AddComment.Field()
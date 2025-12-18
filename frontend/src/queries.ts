import { gql } from '@apollo/client';

export const GET_ORG_PROJECTS = gql`
  query GetOrgProjects($slug: String!) {
    organization(slug: $slug) {
      id
      name
      projects {
        id
        name
        status
        taskCount
        completedTaskCount
        dueDate  # <--- Added this so Dashboard sees the date
      }
    }
  }
`;

export const GET_PROJECT_DETAILS = gql`
  query GetProjectDetails($id: ID!) {
    project(id: $id) {
      id
      name
      status
      dueDate # <--- Added this so Details Page sees the date
      tasks {
        id
        title
        status
        assigneeEmail
        comments {
          id
          content
          createdAt
        }
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($orgSlug: String!, $name: String!, $dueDate: Date) {
    createProject(orgSlug: $orgSlug, name: $name, dueDate: $dueDate) {
      project { 
        id 
        name 
        dueDate 
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($projectId: ID!, $title: String!) {
    createTask(projectId: $projectId, title: $title) {
      task { id title status }
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      task { id status }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($taskId: ID!, $content: String!) {
    addComment(taskId: $taskId, content: $content) {
      comment {
        id
        content
        createdAt
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($projectId: ID!, $name: String, $status: String, $dueDate: Date) {
    updateProject(projectId: $projectId, name: $name, status: $status, dueDate: $dueDate) {
      project {
        id
        name
        status
        dueDate
      }
    }
  }
`;
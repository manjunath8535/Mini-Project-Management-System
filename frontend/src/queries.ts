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
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($orgSlug: String!, $name: String!) {
    createProject(orgSlug: $orgSlug, name: $name) {
      project {
        id
        name
      }
    }
  }
`;
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORG_PROJECTS, CREATE_PROJECT } from '../queries';

// Hardcoded for this demo.
const ORG_SLUG = "voiceai"; 

// 1. Define the Interface.
interface Project {
  id: string;
  name: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  taskCount: number;
  completedTaskCount: number;
}

interface OrgData {
  organization: {
    id: string;
    name: string;
    projects: Project[];
  }
}

// 2. Add types to useQuery.
export const Dashboard = () => {
  const { loading, error, data, refetch } = useQuery<OrgData>(GET_ORG_PROJECTS, {
    variables: { slug: ORG_SLUG }
  });

  const [createProject] = useMutation(CREATE_PROJECT);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return; 
    try {
      await createProject({ 
        variables: { orgSlug: ORG_SLUG, name: newProjectName } 
      });
      setNewProjectName('');
      refetch(); 
    } catch (err) {
      console.error("Error creating project", err);
    }
  };

  if (loading) return <p className="p-10 text-gray-500">Loading projects...</p>;
  if (error) return <p className="p-10 text-red-500">Error: {error.message}</p>;
  if (!data) return null;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {data.organization.name} Projects
      </h1>
      
      {/* Div for Creating Form. */}
      <form onSubmit={handleCreate} className="mb-8 flex gap-2">
        <input 
          type="text" 
          placeholder="New Project Name"
          className="border border-gray-300 p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={!newProjectName.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          Add Project
        </button>
      </form>

      {/*Div for Project List. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.organization.projects.map((proj: Project) => (
          <div key={proj.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold text-gray-900">{proj.name}</h2>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full 
                ${proj.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                  proj.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {proj.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Task Progress</span>
              <span>{proj.completedTaskCount} / {proj.taskCount}</span>
            </div>
            {/* Simple Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${proj.taskCount > 0 ? (proj.completedTaskCount / proj.taskCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
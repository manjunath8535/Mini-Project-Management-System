import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_ORG_PROJECTS, CREATE_PROJECT } from '../queries';

// Calling slug from python shell.
const ORG_SLUG = "voiceai";

interface Project {
  id: string;
  name: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  taskCount: number;
  completedTaskCount: number;
  dueDate?: string;
}

interface OrgData {
  organization: {
    id: string;
    name: string;
    projects: Project[];
  }
}

// Function for Dashboard and fetching projects data.
export const Dashboard = () => {
  const { loading, error, data, refetch } = useQuery<OrgData>(GET_ORG_PROJECTS, {
    variables: { slug: ORG_SLUG },
    pollInterval: 2000,
  });

  const [createProject] = useMutation(CREATE_PROJECT);
  const [newProjectName, setNewProjectName] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    // Convert empty string to null for GraphQL.
    const dueDateVal = newDueDate ? newDueDate : null;

    await createProject({
      variables: { orgSlug: ORG_SLUG, name: newProjectName, dueDate: dueDateVal }
    });
    setNewProjectName('');
    setNewDueDate('');
    refetch();
  };

  // Helper to calculate days left.
  const getDaysLeft = (dateString?: string) => {
    if (!dateString) return null;
    const today = new Date();
    const due = new Date(dateString);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (error) return <div className="p-10 text-red-500">{error.message}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-center items-center">
          <span className="font-bold text-xl text-gray-800 text-center">Manjunath - Mini Project <span className="text-blue-600">Management System</span></span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add a Project</h1>

        {/* Create Project Form with Date. */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <form onSubmit={handleCreate} className="flex gap-3 flex-wrap md:flex-nowrap">
            <input
              type="text"
              placeholder="Enter project name..."
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <input
              type="date"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
              New Project
            </button>
          </form>
        </div>

        {/* Div for Project Grid. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Showing projects data in frontend. */}
          {data.organization.projects.map((proj) => {
            const daysLeft = getDaysLeft(proj.dueDate);
            const isOverdue = daysLeft !== null && daysLeft < 0;

            return (
              // Link for navigating dynamic page for each page.
              <Link key={proj.id} to={`/project/${proj.id}`} className="block">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-5 h-full flex flex-col justify-between cursor-pointer relative overflow-hidden">

                  {/* Div for Status & Icon. */}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><i className="bi bi-file-earmark-fill"></i></div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${proj.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        proj.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {proj.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{proj.name}</h3>

                    {/* Div for Days Left Display. */}
                    {proj.dueDate && (
                      <div className={`text-xs font-medium flex items-center mt-2 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                       
                        {isOverdue ? `Overdue by ${Math.abs(daysLeft!)} days` : `${daysLeft} days left`}
                      </div>
                    )}
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};
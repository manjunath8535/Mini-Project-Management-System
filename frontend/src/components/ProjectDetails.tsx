import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECT_DETAILS, CREATE_TASK, UPDATE_TASK_STATUS, ADD_COMMENT, UPDATE_PROJECT } from '../queries';

// Function to show project tasks, comments, details etc.
const TaskItem = ({ task, refetch }: { task: any, refetch: any }) => {
  const [updateStatus] = useMutation(UPDATE_TASK_STATUS);
  const [addComment] = useMutation(ADD_COMMENT);
  const [commentText, setCommentText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to work status dropmenu.
  const handleStatusChange = async (newStatus: string) => {
    await updateStatus({ variables: { taskId: task.id, status: newStatus } });
    refetch();
  };

  // Function to add comment.
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addComment({ variables: { taskId: task.id, content: commentText } });
    setCommentText('');
    refetch();
  };

  // Function to change based on status.
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    // Div fo Project details.
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-lg font-medium ${task.status === 'DONE' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${getStatusColor(task.status)}`}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1"
            >
              {task.comments.length} Comments {isExpanded ? '▲' : '▼'}
            </button>
            <span className="text-xs text-gray-400">{task.assigneeEmail || 'Unassigned'}</span>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-3 mb-4">
            {task.comments.map((c: any) => (
              <div key={c.id} className="flex gap-3">
                 <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">U</div>
                 <div className="bg-gray-50 rounded-r-lg rounded-bl-lg p-3 text-sm text-gray-700 flex-1">{c.content}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input type="text" placeholder="Type your comment here..." className="flex-1 text-sm border border-gray-300 rounded-lg px-4 py-2" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
            <button type="submit" disabled={!commentText.trim()} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg">Post</button>
          </form>
        </div>
      )}
    </div>
  );
};

// Main Page Component.
export const ProjectDetails = () => {
  const { id } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_PROJECT_DETAILS, { variables: { id } });
  
  // Mutations.
  const [createTask] = useMutation(CREATE_TASK);
  const [updateProject] = useMutation(UPDATE_PROJECT);

  // States.
  const [taskTitle, setTaskTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editDate, setEditDate] = useState('');

  // Sync state when data loads.
  useEffect(() => {
    if (data?.project) {
      setEditName(data.project.name);
      setEditStatus(data.project.status);
      setEditDate(data.project.dueDate || '');
    }
  }, [data]);

  // Adding new task.
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    await createTask({ variables: { projectId: id, title: taskTitle } });
    setTaskTitle('');
    refetch();
  };

  // Updating the project details.
const handleUpdateProject = async () => {
    try {
      await updateProject({
        variables: {
          projectId: id,
          name: editName,
          status: editStatus,
          dueDate: editDate || null
        }
      });
      setIsEditing(false);
      refetch();
    } catch (err) {
      console.error( err);
    }
  };

  if (loading) return <div className="p-10 flex justify-center">Loading...</div>;
  if (error) return <div className="p-10 text-red-500">Error: {error.message}</div>;

  const project = data.project;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-gray-500 hover:text-blue-600 mb-6 inline-flex items-center gap-2">
          ← Back to Dashboard
        </Link>

        {/* Div for updating details form of project.*/}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Project Details</h2>
            <button 
              onClick={() => isEditing ? handleUpdateProject() : setIsEditing(true)}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                isEditing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isEditing ? 'Save Changes' : 'Edit Project'}
            </button>
          </div>

          {isEditing ? (
            // Editing Mode.
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Project Name</label>
                <input 
                  className="w-full text-2xl font-bold p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-1">Status</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded"
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-1">Due Date</label>
                  <input 
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            // Viewing Mode.
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                  project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                  project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {project.status}
                </span>
              </div>
              {project.dueDate && (
                 <p className="mt-2 text-gray-500 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Due Date: {project.dueDate}
                 </p>
              )}
            </div>
          )}
        </div>

        {/* Div for Adding Task. */}
        <div className="mb-8">
          <form onSubmit={handleAddTask} className="flex gap-3">
            <input className="flex-1 p-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500" placeholder="Add a new task..." value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:bg-blue-700">Add Task</button>
          </form>
        </div>

        {/* Div for showing Task List in frontend.*/}
        <div className="space-y-4">
          {project.tasks.length === 0 ? <div className="text-center py-12 text-gray-400">No tasks found.</div> : 
            project.tasks.map((task: any) => <TaskItem key={task.id} task={task} refetch={refetch} />)
          }
        </div>
      </div>
    </div>
  );
};
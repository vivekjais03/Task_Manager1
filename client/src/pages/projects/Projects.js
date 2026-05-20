import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreVertical, Trash2, Edit2, Users, CheckSquare, Calendar } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { format, isValid } from 'date-fns';

const PROJECT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#06b6d4'];

function ProjectForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: '', description: '', color: '#6366f1', priority: 'medium', dueDate: '', status: 'active' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Project Name</label>
        <input className="input" placeholder="My Awesome Project" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={3} placeholder="What's this project about?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Priority</label>
          <select className="input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Due Date</label>
        <input className="input" type="date" value={form.dueDate ? form.dueDate.split('T')[0] : ''} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
      </div>
      <div>
        <label className="label">Color</label>
        <div className="flex gap-2 flex-wrap">
          {PROJECT_COLORS.map(c => (
            <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
              className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
              style={{ background: c }} />
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Saving...' : 'Save Project'}</button>
      </div>
    </form>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const { user } = useAuth();

  const fetchProjects = () => {
    api.get('/projects').then(r => setProjects(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (form) => {
    const { data } = await api.post('/projects', form);
    setProjects(p => [data, ...p]);
    toast.success('Project created!');
  };

  const handleUpdate = async (form) => {
    const { data } = await api.put(`/projects/${editProject._id}`, form);
    setProjects(p => p.map(x => x._id === data._id ? { ...x, ...data } : x));
    setEditProject(null);
    toast.success('Project updated!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    await api.delete(`/projects/${id}`);
    setProjects(p => p.filter(x => x._id !== id));
    toast.success('Project deleted');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{projects.length} projects</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckSquare size={28} className="text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Create your first project to get started</p>
          {user?.role === 'admin' && <button onClick={() => setShowCreate(true)} className="btn-primary mx-auto">Create Project</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map(project => {
            const progress = project.taskCount > 0 ? Math.round((project.completedCount / project.taskCount) * 100) : 0;
            return (
              <div key={project._id} className="card hover:shadow-md transition-all duration-200 group relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ background: project.color }}>
                      {project.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                      <Badge label={project.status} type={project.status} />
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <div className="relative">
                      <button onClick={() => setMenuOpen(menuOpen === project._id ? null : project._id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={16} />
                      </button>
                      {menuOpen === project._id && (
                        <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-10 w-40 py-1">
                          <button onClick={() => { setEditProject(project); setMenuOpen(null); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => { handleDelete(project._id); setMenuOpen(null); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description || 'No description'}</p>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: project.color }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><CheckSquare size={14} /> {project.completedCount}/{project.taskCount}</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {project.members?.length || 0}</span>
                  </div>
                  {project.dueDate && isValid(new Date(project.dueDate)) && (
                    <span className="flex items-center gap-1 text-xs"><Calendar size={12} /> {format(new Date(project.dueDate), 'MMM d')}</span>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                  <Link to={`/projects/${project._id}/kanban`} className="btn-primary flex-1 justify-center text-sm py-1.5">Kanban Board</Link>
                  <Link to={`/projects/${project._id}`} className="btn-secondary flex-1 justify-center text-sm py-1.5">Details</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Project">
        <ProjectForm onSave={handleCreate} onClose={() => setShowCreate(false)} />
      </Modal>

      <Modal open={!!editProject} onClose={() => setEditProject(null)} title="Edit Project">
        {editProject && <ProjectForm initial={editProject} onSave={handleUpdate} onClose={() => setEditProject(null)} />}
      </Modal>
    </div>
  );
}

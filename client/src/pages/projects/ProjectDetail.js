import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Trash2, Crown } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { format, isValid } from 'date-fns';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  useEffect(() => {
    Promise.all([api.get(`/projects/${id}`), api.get(`/tasks?project=${id}`)]).then(([p, t]) => {
      setProject(p.data); setTasks(t.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/projects/${id}/members`, { email: inviteEmail, role: inviteRole });
      setProject(data);
      setShowInvite(false);
      setInviteEmail('');
      toast.success('Member invited!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    await api.delete(`/projects/${id}/members/${userId}`);
    setProject(p => ({ ...p, members: p.members.filter(m => m.user._id !== userId) }));
    toast.success('Member removed');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>;
  if (!project) return <div className="text-center py-16 text-gray-500">Project not found</div>;

  const isOwner = project.owner._id === user?._id || user?.role === 'admin';
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/projects" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><ArrowLeft size={20} /></Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: project.color }}>
            {project.name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h2>
            <div className="flex items-center gap-2">
              <Badge label={project.status} type={project.status} />
              <Badge label={project.priority} type={project.priority} />
            </div>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Link to={`/projects/${id}/kanban`} className="btn-primary">Open Kanban</Link>
          {isOwner && <button onClick={() => setShowInvite(true)} className="btn-secondary"><UserPlus size={16} /> Invite</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Overview</h3>
            <p className="text-gray-500 text-sm mb-4">{project.description || 'No description provided.'}</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
                <p className="text-xs text-gray-500">Total Tasks</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-xl font-bold text-green-600">{completedTasks}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <p className="text-xl font-bold text-primary-600">{progress}%</p>
                <p className="text-xs text-gray-500">Progress</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: project.color }} />
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tasks</h3>
            {tasks.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No tasks yet. Open the Kanban board to create tasks.</p>
            ) : (
              <div className="space-y-2">
                {tasks.map(task => (
                  <Link key={task._id} to={`/tasks/${task._id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500' : task.status === 'overdue' ? 'bg-red-500' : 'bg-gray-300'}`} />
                      <span className="text-sm text-gray-900 dark:text-white truncate">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <Badge label={task.priority} type={task.priority} />
                      {task.assignee && <Avatar name={task.assignee.name} size={6} />}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="card h-fit">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Team Members</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Avatar name={project.owner.name} size={8} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{project.owner.name}</p>
                <p className="text-xs text-gray-500 truncate">{project.owner.email}</p>
              </div>
              <Crown size={14} className="text-yellow-500 shrink-0" />
            </div>
            {project.members?.filter(m => m.user._id !== project.owner._id).map(m => (
              <div key={m.user._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group">
                <Avatar name={m.user.name} size={8} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{m.user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{m.user.email}</p>
                </div>
                <Badge label={m.role} type={m.role} />
                {isOwner && (
                  <button onClick={() => handleRemoveMember(m.user._id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {project.dueDate && isValid(new Date(project.dueDate)) && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{format(new Date(project.dueDate), 'MMMM d, yyyy')}</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Invite Team Member">
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="label">Email Address</label>
            <input className="input" type="email" placeholder="colleague@company.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowInvite(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Send Invite</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

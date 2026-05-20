import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Trash2, Calendar, User, Tag } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { format, isValid } from 'date-fns';

export default function TaskDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    api.get(`/tasks/${id}`).then(r => { setTask(r.data); setEditStatus(r.data.status); }).finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (status) => {
    setEditStatus(status);
    try {
      const { data } = await api.put(`/tasks/${id}`, { status });
      setTask(data);
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/tasks/${id}/comments`, { text: comment });
      setTask(t => ({ ...t, comments: data }));
      setComment('');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    toast.success('Task deleted');
    navigate(-1);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>;
  if (!task) return <div className="text-center py-16 text-gray-500">Task not found</div>;

  const isAdmin = user?.role === 'admin';
  const isAssignee = task.assignee?._id === user?._id;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><ArrowLeft size={20} /></button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/projects" className="hover:text-primary-600">Projects</Link>
          <span>/</span>
          <Link to={`/projects/${task.project?._id}`} className="hover:text-primary-600">{task.project?.name}</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">Task</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
              {isAdmin && (
                <button onClick={handleDelete} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{task.description || 'No description provided.'}</p>
            {task.tags?.length > 0 && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <Tag size={14} className="text-gray-400" />
                {task.tags.map(tag => <span key={tag} className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">{tag}</span>)}
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Comments ({task.comments?.length || 0})</h3>
            <div className="space-y-4 mb-4">
              {task.comments?.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No comments yet. Be the first to comment!</p>
              ) : task.comments?.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <Avatar name={c.user?.name} size={8} />
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{c.user?.name}</span>
                      <span className="text-xs text-gray-400">{format(new Date(c.createdAt), 'MMM d, h:mm a')}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleComment} className="flex gap-3">
              <Avatar name={user?.name} size={8} />
              <div className="flex-1 flex gap-2">
                <input className="input flex-1" placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} />
                <button type="submit" disabled={submitting || !comment.trim()} className="btn-primary px-3">
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Details</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Status</label>
                {(isAdmin || isAssignee) ? (
                  <select className="input" value={editStatus} onChange={e => handleStatusChange(e.target.value)}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                ) : <Badge label={task.status} type={task.status} />}
              </div>
              <div>
                <label className="label">Priority</label>
                <Badge label={task.priority} type={task.priority} />
              </div>
              <div>
                <label className="label flex items-center gap-1"><User size={13} /> Assignee</label>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar name={task.assignee.name} size={7} />
                    <span className="text-sm text-gray-900 dark:text-white">{task.assignee.name}</span>
                  </div>
                ) : <span className="text-sm text-gray-400">Unassigned</span>}
              </div>
              {task.dueDate && isValid(new Date(task.dueDate)) && (
                <div>
                  <label className="label flex items-center gap-1"><Calendar size={13} /> Due Date</label>
                  <span className="text-sm text-gray-900 dark:text-white">{format(new Date(task.dueDate), 'MMMM d, yyyy')}</span>
                </div>
              )}
              <div>
                <label className="label">Created by</label>
                <div className="flex items-center gap-2">
                  <Avatar name={task.createdBy?.name} size={7} />
                  <span className="text-sm text-gray-900 dark:text-white">{task.createdBy?.name}</span>
                </div>
              </div>
              <div>
                <label className="label">Created</label>
                <span className="text-sm text-gray-500">{format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

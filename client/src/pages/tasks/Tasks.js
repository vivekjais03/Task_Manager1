import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MessageSquare } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import { format, isValid } from 'date-fns';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search) params.set('search', filters.search);
    api.get(`/tasks?${params}`).then(r => setTasks(r.data)).finally(() => setLoading(false));
  }, [filters, user._id]);

  const grouped = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed'),
    overdue: tasks.filter(t => t.status === 'overdue'),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search tasks..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
        </div>
        <select className="input w-auto" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <select className="input w-auto" value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>
      ) : tasks.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400">No tasks found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).filter(([, t]) => t.length > 0).map(([status, statusTasks]) => (
            <div key={status}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full ${status === 'completed' ? 'bg-green-500' : status === 'in-progress' ? 'bg-blue-500' : status === 'overdue' ? 'bg-red-500' : 'bg-gray-400'}`} />
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{status.replace('-', ' ')}</h3>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full px-2 py-0.5">{statusTasks.length}</span>
              </div>
              <div className="space-y-2">
                {statusTasks.map(task => (
                  <Link key={task._id} to={`/tasks/${task._id}`}
                    className="card flex items-center gap-4 hover:shadow-md transition-all py-3 px-4 cursor-pointer">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                      <p className="text-xs text-gray-500 truncate">{task.project?.name}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge label={task.priority} type={task.priority} />
                      {task.dueDate && isValid(new Date(task.dueDate)) && (
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Calendar size={12} />{format(new Date(task.dueDate), 'MMM d')}</span>
                      )}
                      {task.comments?.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-400"><MessageSquare size={12} />{task.comments.length}</span>
                      )}
                      {task.assignee && <Avatar name={task.assignee.name} size={6} />}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

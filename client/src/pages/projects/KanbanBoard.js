import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, ArrowLeft, Calendar, MessageSquare, GripVertical } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { format, isValid } from 'date-fns';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'bg-gray-400' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { id: 'completed', label: 'Completed', color: 'bg-green-500' },
  { id: 'overdue', label: 'Overdue', color: 'bg-red-500' },
];

function TaskCard({ task, onClick, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isSortableDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} onClick={() => onClick(task)}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 cursor-pointer hover:shadow-md transition-all group ${isDragging ? 'shadow-xl rotate-2' : ''}`}>
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="mt-0.5 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          <GripVertical size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">{task.title}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge label={task.priority} type={task.priority} />
            {task.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{tag}</span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {task.dueDate && isValid(new Date(task.dueDate)) && (
                <span className="flex items-center gap-1"><Calendar size={11} />{format(new Date(task.dueDate), 'MMM d')}</span>
              )}
              {task.comments?.length > 0 && (
                <span className="flex items-center gap-1"><MessageSquare size={11} />{task.comments.length}</span>
              )}
            </div>
            {task.assignee && <Avatar name={task.assignee.name} size={6} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Column({ column, tasks, onAddTask, onTaskClick }) {
  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-3 min-w-[280px] w-72">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
          <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">{column.label}</span>
          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full px-2 py-0.5">{tasks.length}</span>
        </div>
        <button onClick={() => onAddTask(column.id)} className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors">
          <Plus size={16} />
        </button>
      </div>
      <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 flex-1 min-h-[100px]">
          {tasks.map(task => <TaskCard key={task._id} task={task} onClick={onTaskClick} />)}
        </div>
      </SortableContext>
    </div>
  );
}

function TaskForm({ projectId, users, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { title: '', description: '', priority: 'medium', status: 'todo', assignee: '', dueDate: '', tags: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, project: projectId, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      if (!payload.assignee) delete payload.assignee;
      await onSave(payload);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Title</label>
        <input className="input" placeholder="Task title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={3} placeholder="Task description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
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
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Assignee</label>
          <select className="input" value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}>
            <option value="">Unassigned</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Due Date</label>
          <input className="input" type="date" value={form.dueDate ? form.dueDate.split('T')[0] : ''} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="label">Tags (comma separated)</label>
        <input className="input" placeholder="design, frontend, bug" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Saving...' : 'Save Task'}</button>
      </div>
    </form>
  );
}

export default function KanbanBoard() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    Promise.all([api.get(`/projects/${id}`), api.get(`/tasks?project=${id}`), api.get('/auth/users')]).then(([p, t, u]) => {
      setProject(p.data); setTasks(t.data); setUsers(u.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const getColumnTasks = (status) => tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order);

  const handleDragStart = ({ active }) => setActiveTask(tasks.find(t => t._id === active.id));

  const handleDragEnd = useCallback(async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    const draggedTask = tasks.find(t => t._id === active.id);
    if (!draggedTask) return;

    let newStatus = draggedTask.status;
    const overTask = tasks.find(t => t._id === over.id);
    if (overTask) newStatus = overTask.status;
    else {
      const col = COLUMNS.find(c => c.id === over.id);
      if (col) newStatus = col.id;
    }

    if (newStatus === draggedTask.status && active.id === over.id) return;

    const updatedTasks = tasks.map(t => t._id === active.id ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);

    try {
      await api.put(`/tasks/${active.id}`, { status: newStatus });
    } catch {
      setTasks(tasks);
      toast.error('Failed to update task');
    }
  }, [tasks]);

  const handleCreateTask = async (form) => {
    const { data } = await api.post('/tasks', { ...form, status: defaultStatus });
    setTasks(t => [...t, data]);
    toast.success('Task created!');
  };

  const handleUpdateTask = async (form) => {
    const { data } = await api.put(`/tasks/${selectedTask._id}`, form);
    setTasks(t => t.map(x => x._id === data._id ? data : x));
    setSelectedTask(null);
    toast.success('Task updated!');
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${taskId}`);
    setTasks(t => t.filter(x => x._id !== taskId));
    setSelectedTask(null);
    toast.success('Task deleted');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to={`/projects/${id}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><ArrowLeft size={20} /></Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: project?.color }}>
            {project?.name?.[0]}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{project?.name} — Kanban</h2>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => { setDefaultStatus('todo'); setShowCreate(true); }} className="btn-primary ml-auto">
            <Plus size={18} /> Add Task
          </button>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <Column key={col.id} column={col} tasks={getColumnTasks(col.id)}
              onAddTask={(status) => { setDefaultStatus(status); setShowCreate(true); }}
              onTaskClick={setSelectedTask} />
          ))}
        </div>
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} onClick={() => {}} isDragging />}
        </DragOverlay>
      </DndContext>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Task">
        <TaskForm projectId={id} users={users} initial={{ title: '', description: '', priority: 'medium', status: defaultStatus, assignee: '', dueDate: '', tags: '' }}
          onSave={handleCreateTask} onClose={() => setShowCreate(false)} />
      </Modal>

      <Modal open={!!selectedTask} onClose={() => setSelectedTask(null)} title="Edit Task" size="lg">
        {selectedTask && (
          <div className="space-y-4">
            <TaskForm projectId={id} users={users}
              initial={{ ...selectedTask, tags: selectedTask.tags?.join(', ') || '', assignee: selectedTask.assignee?._id || '', dueDate: selectedTask.dueDate || '' }}
              onSave={handleUpdateTask} onClose={() => setSelectedTask(null)} />
            {user?.role === 'admin' && (
              <button onClick={() => handleDeleteTask(selectedTask._id)} className="btn-danger w-full justify-center">Delete Task</button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

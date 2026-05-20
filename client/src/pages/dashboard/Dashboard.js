import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Clock, AlertCircle, TrendingUp, FolderKanban, ArrowRight, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { format, isValid } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="card flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
      <Icon size={22} className={color} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/tasks/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>;

  const pieData = [
    { name: 'In Progress', value: stats.inProgressTasks },
    { name: 'Completed', value: stats.completedTasks },
    { name: 'Pending', value: stats.pendingTasks },
    { name: 'Overdue', value: stats.overdueTasks },
  ];

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const label = format(d, 'EEE');
    const dayTasks = stats.recentTasks?.filter(t => {
      const td = new Date(t.createdAt); return td.toDateString() === d.toDateString();
    }).length || 0;
    return { day: label, tasks: dayTasks };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-gray-500 mt-1">Here's what's happening with your projects today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckSquare} label="Total Tasks" value={stats.totalTasks} color="text-primary-600" bg="bg-primary-50 dark:bg-primary-900/30" />
        <StatCard icon={TrendingUp} label="Completed" value={stats.completedTasks} color="text-green-600" bg="bg-green-50 dark:bg-green-900/30" />
        <StatCard icon={Clock} label="In Progress" value={stats.inProgressTasks} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/30" />
        <StatCard icon={AlertCircle} label="Overdue" value={stats.overdueTasks} color="text-red-600" bg="bg-red-50 dark:bg-red-900/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="card lg:col-span-2">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Task Activity (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="tasks" stroke="#6366f1" fill="url(#colorTasks)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Calendar size={18} /> Upcoming Deadlines</h3>
          </div>
          {stats.upcomingDeadlines?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No upcoming deadlines 🎉</p>
          ) : (
            <div className="space-y-3">
              {stats.upcomingDeadlines?.map(task => (
                <Link key={task._id} to={`/tasks/${task._id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.project?.name}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <Badge label={task.priority} type={task.priority} />
                    <span className="text-xs text-gray-400">{task.dueDate && isValid(new Date(task.dueDate)) ? format(new Date(task.dueDate), 'MMM d') : ''}</span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Tasks</h3>
            <Link to="/tasks" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {stats.recentTasks?.slice(0, 5).map(task => (
              <Link key={task._id} to={`/tasks/${task._id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.project?.name}</p>
                </div>
                <Badge label={task.status} type={task.status} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><FolderKanban size={18} /> Projects Overview</h3>
          <Link to="/projects" className="text-sm text-primary-600 hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            <p className="text-2xl font-bold text-primary-600">{stats.totalProjects}</p>
            <p className="text-xs text-gray-500 mt-1">Total Projects</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <p className="text-2xl font-bold text-green-600">{stats.activeProjects}</p>
            <p className="text-xs text-gray-500 mt-1">Active</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">{stats.myTasks?.length || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Assigned to Me</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}

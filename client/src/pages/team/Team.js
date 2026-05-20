import React, { useEffect, useState } from 'react';
import { Mail, Shield, UserCheck } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

export default function Team() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/auth/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>;

  const admins = users.filter(u => u.role === 'admin');
  const members = users.filter(u => u.role === 'member');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">{users.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Members</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-purple-600">{admins.length}</p>
          <p className="text-sm text-gray-500 mt-1">Admins</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600">{members.length}</p>
          <p className="text-sm text-gray-500 mt-1">Members</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Shield size={18} className="text-purple-500" /> Admins</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {admins.map(u => (
            <div key={u._id} className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
              <Avatar name={u.name} size={10} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{u.name} {u._id === user?._id && <span className="text-xs text-gray-400">(you)</span>}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 truncate"><Mail size={11} />{u.email}</p>
              </div>
              <Badge label="admin" type="admin" />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><UserCheck size={18} className="text-blue-500" /> Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {members.map(u => (
            <div key={u._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <Avatar name={u.name} size={10} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{u.name} {u._id === user?._id && <span className="text-xs text-gray-400">(you)</span>}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 truncate"><Mail size={11} />{u.email}</p>
              </div>
              <Badge label="member" type="member" />
            </div>
          ))}
          {members.length === 0 && <p className="text-gray-400 text-sm col-span-2 text-center py-4">No members yet</p>}
        </div>
      </div>
    </div>
  );
}

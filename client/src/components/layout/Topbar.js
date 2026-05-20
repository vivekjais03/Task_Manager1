import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';

export default function Topbar({ title }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef();

  useEffect(() => {
    api.get('/auth/notifications').then(r => setNotifications(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const markRead = async () => {
    await api.put('/auth/notifications/read');
    setNotifications(n => n.map(x => ({ ...x, read: true })));
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-56 text-gray-900 dark:text-gray-100" />
        </div>
        <div className="relative" ref={ref}>
          <button onClick={() => { setShowNotif(s => !s); if (!showNotif) markRead(); }} className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <Bell size={20} />
            {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unread}</span>}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-50 animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</span>
                <button onClick={() => setShowNotif(false)}><X size={16} className="text-gray-400" /></button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">No notifications</p>
                ) : notifications.map((n, i) => (
                  <div key={i} className={`px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0 ${!n.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}

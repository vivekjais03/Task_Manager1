import React, { useState } from 'react';
import { Bell, Moon, Shield, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({ email: true, browser: false, taskAssigned: true, taskDue: true });

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Moon size={18} /> Appearance</h3>
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
            <p className="text-xs text-gray-500">Switch between light and dark theme</p>
          </div>
          <button onClick={toggle} className={`relative w-12 h-6 rounded-full transition-colors ${dark ? 'bg-primary-600' : 'bg-gray-300'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${dark ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Bell size={18} /> Notifications</h3>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'browser', label: 'Browser Notifications', desc: 'Push notifications in browser' },
            { key: 'taskAssigned', label: 'Task Assigned', desc: 'When a task is assigned to you' },
            { key: 'taskDue', label: 'Task Due Reminders', desc: 'Reminders before task due dates' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${notifications[key] ? 'bg-primary-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications[key] ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Shield size={18} /> Account</h3>
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Account Role</p>
            <p className="text-xs text-gray-500 capitalize mt-0.5">{user?.role} — {user?.role === 'admin' ? 'Full access to all features' : 'Can view and update assigned tasks'}</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Member Since</p>
            <p className="text-xs text-gray-500 mt-0.5">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="card border-red-100 dark:border-red-900/30">
        <h3 className="font-semibold text-red-600 mb-4 flex items-center gap-2"><Trash2 size={18} /> Danger Zone</h3>
        <button onClick={() => { logout(); navigate('/login'); }} className="btn-danger">
          Sign Out of Account
        </button>
      </div>
    </div>
  );
}

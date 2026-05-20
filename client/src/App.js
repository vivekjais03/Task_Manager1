import React from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/landing/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Projects from './pages/projects/Projects';
import ProjectDetail from './pages/projects/ProjectDetail';
import KanbanBoard from './pages/projects/KanbanBoard';
import Tasks from './pages/tasks/Tasks';
import TaskDetail from './pages/tasks/TaskDetail';
import Team from './pages/team/Team';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';
import Spinner from './components/ui/Spinner';

function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={32} /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <AppLayout />;
}

function RedirectIfAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={32} /></div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
      <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/kanban" element={<KanbanBoard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{ className: 'dark:bg-gray-800 dark:text-white text-sm', duration: 3000 }} />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

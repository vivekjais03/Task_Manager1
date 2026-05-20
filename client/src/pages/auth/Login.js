import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role) => {
    setLoading(true);
    try {
      await login(role === 'admin' ? 'admin@demo.com' : 'member@demo.com', 'demo1234');
      navigate('/dashboard');
    } catch {
      toast.error('Demo account not set up. Run npm run seed first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fafaf8] dark:bg-[#0d0d0d]">

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex w-[52%] relative overflow-hidden bg-[#1a1a2e] flex-col justify-between p-14">

        {/* Mesh background */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, #2d1b69 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #1a3a5c 0%, transparent 55%), radial-gradient(ellipse at 60% 80%, #0f2027 0%, transparent 50%), #0d0d1a' }} />

        {/* Floating cards mockup */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 select-none pointer-events-none">
          {/* Card 1 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-3 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/80 flex items-center justify-center text-xs font-bold text-white">D</div>
              <div>
                <div className="text-white text-xs font-semibold">Design System v2</div>
                <div className="text-white/40 text-[10px]">3 tasks remaining</div>
              </div>
              <div className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Active</div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-violet-400 h-1.5 rounded-full w-[68%]" />
            </div>
            <div className="text-white/30 text-[10px] mt-1.5">68% complete</div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-3 shadow-2xl ml-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="text-white/80 text-xs font-medium">API Integration</div>
              <div className="ml-auto text-[10px] text-white/30">Due tomorrow</div>
            </div>
            <div className="flex gap-1.5">
              {['In Progress', 'High Priority'].map(tag => (
                <span key={tag} className="text-[9px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl -ml-2">
            <div className="text-white/50 text-[10px] mb-2 font-medium uppercase tracking-wider">Team Activity</div>
            {[
              { name: 'Vivek', action: 'completed a task', color: 'bg-violet-500' },
              { name: 'Priya', action: 'left a comment', color: 'bg-pink-500' },
              { name: 'Arjun', action: 'joined the project', color: 'bg-blue-500' },
            ].map(({ name, action, color }) => (
              <div key={name} className="flex items-center gap-2 mb-1.5 last:mb-0">
                <div className={`w-5 h-5 rounded-full ${color} flex items-center justify-center text-[9px] font-bold text-white shrink-0`}>{name[0]}</div>
                <span className="text-white/50 text-[10px]"><span className="text-white/80 font-medium">{name}</span> {action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom branding */}
        <div className="relative z-10 mt-auto">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">TaskFlow</span>
          </div>
          <p className="text-white/30 text-xs leading-relaxed max-w-xs">
            "TaskFlow cut our project delivery time by 40%. It's the only tool our team actually uses."
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-pink-400" />
            <span className="text-white/40 text-xs">Vivek Jaiswal, Founder</span>
          </div>
        </div>

        <Link to="/" className="relative z-10 inline-flex items-center gap-1.5 text-white/30 hover:text-white/70 text-xs transition-colors mt-8">
          <ArrowLeft size={13} /> Back to home
        </Link>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[380px]">

          <Link to="/" className="lg:hidden inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-8 transition-colors">
            <ArrowLeft size={14} /> Home
          </Link>

          <div className="mb-9">
            <h1 className="text-[28px] font-bold text-gray-900 dark:text-white tracking-tight">Sign in</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Good to see you again 👋</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 dark:focus:border-violet-500 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 dark:focus:border-violet-500 transition-all shadow-sm"
                />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/30 hover:text-gray-500 dark:hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-[#1a1a2e] dark:bg-violet-600 hover:bg-[#2d1b69] dark:hover:bg-violet-700 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
            <span className="text-xs text-gray-300 dark:text-white/20">or</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => demoLogin('admin')}
              className="py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-white/60 hover:border-violet-300 dark:hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
            >
              Demo Admin
            </button>
            <button
              onClick={() => demoLogin('member')}
              className="py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-white/60 hover:border-violet-300 dark:hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
            >
              Demo Member
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 dark:text-white/30 mt-8">
            No account?{' '}
            <Link to="/register" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline underline-offset-2">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

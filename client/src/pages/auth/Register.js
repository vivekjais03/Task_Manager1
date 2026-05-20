import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const strengthMeta = [
  null,
  { label: 'Too weak', color: 'bg-red-500', text: 'text-red-500' },
  { label: 'Weak', color: 'bg-orange-400', text: 'text-orange-400' },
  { label: 'Fair', color: 'bg-amber-400', text: 'text-amber-400' },
  { label: 'Strong', color: 'bg-emerald-400', text: 'text-emerald-400' },
  { label: 'Very strong', color: 'bg-emerald-500', text: 'text-emerald-500' },
];

const steps = [
  { key: 'name', label: 'Your name' },
  { key: 'email', label: 'Email' },
  { key: 'password', label: 'Password' },
  { key: 'role', label: 'Role' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getStrength(form.password);
  const meta = strengthMeta[strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
      toast.success('Welcome to TaskFlow!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const filled = steps.filter(s => form[s.key]?.length > 0).length;
  const progress = Math.round((filled / steps.length) * 100);

  const inputCls = "w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 dark:focus:border-violet-500 transition-all shadow-sm";

  return (
    <div className="min-h-screen flex bg-[#fafaf8] dark:bg-[#0d0d0d]">

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex w-[52%] relative overflow-hidden bg-[#0d0d1a] flex-col justify-between p-14">

        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 80% 30%, #2d1b69 0%, transparent 55%), radial-gradient(ellipse at 20% 70%, #1a3a5c 0%, transparent 55%), #0d0d1a' }} />

        {/* Kanban mockup */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[340px] select-none pointer-events-none">
          <div className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-3">Sprint Board</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { col: 'To Do', color: 'bg-slate-500/20 border-slate-500/20', tasks: ['Write docs', 'Setup CI'] },
              { col: 'In Progress', color: 'bg-violet-500/20 border-violet-500/20', tasks: ['Auth flow', 'Dashboard UI'] },
              { col: 'Done', color: 'bg-emerald-500/20 border-emerald-500/20', tasks: ['DB schema', 'API routes', 'Login page'] },
            ].map(({ col, color, tasks }) => (
              <div key={col} className={`rounded-xl border ${color} p-2.5`}>
                <div className="text-white/40 text-[9px] font-semibold uppercase tracking-wider mb-2">{col}</div>
                {tasks.map(t => (
                  <div key={t} className="bg-white/5 border border-white/5 rounded-lg p-2 mb-1.5 last:mb-0">
                    <div className="text-white/60 text-[9px] leading-tight">{t}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[{ v: '12', l: 'Tasks' }, { v: '3', l: 'Members' }, { v: '85%', l: 'On track' }].map(({ v, l }) => (
              <div key={l} className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-white font-bold text-base">{v}</div>
                <div className="text-white/30 text-[9px] mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">TaskFlow</span>
          </div>
          <p className="text-white/25 text-xs max-w-xs leading-relaxed">
            Built for teams who care about shipping great work — not managing tools.
          </p>
        </div>

        <Link to="/" className="relative z-10 inline-flex items-center gap-1.5 text-white/25 hover:text-white/60 text-xs transition-colors mt-8">
          <ArrowLeft size={13} /> Back to home
        </Link>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-[380px] py-6">

          <Link to="/" className="lg:hidden inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-8 transition-colors">
            <ArrowLeft size={14} /> Home
          </Link>

          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-gray-900 dark:text-white tracking-tight">Create account</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Let's get you set up ✨</p>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-gray-400 dark:text-white/30">Profile completion</span>
              <span className="text-xs font-semibold text-violet-500">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <input
                placeholder="Vivek Jaiswal"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                className={inputCls}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className={inputCls}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  className={`${inputCls} pr-11`}
                />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/30 hover:text-gray-500 dark:hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && meta && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? meta.color : 'bg-gray-100 dark:bg-white/10'}`} />
                    ))}
                  </div>
                  <span className={`text-[11px] font-semibold shrink-0 ${meta.text}`}>{meta.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {['member', 'admin'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: r }))}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      form.role === r
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400'
                        : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-500 dark:text-white/40 hover:border-gray-300 dark:hover:border-white/20'
                    }`}
                  >
                    {form.role === r && <Check size={13} />}
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-1 rounded-xl bg-[#1a1a2e] dark:bg-violet-600 hover:bg-[#2d1b69] dark:hover:bg-violet-700 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 dark:text-white/30 mt-7">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline underline-offset-2">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

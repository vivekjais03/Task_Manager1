import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, ArrowRight, Zap, BarChart3, Users, Shield, Bell, CheckCircle2, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';


const stats = [
  { value: '10k+', label: 'Tasks shipped' },
  { value: '500+', label: 'Teams using it' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '4.9 / 5', label: 'Avg. rating' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Product Manager @ Razorpay', text: 'TaskFlow replaced Jira and Notion for us. Sprint planning went from 2 hours to 20 minutes.', color: 'from-violet-500 to-indigo-500' },
  { name: 'Arjun Mehta', role: 'Engineering Lead @ Zepto', text: 'The Kanban board is buttery smooth. My team actually looks forward to standups now.', color: 'from-sky-500 to-cyan-400' },
  { name: 'Sneha Rao', role: 'Founder @ BuildFast', text: 'Clean, fast, and does exactly what it promises. No fluff, no bloat, just results.', color: 'from-pink-500 to-rose-400' },
  { name: 'Rahul Verma', role: 'CTO @ Groww', text: 'We onboarded 40 engineers in a day. The role-based access is exactly what we needed.', color: 'from-amber-500 to-orange-400' },
  { name: 'Divya Nair', role: 'Design Lead @ Swiggy', text: 'Finally a tool that designers and devs can both use without fighting over it.', color: 'from-emerald-500 to-teal-400' },
  { name: 'Karan Singh', role: 'PM @ PhonePe', text: 'The analytics dashboard alone is worth switching. I can see everything in one view.', color: 'from-violet-500 to-pink-500' },
];

const marqueeItems = ['Kanban Boards', 'Sprint Planning', 'Team Analytics', 'Role-Based Access', 'Task Comments', 'Due Dates', 'Priority Flags', 'Dark Mode', 'Real-time Updates', 'Drag & Drop'];

export default function Landing() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-[#f9f9f7] dark:bg-[#080810] text-gray-900 dark:text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-black/5 dark:border-white/5 bg-[#f9f9f7]/80 dark:bg-[#080810]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="font-bold text-[17px] tracking-tight">TaskFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-500 dark:text-white/40">
            {['#features', '#stats', '#testimonials'].map((href, i) => (
              <a key={href} href={href} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                {['Features', 'Stats', 'Reviews'][i]}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={toggle} className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md shadow-violet-500/25">
              Get started →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-10">
        {/* Animated orbs */}
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none animate-orb"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full pointer-events-none animate-orb"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', animationDelay: '1.5s' }} />
        <div className="absolute top-40 right-[8%] w-64 h-64 rounded-full pointer-events-none animate-orb"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)', animationDelay: '3s' }} />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="animate-fade-up inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-500/10 border border-violet-200/60 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
            <Sparkles size={11} />
            Free for all teams · No credit card needed
          </div>

          <h1 className="animate-fade-up-delay text-[52px] md:text-[72px] font-black leading-[1.05] tracking-[-2px] mb-6">
            Ship work faster.<br />
            <span className="shimmer-text">Stay in sync.</span>
          </h1>

          <p className="animate-fade-up-delay2 text-lg text-gray-500 dark:text-white/35 max-w-lg mx-auto mb-10 leading-relaxed font-light">
            One workspace for your team's tasks, projects, and goals. No spreadsheets. No chaos. Just flow.
          </p>

          <div className="animate-fade-up-delay2 flex items-center justify-center gap-3 flex-wrap mb-5">
            <Link to="/register" className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-2xl transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5">
              Start for free
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/60 font-medium text-sm rounded-2xl hover:border-violet-300 dark:hover:border-violet-500/30 hover:-translate-y-0.5 transition-all shadow-sm">
              View demo
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-white/20">
            {['No setup required', 'Free forever for small teams', 'Cancel anytime'].map((t, i) => (
              <span key={t} className="flex items-center gap-1">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />}
                <CheckCircle2 size={11} className="text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Floating app mockup */}
        <div className="max-w-5xl mx-auto px-6 mt-16 relative z-10 animate-float-slow">
          {/* Glow under mockup */}
          <div className="absolute inset-x-20 bottom-0 h-20 bg-violet-500/20 blur-3xl rounded-full pointer-events-none" />

          <div className="relative rounded-[20px] border border-gray-200/80 dark:border-white/8 overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.12)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
            {/* Chrome bar */}
            <div className="flex items-center gap-1.5 px-5 py-3.5 bg-gray-50 dark:bg-[#0f0f1f] border-b border-gray-100 dark:border-white/5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <div className="flex-1 flex justify-center">
                <div className="bg-gray-100 dark:bg-white/5 rounded-lg h-6 w-52 flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-gray-400 dark:text-white/20 font-mono">app.taskflow.io/dashboard</span>
                </div>
              </div>
            </div>

            {/* App body */}
            <div className="bg-[#f5f5f3] dark:bg-[#0c0c18] p-4 grid grid-cols-12 gap-3 min-h-[320px]">
              {/* Sidebar */}
              <div className="col-span-2 bg-white dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/5 p-3 space-y-0.5">
                <div className="flex items-center gap-1.5 mb-3 px-1">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  </div>
                  <span className="text-[9px] font-bold text-gray-700 dark:text-white/60">TaskFlow</span>
                </div>
                {[['Dashboard', true], ['Projects', false], ['My Tasks', false], ['Team', false], ['Analytics', false]].map(([item, active]) => (
                  <div key={item} className={`rounded-lg px-2 py-1.5 text-[9px] font-medium ${active ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-white/25 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    {item}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="col-span-10 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-gray-800 dark:text-white/80">Good morning, Vivek 👋</div>
                    <div className="text-[9px] text-gray-400 dark:text-white/25">Here's what's happening today</div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg px-2.5 py-1 text-[9px] text-gray-500 dark:text-white/30">+ New Task</div>
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Total', value: '24', color: 'text-gray-800 dark:text-white', bg: '' },
                    { label: 'In Progress', value: '8', color: 'text-violet-600 dark:text-violet-400', bg: 'dark:bg-violet-500/5' },
                    { label: 'Completed', value: '13', color: 'text-emerald-600 dark:text-emerald-400', bg: 'dark:bg-emerald-500/5' },
                    { label: 'Overdue', value: '3', color: 'text-red-500', bg: 'dark:bg-red-500/5' },
                  ].map(({ label, value, color, bg }) => (
                    <div key={label} className={`bg-white dark:bg-white/[0.04] ${bg} border border-gray-100 dark:border-white/5 rounded-xl p-2.5`}>
                      <div className={`text-lg font-black ${color}`}>{value}</div>
                      <div className="text-[8px] text-gray-400 dark:text-white/25 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Kanban */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { col: 'To Do', dot: 'bg-gray-300 dark:bg-gray-600', tasks: [{ t: 'Write API docs', p: 'Low' }, { t: 'Setup staging', p: 'Med' }] },
                    { col: 'In Progress', dot: 'bg-violet-500', tasks: [{ t: 'Auth flow', p: 'High' }, { t: 'Dashboard UI', p: 'High' }, { t: 'Mobile layout', p: 'Med' }] },
                    { col: 'Done', dot: 'bg-emerald-500', tasks: [{ t: 'DB schema', p: 'High' }, { t: 'Login page', p: 'Med' }] },
                  ].map(({ col, dot, tasks }) => (
                    <div key={col} className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-xl p-2.5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                        <span className="text-[8px] font-bold text-gray-500 dark:text-white/30 uppercase tracking-widest">{col}</span>
                        <span className="ml-auto text-[8px] bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/20 rounded-full w-4 h-4 flex items-center justify-center font-semibold">{tasks.length}</span>
                      </div>
                      {tasks.map(({ t, p }) => (
                        <div key={t} className="bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/5 rounded-lg p-2 mb-1.5 last:mb-0">
                          <div className="text-[9px] text-gray-600 dark:text-white/50 mb-1">{t}</div>
                          <span className={`text-[7px] font-semibold px-1.5 py-0.5 rounded-full ${p === 'High' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : p === 'Med' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>{p}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="border-y border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.015] py-4 overflow-hidden mt-8">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-6 text-sm font-medium text-gray-400 dark:text-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <section id="stats" className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }, i) => (
            <div key={label} className="text-center p-6 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:border-violet-200 dark:hover:border-violet-500/20 transition-all group">
              <div className="text-4xl font-black tracking-tight mb-1 shimmer-text" style={{ animationDelay: `${i * 0.3}s` }}>{value}</div>
              <div className="text-sm text-gray-400 dark:text-white/25">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-10 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Built for how teams<br />
            <span className="shimmer-text">actually work.</span>
          </h2>
          <p className="text-gray-400 dark:text-white/30 max-w-sm mx-auto text-sm leading-relaxed">No bloat. No learning curve. Just the features that move work forward.</p>
        </div>

        {/* Row 1 — Kanban (wide) + Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">

          {/* Kanban — spans 3 cols */}
          <div className="md:col-span-3 group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:shadow-2xl hover:border-violet-200 dark:hover:border-violet-500/20 transition-all duration-500">
            <div className="p-7 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-300">
                <Zap size={19} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1.5">Kanban Boards</h3>
              <p className="text-sm text-gray-400 dark:text-white/30 leading-relaxed">Drag-and-drop tasks across stages. See your entire sprint at a glance.</p>
            </div>
            {/* Mini kanban preview */}
            <div className="px-5 pb-5">
              <div className="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3 border border-gray-100 dark:border-white/5">
                {[{col:'To Do',dot:'bg-gray-300 dark:bg-gray-600',items:['Write docs','Setup CI']},{col:'In Progress',dot:'bg-violet-500',items:['Auth flow','Dashboard']},{col:'Done',dot:'bg-emerald-500',items:['DB schema','Login']}].map(({col,dot,items})=>(
                  <div key={col}>
                    <div className="flex items-center gap-1 mb-2"><div className={`w-1.5 h-1.5 rounded-full ${dot}`}/><span className="text-[9px] font-bold text-gray-400 dark:text-white/25 uppercase tracking-wider">{col}</span></div>
                    {items.map(item=>(
                      <div key={item} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg px-2 py-1.5 mb-1 text-[9px] text-gray-500 dark:text-white/40">{item}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics — spans 2 cols */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:shadow-2xl hover:border-sky-200 dark:hover:border-sky-500/20 transition-all duration-500">
            <div className="p-7 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center mb-4 shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={19} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1.5">Live Analytics</h3>
              <p className="text-sm text-gray-400 dark:text-white/30 leading-relaxed">Velocity, burndown, completion rates — all in real time.</p>
            </div>
            {/* Mini chart preview */}
            <div className="px-5 pb-5">
              <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3 border border-gray-100 dark:border-white/5">
                <div className="flex items-end gap-1.5 h-16 mb-2">
                  {[40,65,45,80,60,90,75].map((h,i)=>(
                    <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-sky-500 to-cyan-400 opacity-80" style={{height:`${h}%`}} />
                  ))}
                </div>
                <div className="flex justify-between">
                  {['M','T','W','T','F','S','S'].map(d=>(
                    <span key={d} className="flex-1 text-center text-[8px] text-gray-300 dark:text-white/20">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 — Team + Role + Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Team Collaboration */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:shadow-2xl hover:border-pink-200 dark:hover:border-pink-500/20 transition-all duration-500">
            <div className="p-7 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300">
                <Users size={19} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1.5">Team Collaboration</h3>
              <p className="text-sm text-gray-400 dark:text-white/30 leading-relaxed">Invite members, assign roles, comment on tasks.</p>
            </div>
            <div className="px-5 pb-5 space-y-2">
              {[{name:'Vivek J.',role:'Admin',color:'from-violet-500 to-indigo-500'},{name:'Priya S.',role:'Member',color:'from-pink-500 to-rose-400'},{name:'Arjun M.',role:'Member',color:'from-sky-500 to-cyan-400'}].map(({name,role,color})=>(
                <div key={name} className="flex items-center gap-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-xl px-3 py-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>{name[0]}</div>
                  <span className="text-[10px] font-medium text-gray-600 dark:text-white/50 flex-1">{name}</span>
                  <span className={`text-[8px] font-semibold px-2 py-0.5 rounded-full ${role==='Admin'?'bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400':'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/25'}`}>{role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Role-Based Access */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:shadow-2xl hover:border-amber-200 dark:hover:border-amber-500/20 transition-all duration-500">
            <div className="p-7 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                <Shield size={19} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1.5">Role-Based Access</h3>
              <p className="text-sm text-gray-400 dark:text-white/30 leading-relaxed">Admins control everything. Members see only what they need.</p>
            </div>
            <div className="px-5 pb-5 space-y-2">
              {[{label:'Create projects',admin:true,member:false},{label:'Delete tasks',admin:true,member:false},{label:'View board',admin:true,member:true},{label:'Add comments',admin:true,member:true}].map(({label,admin,member})=>(
                <div key={label} className="flex items-center gap-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-xl px-3 py-2">
                  <span className="text-[10px] text-gray-500 dark:text-white/40 flex-1">{label}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full mr-1 ${admin?'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400':'bg-red-100 dark:bg-red-500/10 text-red-400'}`}>A</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${member?'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400':'bg-red-100 dark:bg-red-500/10 text-red-400'}`}>M</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:shadow-2xl hover:border-emerald-200 dark:hover:border-emerald-500/20 transition-all duration-500">
            <div className="p-7 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                <Bell size={19} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1.5">Smart Notifications</h3>
              <p className="text-sm text-gray-400 dark:text-white/30 leading-relaxed">Get pinged when it matters. Never miss an update.</p>
            </div>
            <div className="px-5 pb-5 space-y-2">
              {[
                {msg:'Priya assigned you a task',time:'2m ago',dot:'bg-violet-500'},
                {msg:'Arjun commented on Auth flow',time:'15m ago',dot:'bg-sky-500'},
                {msg:'Sprint #4 deadline tomorrow',time:'1h ago',dot:'bg-amber-500'},
              ].map(({msg,time,dot})=>(
                <div key={msg} className="flex items-start gap-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-xl px-3 py-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${dot} mt-1.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-gray-600 dark:text-white/50 leading-tight">{msg}</div>
                    <div className="text-[8px] text-gray-300 dark:text-white/20 mt-0.5">{time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="bg-white dark:bg-white/[0.015] border-y border-gray-100 dark:border-white/5 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black tracking-tight mb-3">Teams love it.</h2>
            <p className="text-gray-400 dark:text-white/25 text-sm">Don't take our word for it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map(({ name, role, text, color }) => (
              <div key={name} className="group p-6 rounded-2xl border border-gray-100 dark:border-white/5 bg-[#f9f9f7] dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/10 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-sm text-gray-600 dark:text-white/50 leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-black shrink-0 shadow-md`}>
                    {name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{name}</div>
                    <div className="text-xs text-gray-400 dark:text-white/25 mt-0.5">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-4xl mx-auto px-6 py-28 text-center">
        <div className="relative rounded-3xl overflow-hidden p-14 bg-gray-900 dark:bg-[#0d0d1f]">
          {/* Orbs inside CTA */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.35) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-32 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(14,165,233,0.15) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-64 h-32 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(236,72,153,0.12) 0%, transparent 70%)' }} />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/50 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Free to start · No card required
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              Your team is waiting.<br />
              <span className="shimmer-text">Start today.</span>
            </h2>
            <p className="text-white/30 mb-10 text-sm max-w-sm mx-auto leading-relaxed">
              Join 500+ teams already shipping faster with TaskFlow.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/register" className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold text-sm rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:-translate-y-0.5">
                Create free account
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white/60 font-medium text-sm rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="font-bold text-gray-800 dark:text-white/70 tracking-tight">TaskFlow</span>
          </div>

          <p className="text-xs text-gray-400 dark:text-white/20 text-center">
            © {new Date().getFullYear()} <span className="font-medium text-gray-500 dark:text-white/30">Vivek Jaiswal</span>. Built with ❤️ for modern teams.
          </p>

          <div className="flex items-center gap-6 text-xs font-medium text-gray-400 dark:text-white/20">
            <Link to="/login" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Sign in</Link>
            <Link to="/register" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

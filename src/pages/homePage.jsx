

import React, { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const GridIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="7" height="7" rx="1.2" />
    <rect x="14" y="3" width="7" height="7" rx="1.2" />
    <rect x="3" y="14" width="7" height="7" rx="1.2" />
    <rect x="14" y="14" width="7" height="7" rx="1.2" />
  </svg>
);
const InboxIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const LessonIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="14" y1="8" x2="20" y2="8" />
    <line x1="14" y1="13" x2="20" y2="13" />
    <line x1="14" y1="18" x2="20" y2="18" />
  </svg>
);
const TaskIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <polyline points="9,11 12,14 17,8" />
  </svg>
);
const GroupIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "white"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const ChevronLeft = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="15,18 9,12 15,6" />
  </svg>
);
const ChevronRight = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9,18 15,12 9,6" />
  </svg>
);
const DotsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ─── Circular Progress ────────────────────────────────────────────────────────
const CircularProgress = ({ pct = 32 }) => {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e7fb" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="#6366f1" strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      {/* Avatar */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
          <span className="text-3xl">🧑‍💻</span>
        </div>
      </div>
      {/* Badge */}
      <div className="absolute top-1 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
        {pct}%
      </div>
    </div>
  );
};

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart = () => {
  const groups = [
    { label: "1-10 Aug",  bars: [30, 38] },
    { label: "11-20 Aug", bars: [48, 24] },
    { label: "21-30 Aug", bars: [58, 32] },
  ];
  const max = 60;
  return (
    <div className="mt-4">
      <div className="flex items-end justify-between gap-3 h-20 px-1">
        {groups.map((g, gi) => (
          <div key={gi} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-end gap-1 w-full justify-center">
              {g.bars.map((val, bi) => (
                <div key={bi}
                  className={`rounded-t-md w-4 transition-all duration-500 ${bi === 0 ? "bg-indigo-300" : "bg-indigo-600"}`}
                  style={{ height: `${(val / max) * 64}px` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Y-axis labels */}
      <div className="relative">
        <div className="flex justify-between px-1 mt-1">
          {groups.map((g, i) => (
            <span key={i} className="text-[9px] text-gray-400 text-center flex-1">{g.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};


// ─── Course Progress Card ────────────────────────────────────────────────────
const courseCards = [
  { icon: "✖", iconBg: "bg-indigo-100", iconColor: "text-indigo-500", watched: 2, total: 8,  label: "UI/UX Design" },
  { icon: "🎨", iconBg: "bg-pink-100",   iconColor: "text-pink-500",   watched: 3, total: 8,  label: "Branding" },
  { icon: "📅", iconBg: "bg-cyan-100",   iconColor: "text-cyan-500",   watched: 6, total: 12, label: "Front End" },
];

const CourseCard = ({ icon, iconBg, iconColor, watched, total, label }) => (
  <div className="flex-1 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
      <span className={`text-lg ${iconColor}`}>{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-gray-400 font-medium">{watched}/{total} watched</p>
      <p className="text-sm font-bold text-gray-800 truncate">{label}</p>
      <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(watched / total) * 100}%` }} />
      </div>
    </div>
    <button className="text-gray-300 hover:text-gray-500 shrink-0"><DotsIcon /></button>
  </div>
);

// ─── Continue Watching Card ───────────────────────────────────────────────────
const watchCards = [
  { bg: "from-amber-400 to-orange-500",   emoji: "💻", title: "UI/UX Fundamentals",    progress: 25 },
  { bg: "from-slate-400 to-slate-600",    emoji: "🎯", title: "Brand Strategy 101",    progress: 38 },
  { bg: "from-indigo-400 to-purple-600",  emoji: "⚡", title: "Advanced Front End",    progress: 50 },
];

const WatchCard = ({ bg, emoji, title, progress }) => {
  const [liked, setLiked] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group">
      <div className={`relative h-36 bg-gradient-to-br ${bg} flex items-center justify-center`}>
        <span className="text-5xl opacity-80">{emoji}</span>
        <button onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/40 transition-colors">
          <HeartIcon filled={liked} />
        </button>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{progress}% complete</p>
      </div>
    </div>
  );
};

// ─── Mentor Card ─────────────────────────────────────────────────────────────
const mentors = [
  { name: "Alex Rivera",  role: "UX Expert",     emoji: "👨‍🎨", color: "bg-rose-100"   },
  { name: "Sara Kim",     role: "Brand Strategist", emoji: "👩‍💼", color: "bg-amber-100" },
];

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

      {/* ── Main Content ── */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto px-7 py-6">

          {/* Hero Banner */}
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 p-8 mb-5 overflow-hidden">
            {/* Decorative sparkles */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-20">
              <svg viewBox="0 0 200 200" className="w-48 h-48 text-white" fill="currentColor">
                <path d="M100 0 L110 90 L200 100 L110 110 L100 200 L90 110 L0 100 L90 90 Z" />
              </svg>
            </div>
            <div className="absolute right-36 top-8 opacity-10">
              <svg viewBox="0 0 100 100" className="w-16 h-16 text-white" fill="currentColor">
                <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" />
              </svg>
            </div>
            <p className="text-indigo-200 text-xs font-semibold tracking-widest uppercase mb-3">Online Course</p>
            <h1 className="text-white text-2xl font-extrabold leading-tight max-w-xs mb-6">
              Sharpen Your Skills with Professional Online Courses
            </h1>
            <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors shadow-lg">
              Join Now
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <ChevronRight />
              </span>
            </button>
          </div>

          {/* Course Progress Cards */}
          <div className="flex gap-4 mb-6">
            {courseCards.map((c) => <CourseCard key={c.label} {...c} />)}
          </div>

          {/* Continue Watching */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Continue Watching</h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
                <ChevronLeft />
              </button>
              <button className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-md">
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {watchCards.map((c) => <WatchCard key={c.title} {...c} />)}
          </div>
        </main>

        {/* ── Right Panel ── */}
        <aside className="w-72 shrink-0 overflow-y-auto px-5 py-6 border-l border-gray-100 bg-white">

          {/* Statistics */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">Statistic</h3>
            <button className="text-gray-300 hover:text-gray-500"><DotsIcon /></button>
          </div>

          <CircularProgress pct={32} />

          <div className="text-center mt-4 mb-1">
            <p className="text-base font-bold text-gray-900">Good Morning Jason 🔥</p>
            <p className="text-xs text-gray-400 mt-1">Continue your learning to achieve your target!</p>
          </div>

          {/* Y-axis labels + bar chart */}
          <div className="mt-5 bg-gray-50 rounded-2xl p-4">
            <div className="flex gap-2">
              {/* Y labels */}
              <div className="flex flex-col justify-between text-[10px] text-gray-400 h-20 pr-1 text-right">
                <span>60</span><span>40</span><span>20</span>
              </div>
              <div className="flex-1">
                <BarChart />
              </div>
            </div>
          </div>

          {/* Your Mentor */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">Your mentor</h3>
              <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                <PlusIcon />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {mentors.map((m) => (
                <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className={`w-10 h-10 ${m.color} rounded-xl flex items-center justify-center text-xl shrink-0`}>
                    {m.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.role}</p>
                  </div>
                  <button className="ml-auto text-gray-200 hover:text-indigo-500 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Lessons hint */}
          <div className="mt-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">Up Next</p>
            <p className="text-sm font-bold text-gray-900">Color Theory Basics</p>
            <p className="text-xs text-gray-400 mt-0.5">Branding module · 24 min</p>
            <div className="mt-3 h-1 bg-indigo-100 rounded-full">
              <div className="h-full w-0 bg-indigo-500 rounded-full" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
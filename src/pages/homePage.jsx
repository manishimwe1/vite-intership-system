

import React, { useState } from "react";
import RightPanel from "../components/RightPanel";
import HeroBanner from "../components/HeroBanner";
import CoursesSection from "../components/CoursesSection";

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



// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="flex h-screen  bg-red-50 overflow-hidden font-sans">

      {/* ── Main Content ── */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto px-7 pt-6 py-30">

          {/* Hero Banner */}
          <HeroBanner/>

          {/* Continue Watching */}
          {/* <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Continue Watching</h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
                <ChevronLeft />
              </button>
              <button className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-md">
                <ChevronRight />
              </button>
            </div>
          </div> */}
          

          {/* Courses Section */}
          <CoursesSection />
        </main>

        {/* ── Right Panel ── */}
        <RightPanel />
      </div>
    </div>
  );
}
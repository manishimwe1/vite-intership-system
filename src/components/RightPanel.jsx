import { useAuth } from "@/hooks/useAuth";
import React from "react";

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
const CircularProgress = ({ pct = 32,user }) => {
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
                     <img src={user?.image } alt="avatar" className="w-6 h-6 rounded-full" />

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

function RightPanel() {
  const {user} = useAuth();
 const mentors = [
    { name: user?.name,  role: "Full stack",     emoji: "👨‍🎨", color: "bg-rose-100"   },
    // { name: "Sara Kim",     role: "Brand Strategist", emoji: "👩‍💼", color: "bg-amber-100" },
  ];
  
  return (
    <aside className="w-72 shrink-0 overflow-y-auto px-5 pt-6 py-30 border-l border-gray-100 bg-white">
      {/* Statistics */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Statistic</h3>
          <button className="text-gray-300 hover:text-gray-500">
            <DotsIcon />
          </button>
        </div>

        <CircularProgress pct={32} user={user} />

        <div className="text-center mt-4 mb-1">
          <p className="text-base font-bold text-gray-900">
            {new Date().getHours() < 12 ? "Good Morning" : "Good Afternoon"} {user?.name} 🔥
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Continue your learning to achieve your target!
          </p>
        </div>

        {/* Y-axis labels + bar chart */}
      <div className="mt-5 bg-gray-50 rounded-2xl p-4">
        <div className="flex gap-2">
          {/* Y labels */}
          <div className="flex flex-col justify-between text-[10px] text-gray-400 h-20 pr-1 text-right">
            <span>60</span>
            <span>40</span>
            <span>20</span>
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
            <div
              key={m.name}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div
                className={`w-10 h-10 ${m.color} rounded-xl flex items-center justify-center text-xl shrink-0`}
              >
                {m.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {m.name}
                </p>
                <p className="text-xs text-gray-400">{m.role}</p>
              </div>
              <button className="ml-auto text-gray-200 hover:text-indigo-500 transition-colors">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Lessons hint */}
      <div className="mt-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">
          Up Next
        </p>
        <p className="text-sm font-bold text-gray-900">Color Theory Basics</p>
        <p className="text-xs text-gray-400 mt-0.5">Branding module · 24 min</p>
        <div className="mt-3 h-1 bg-indigo-100 rounded-full">
          <div className="h-full w-0 bg-indigo-500 rounded-full" />
        </div>
      </div>
    </aside>
  );
}

export default RightPanel;

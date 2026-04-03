import React from "react";
const ChevronRight = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9,18 15,12 9,6" />
  </svg>
);

const HeroBanner = () => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 p-8 mb-5 overflow-hidden">
      {/* Decorative sparkles */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-20">
        <svg
          viewBox="0 0 200 200"
          className="w-48 h-48 text-white"
          fill="currentColor"
        >
          <path d="M100 0 L110 90 L200 100 L110 110 L100 200 L90 110 L0 100 L90 90 Z" />
        </svg>
      </div>
      <div className="absolute right-36 top-8 opacity-10">
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 text-white"
          fill="currentColor"
        >
          <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" />
        </svg>
      </div>
      <p className="text-indigo-200 text-xs font-semibold tracking-widest uppercase mb-3">
        Online Course
      </p>
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
  );
};

export default HeroBanner;

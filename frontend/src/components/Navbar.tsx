"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6">
      {/* Logo */}
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg transition-transform duration-500 group-hover:rotate-180 flex items-center justify-center text-white font-bold">
          S
        </div>
        <span className="text-white font-display font-bold text-xl lowercase tracking-tight">
          superdesign
        </span>
      </div>

      {/* Center Pill */}
      <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-6 py-2 gap-8">
        <a href="#features" className="text-sm text-slate-300 hover:text-white transition-colors font-sans">Features</a>
        <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors font-sans">About</a>
        <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors font-sans">Pricing</a>
      </div>

      {/* Right CTA */}
      <button className="px-5 py-2 bg-white text-slate-900 rounded-full text-sm font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2">
        Get Started <ArrowRight size={16} />
      </button>
    </nav>
  );
};

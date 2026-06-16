"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, LogIn } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface NavbarProps {
  variant?: "landing" | "auth-login" | "auth-register";
}

export const Navbar: React.FC<NavbarProps> = ({ variant = "landing" }) => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg transition-transform duration-500 group-hover:rotate-180 flex items-center justify-center text-white font-bold">
          S
        </div>
        <span className="text-white font-display font-bold text-xl lowercase tracking-tight">
          superdesign
        </span>
      </Link>

      {variant === "landing" && (
        <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-6 py-2 gap-8">
          <a
            href="#features"
            className="text-sm text-slate-300 hover:text-white transition-colors duration-300 font-sans"
          >
            Features
          </a>
          <a
            href="#faq"
            className="text-sm text-slate-300 hover:text-white transition-colors duration-300 font-sans"
          >
            FAQ
          </a>
          <Link
            href="/auth/login"
            className="text-sm text-slate-300 hover:text-white transition-colors duration-300 font-sans"
          >
            Sign In
          </Link>
        </div>
      )}

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="px-5 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all duration-300 active:scale-95 flex items-center gap-2"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
        ) : (
          <Link
            href={variant === "auth-register" ? "/auth/login" : "/auth/register"}
            className="px-5 py-2 bg-white text-slate-900 rounded-full text-sm font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-slate-100 transition-all duration-300 active:scale-95 flex items-center gap-2"
          >
            {variant === "auth-register" ? (
              <>
                <LogIn size={16} /> Sign In
              </>
            ) : variant === "auth-login" ? (
              <>
                Sign Up <ArrowRight size={16} />
              </>
            ) : (
              <>
                Get Started <ArrowRight size={16} />
              </>
            )}
          </Link>
        )}
      </div>
    </nav>
  );
};

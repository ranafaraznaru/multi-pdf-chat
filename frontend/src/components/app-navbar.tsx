"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function AppNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDashboard = pathname === "/dashboard";
  const docMatch = pathname.match(/^\/dashboard\/([^/]+)$/);
  const activeDocId = docMatch?.[1];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg transition-transform duration-500 group-hover:rotate-180 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="text-white font-display font-bold text-lg lowercase tracking-tight hidden sm:block">
              superdesign
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 glass-soft rounded-full px-2 py-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                isDashboard
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard size={16} />
              Vault
            </Link>
            {activeDocId && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-white/10 text-indigo-300">
                <MessageSquare size={16} />
                Chat
              </span>
            )}
          </nav>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 glass-soft rounded-full pl-2 pr-4 py-1.5 hover:bg-white/10 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-white text-sm font-medium leading-tight">
                {user?.name ?? "User"}
              </p>
              <p className="text-slate-400 text-xs truncate max-w-[140px]">
                {user?.email}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl py-2 z-50 animate-slide-down">
                <div className="px-4 py-3 border-b border-white/10 sm:hidden">
                  <p className="text-white text-sm font-medium">{user?.name}</p>
                  <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <FileText size={16} />
                  My Documents
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

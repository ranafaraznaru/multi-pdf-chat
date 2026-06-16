"use client";

import React from "react";
import { AppNavbar } from "@/components/app-navbar";
import { AmbientBackground } from "@/components/ambient-background";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col">
      <AmbientBackground />
      <AppNavbar />
      <main className="relative z-10 flex-1">{children}</main>
    </div>
  );
}

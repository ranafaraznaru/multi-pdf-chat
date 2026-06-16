"use client";

import React, { Suspense, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { GlassPanel } from "@/components/glass-panel";
import { Navbar } from "@/components/navbar";
import { AmbientBackground } from "@/components/ambient-background";
import { Mail, Lock, Globe, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password }, redirectTo);
    } catch {
      // Error toast handled by API layer
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassPanel
      variant="strong"
      className="w-full max-w-md p-8 rounded-3xl relative z-10"
    >
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl text-white tracking-tight mb-2">
          Welcome back
        </h1>
        <p className="text-slate-400 font-sans text-sm">
          Enter your credentials to access your vault
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <div className="space-y-2">
          <label className="text-xs font-display uppercase tracking-widest text-slate-400 ml-2">
            Email Address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
              placeholder="name@company.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-display uppercase tracking-widest text-slate-400 ml-2">
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          {isLoading ? "Authenticating..." : "Sign In"}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-2 text-slate-500 font-display tracking-widest">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-3 p-3 rounded-xl glass-soft text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium"
        >
          <Globe size={18} /> Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-3 p-3 rounded-xl glass-soft text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium"
        >
          <Users size={18} /> Facebook
        </button>
      </div>

      <p className="text-center mt-8 text-slate-400 text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300"
        >
          Create one here
        </Link>
      </p>
    </GlassPanel>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <Navbar variant="auth-login" />
      <AmbientBackground />

      <Suspense
        fallback={
          <GlassPanel
            variant="strong"
            className="w-full max-w-md p-8 rounded-3xl relative z-10"
          >
            <p className="text-slate-400 text-center">Loading...</p>
          </GlassPanel>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}

"use client";

import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { ShieldAlert, RefreshCw, ArrowRight } from "lucide-react";
import Preloader from "../../../components/Preloader";

export default function AdminSignInPage() {
  const { isSignedIn, signInAdmin, mounted } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return;
    setLoading(true);

    setTimeout(() => {
      const check = signInAdmin(email, password);
      if (!check.success) {
        setError(check.error || "Invalid administrative credentials.");
        setLoading(false);
      }
    }, 700);
  };

  if (!mounted || isSignedIn) {
    return <Preloader message="CONNECTING TO PERCEPTION ADMIN GATEWAY..." />;
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 py-12 overflow-hidden bg-slate-950 font-sans">
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-25%] w-[80%] h-[80%] rounded-full bg-pink-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="flex items-center space-x-3 mb-8 relative z-10 select-none">
        <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2.5 rounded-xl border border-purple-500/20 shadow-lg">
          <ShieldAlert className="h-5 w-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
            PERCEPTION CORE AI
          </h1>
          <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block">
            Platform Administration Gate
          </span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        <form onSubmit={handleAdminSignIn} className="space-y-5 text-left text-xs">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold tracking-wide text-white">Admin Console</h2>
            <p className="text-xs text-slate-400 mt-1">Authorized accounts verify gateway only.</p>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/20 text-rose-400 rounded-xl font-semibold flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin1@perception.ai"
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:outline-none rounded-xl px-3 py-2.5 text-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:outline-none rounded-xl px-3 py-2.5 text-slate-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold border border-purple-400/20 shadow-lg transition flex items-center justify-center select-none uppercase tracking-wider"
          >
            {loading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" />
                <span>Authorizing Session...</span>
              </>
            ) : (
              <>
                <span>Unlock Admin Panel</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </button>
        </form>
      </div>
      <div className="mt-12 text-center text-[10px] text-slate-600 relative z-10">
        © 2026 Perception Mapper AI. Platform Administrator separation active.
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

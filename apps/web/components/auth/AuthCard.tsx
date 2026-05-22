"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function AuthCard({ children, title, description }: AuthCardProps) {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 overflow-hidden bg-slate-950 font-sans">
      {/* Decorative gradients */}
      <div className="absolute top-[-20%] left-[-15%] w-[65%] h-[65%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-20%] w-[70%] h-[70%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      {/* Brand Header */}
      <div className="flex items-center space-x-3 mb-8 relative z-10 select-none">
        <div className="bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-2.5 rounded-xl border border-indigo-400/20 shadow-lg">
          <Sparkles className="h-5 w-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
            PERCEPTION MAPPER AI
          </h1>
          <span className="text-[9px] text-indigo-400 font-extrabold tracking-widest uppercase block">NLP Security Gate</span>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        <div className="space-y-2 text-center mb-6">
          <h2 className="text-lg font-bold tracking-wide text-white">{title}</h2>
          <p className="text-xs text-slate-400 leading-normal max-w-xs mx-auto">
            {description}
          </p>
        </div>

        {children}
      </div>

      {/* Footer copyright */}
      <div className="mt-12 text-center text-[10px] text-slate-600 relative z-10 select-none">
        © 2026 Perception Mapper AI. Encrypted verification gateways.
      </div>
    </div>
  );
}

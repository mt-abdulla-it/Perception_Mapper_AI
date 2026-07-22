"use client";

import React from "react";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-25%] w-[80%] h-[80%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] rounded-full bg-pink-500/3 blur-[130px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      {children}
    </div>
  );
}

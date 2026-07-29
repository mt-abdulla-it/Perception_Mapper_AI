import React from "react";

interface PreloaderProps {
  message?: string;
}

export default function Preloader({ message = "INITIALIZING PERCEPTION COGNITIVE CORE HANDSHAKE..." }: PreloaderProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center font-mono text-[10px] text-slate-500 select-none">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 blur opacity-30 animate-pulse" />
        <div className="relative bg-slate-950 border border-slate-900 rounded-xl px-6 py-4 flex items-center space-x-3.5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Github } from "lucide-react";

interface OAuthButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function GitHubButton({ onClick, disabled }: OAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-full px-4 py-2.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 transition-all duration-200 disabled:opacity-50 select-none shadow-sm"
    >
      <Github className="h-4 w-4 mr-2.5 shrink-0 text-white fill-white/10" />
      <span>Continue with GitHub</span>
    </button>
  );
}

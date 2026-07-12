"use client";

import React, { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  icon?: LucideIcon;
}

export default function AuthInput({
  label,
  id,
  type = "text",
  error,
  icon: Icon,
  className = "",
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-2 w-full text-left font-sans">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="block text-[9px] font-black text-slate-400 uppercase tracking-widest select-none">
          {label}
        </label>
      </div>

      <div className="relative rounded-xl shadow-md">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-slate-500 transition-colors duration-200" aria-hidden="true" />
          </div>
        )}

        <input
          id={id}
          type={inputType}
          className={`w-full bg-slate-950/40 backdrop-blur-sm border ${
            error 
              ? "border-rose-500/40 focus:border-rose-500/80 focus:ring-rose-500/10" 
              : "border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500/80 focus:ring-indigo-500/10"
          } focus:outline-none focus:ring-4 rounded-xl py-2.5 ${Icon ? "pl-9.5" : "px-3.5"} ${
            isPassword ? "pr-10" : "pr-3.5"
          } text-xs text-slate-200 placeholder-slate-600 transition-all duration-200 font-medium`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors duration-200"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[10px] font-bold text-rose-500 mt-1 pl-1 tracking-wide animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}

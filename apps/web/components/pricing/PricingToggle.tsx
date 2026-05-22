"use client";
import React from 'react';

interface PricingToggleProps {
  isAnnual: boolean;
  onChange: (val: boolean) => void;
}

export default function PricingToggle({ isAnnual, onChange }: PricingToggleProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 select-none">
      <div className="flex items-center space-x-3 bg-slate-900/60 border border-slate-800/80 rounded-full p-1.5 shadow-inner">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            !isAnnual
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Bill Monthly"
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            isAnnual
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Bill Annually"
        >
          Annually
        </button>
      </div>
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 bg-indigo-950/30 border border-indigo-500/20 rounded-md uppercase tracking-wider">
        <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
        <span>Save 20% on Annual billing</span>
      </span>
    </div>
  );
}

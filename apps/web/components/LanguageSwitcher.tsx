"use client";
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center space-x-2 bg-slate-900/65 border border-slate-800/80 rounded-xl px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:border-indigo-500/30 transition shadow-sm">
      <Globe className="h-3.5 w-3.5 text-indigo-400" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as any)}
        className="bg-transparent text-slate-300 focus:outline-none cursor-pointer border-none font-bold uppercase tracking-wider text-[10px]"
        aria-label="Select Language"
      >
        <option value="en" className="bg-slate-950 text-slate-200">English</option>
        <option value="ta" className="bg-slate-950 text-slate-200">தமிழ்</option>
      </select>
    </div>
  );
}

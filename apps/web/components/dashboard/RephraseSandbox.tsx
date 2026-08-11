"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles, AlertCircle, RefreshCw, CheckCircle, Newspaper, Heart, Briefcase } from "lucide-react";
import { fetchAIRephrasings } from "../../lib/api";

interface RephraseSandboxProps {
  isOpen: boolean;
  onClose: () => void;
  quote: string;
  language: string;
  onSelectRephrase: (rephrasedText: string) => void;
}

export default function RephraseSandbox({
  isOpen,
  onClose,
  quote,
  language,
  onSelectRephrase,
}: RephraseSandboxProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<{
    journalistic: string;
    empathetic: string;
    professional: string;
  } | null>(null);
  const [appliedStyle, setAppliedStyle] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && quote) {
      setLoading(true);
      setError(null);
      setAlternatives(null);
      setAppliedStyle(null);

      const apiKey = localStorage.getItem("pm_gemini_api_key") || undefined;

      fetchAIRephrasings(quote, language, apiKey)
        .then((res) => {
          if (res.success && res.alternatives) {
            setAlternatives(res.alternatives);
          } else {
            setError("Unable to retrieve AI alternatives from the engine.");
          }
        })
        .catch((err) => {
          setError(err.message || "An unexpected error occurred while rephrasing.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, quote, language]);

  if (!isOpen) return null;

  const handleApply = (style: string, text: string) => {
    setAppliedStyle(style);
    setTimeout(() => {
      onSelectRephrase(text);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Decorative background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/5 blur-[80px] pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900/80 relative z-10 select-none">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4.5 w-4.5 text-purple-400 animate-pulse" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AI Rephrase Sandbox
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white rounded-lg transition duration-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          {/* Source Quote */}
          <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/60">
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Original Flagged Context</span>
            <p className="text-xs text-slate-300 italic font-mono leading-relaxed">"{quote}"</p>
          </div>

          {/* AI Loader */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="h-6 w-6 text-purple-400 animate-spin" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                Consulting AI Models...
              </span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-950/20 text-rose-400 flex items-center space-x-3 text-xs">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Execution Interrupted</p>
              <p className="text-[10px] text-rose-400 mt-0.5">{error}</p>
            </div>
          </div>
          )}

          {/* Alternatives Grid */}
          {alternatives && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in slide-in-from-bottom-4 duration-500 font-sans">
              {/* Journalistic / Factual Card */}
              <div 
                onClick={() => handleApply("journalistic", alternatives.journalistic)}
                className={`relative group cursor-pointer border rounded-2xl p-5 transition-all duration-350 flex flex-col justify-between min-h-[220px] select-none hover:scale-[1.025] hover:shadow-[0_0_20px_rgba(99,102,241,0.04)] ${
                  appliedStyle === "journalistic" 
                    ? "bg-indigo-950/40 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30 text-white" 
                    : "bg-slate-950/50 border-slate-850 hover:border-indigo-500/35 hover:bg-indigo-950/10 text-slate-300"
                }`}
              >
                {/* Glow effect on hover */}
                <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-full bg-indigo-500/5 blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-305 pointer-events-none" />

                <div className="space-y-3.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-indigo-500/30 transition-colors">
                        <Newspaper className="h-3.5 w-3.5 text-indigo-400" />
                      </div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-200">Journalistic</span>
                    </div>
                    {appliedStyle === "journalistic" && <CheckCircle className="h-4.5 w-4.5 text-indigo-400" />}
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-400 group-hover:text-slate-200 transition-colors">
                    {alternatives.journalistic}
                  </p>
                </div>
                <div className="text-[8px] font-extrabold uppercase tracking-widest text-indigo-400 group-hover:underline self-end pt-3 relative z-10">
                  Apply Style
                </div>
              </div>

              {/* Empathetic / Warm Card */}
              <div 
                onClick={() => handleApply("empathetic", alternatives.empathetic)}
                className={`relative group cursor-pointer border rounded-2xl p-5 transition-all duration-350 flex flex-col justify-between min-h-[220px] select-none hover:scale-[1.025] hover:shadow-[0_0_20px_rgba(20,184,166,0.04)] ${
                  appliedStyle === "empathetic" 
                    ? "bg-teal-950/40 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.15)] ring-1 ring-teal-500/30 text-white" 
                    : "bg-slate-950/50 border-slate-850 hover:border-teal-500/35 hover:bg-teal-950/10 text-slate-300"
                }`}
              >
                {/* Glow effect on hover */}
                <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-full bg-teal-500/5 blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-305 pointer-events-none" />

                <div className="space-y-3.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-teal-500/30 transition-colors">
                        <Heart className="h-3.5 w-3.5 text-teal-400" />
                      </div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-200">Empathetic</span>
                    </div>
                    {appliedStyle === "empathetic" && <CheckCircle className="h-4.5 w-4.5 text-teal-400" />}
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-400 group-hover:text-slate-200 transition-colors">
                    {alternatives.empathetic}
                  </p>
                </div>
                <div className="text-[8px] font-extrabold uppercase tracking-widest text-teal-400 group-hover:underline self-end pt-3 relative z-10">
                  Apply Style
                </div>
              </div>

              {/* Professional / Clear Card */}
              <div 
                onClick={() => handleApply("professional", alternatives.professional)}
                className={`relative group cursor-pointer border rounded-2xl p-5 transition-all duration-350 flex flex-col justify-between min-h-[220px] select-none hover:scale-[1.025] hover:shadow-[0_0_20px_rgba(168,85,247,0.04)] ${
                  appliedStyle === "professional" 
                    ? "bg-purple-950/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/30 text-white" 
                    : "bg-slate-950/50 border-slate-850 hover:border-purple-500/35 hover:bg-purple-950/10 text-slate-300"
                }`}
              >
                {/* Glow effect on hover */}
                <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-full bg-purple-500/5 blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-305 pointer-events-none" />

                <div className="space-y-3.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-purple-500/30 transition-colors">
                        <Briefcase className="h-3.5 w-3.5 text-purple-400" />
                      </div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-200">Professional</span>
                    </div>
                    {appliedStyle === "professional" && <CheckCircle className="h-4.5 w-4.5 text-purple-400" />}
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-400 group-hover:text-slate-200 transition-colors">
                    {alternatives.professional}
                  </p>
                </div>
                <div className="text-[8px] font-extrabold uppercase tracking-widest text-purple-400 group-hover:underline self-end pt-3 relative z-10">
                  Apply Style
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 border-t border-slate-900 bg-slate-950/70 text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center select-none">
          ⚡ Selecting a style inserts it directly into your dashboard playground editor.
        </div>
      </div>
    </div>
  );
}

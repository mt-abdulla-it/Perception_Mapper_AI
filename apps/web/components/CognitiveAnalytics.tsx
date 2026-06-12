"use client";

import React from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";
import { Badge } from "@perception-mapper/ui";
import { AnalysisResult } from "../types";
import TTSReadout from "./dashboard/TTSReadout";

interface CognitiveAnalyticsProps {
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  onRephrase: (quote: string, rephrase: string) => void;
  onExploreRephrase: (quote: string) => void;
}

export default function CognitiveAnalytics({ analysisResult, isAnalyzing, onRephrase, onExploreRephrase }: CognitiveAnalyticsProps) {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
        <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Evaluating structures...</span>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="flex items-center justify-center text-center py-20 text-slate-600 font-mono text-xs select-none">
        Launch scanning sequence above to compile perception metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs animate-in fade-in duration-300 font-sans">
      <div className="grid grid-cols-2 gap-4">
        {[
          { 
            label: "Objectivity Index", 
            val: analysisResult.scores.objectivity, 
            color: "text-indigo-500",
            glowColor: "rgba(99, 102, 241, 0.4)",
            bgGlow: "bg-indigo-500/5"
          },
          { 
            label: "Bias Risk Index", 
            val: analysisResult.scores.biasIndex, 
            color: "text-pink-500",
            glowColor: "rgba(244, 63, 94, 0.4)",
            bgGlow: "bg-pink-500/5"
          }
        ].map((gauge, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 backdrop-blur-md text-center flex flex-col items-center space-y-3 transition-all duration-300 hover:border-slate-700/80 shadow-lg ${gauge.bgGlow}`}
          >
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">{gauge.label}</span>
            <div className="relative flex items-center justify-center w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <defs>
                  <filter id={`circleGlow-${i}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path className="text-slate-900/80" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path 
                  className={`${gauge.color} transition-all duration-1000`} 
                  filter={`url(#circleGlow-${i})`} 
                  strokeDasharray={`${gauge.val}, 100`} 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="none" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                />
              </svg>
              <span className="absolute text-xs font-black text-white font-mono tracking-tight">{gauge.val}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3.5 bg-slate-950/50 border border-slate-900/80 p-4 rounded-2xl backdrop-blur-md transition-all duration-300 hover:border-slate-800 shadow-md">
        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Tone breakdowns</span>
        <div className="space-y-2.5">
          {analysisResult.tones.map((t, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-300">
                <span className="font-medium">{t.name}</span>
                <span className="font-mono text-slate-500 font-bold">{t.score}%</span>
              </div>
              <div className="w-full bg-slate-900/60 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r ${t.color} h-full rounded-full transition-all duration-1000`} 
                  style={{ width: `${t.score}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 pr-1 max-h-[170px] overflow-y-auto custom-scrollbar">
        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Matched Bias Indicators</span>
        {analysisResult.biases.map((b, idx) => (
          <div 
            key={idx} 
            className="p-3 rounded-xl border border-slate-900 bg-slate-950/30 backdrop-blur-sm hover:bg-slate-950/60 hover:border-slate-800/80 space-y-2 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-indigo-400 text-[10px] flex items-center">
                <ShieldAlert className="h-3.5 w-3.5 mr-1.5 text-pink-400" /> {b.type}
              </span>
              <Badge variant="neutral" className="text-[8px] uppercase tracking-wider font-extrabold border-slate-800/80 bg-slate-900/40 text-slate-400">
                Recommend Rephrase
              </Badge>
            </div>
            <div className="flex items-start justify-between space-x-2.5">
              <p className="text-[10px] text-slate-300 italic leading-relaxed">"{b.quote}"</p>
              <div className="flex items-center space-x-1.5 shrink-0 mt-0.5">
                <button 
                  onClick={() => onExploreRephrase(b.quote)}
                  className="px-2 py-0.5 text-[8px] font-black text-indigo-400 border border-indigo-500/25 hover:border-indigo-400 hover:text-white bg-indigo-950/15 hover:bg-indigo-900/30 rounded-lg transition duration-200 uppercase tracking-wider"
                  title="Explore AI Rephrasings"
                >
                  AI Co-pilot
                </button>
                <TTSReadout text={b.quote} mode="emotional" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-900/80">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">💡 Substitute:</span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onRephrase(b.quote, b.rephrase)} 
                  className="text-emerald-400 font-black hover:text-emerald-300 hover:underline transition duration-150 text-[10px]"
                >
                  "{b.rephrase}"
                </button>
                <TTSReadout text={b.rephrase} mode="neutral" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

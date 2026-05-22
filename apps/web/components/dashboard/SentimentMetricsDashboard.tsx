"use client";

import React, { useState } from "react";
import { AreaChart, ShieldAlert, BarChart3, TrendingUp } from "lucide-react";

export default function SentimentMetricsDashboard() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = [
    { label: "Mon", scans: 24, latency: "0.04 ms", bias: 32 },
    { label: "Tue", scans: 45, latency: "0.05 ms", bias: 28 },
    { label: "Wed", scans: 35, latency: "0.03 ms", bias: 41 },
    { label: "Thu", scans: 60, latency: "0.04 ms", bias: 18 },
    { label: "Fri", scans: 78, latency: "0.02 ms", bias: 15 }
  ];

  return (
    <div className="bg-slate-950/40 border border-slate-900/60 backdrop-blur-md rounded-2xl p-6 relative select-none font-sans overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-6">
        <div className="flex items-center space-x-2">
          <AreaChart className="h-4 w-4 text-pink-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Sentiment Dynamics Metrics</h3>
        </div>
        <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-pink-950/40 border border-pink-500/20 text-pink-400">
          Telemetry Analytics Live
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative bg-slate-950/50 border border-slate-900/80 rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block text-left">Daily Scanning Velocity</span>
            <span className="text-[10px] text-pink-400 font-bold flex items-center"><TrendingUp className="h-3.5 w-3.5 mr-1" /> +32%</span>
          </div>

          <svg className="w-full h-[120px]" viewBox="0 0 340 120">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(236, 72, 153, 0.4)" />
                <stop offset="100%" stopColor="rgba(236, 72, 153, 0.0)" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="10" y1="20" x2="330" y2="20" className="stroke-slate-900/60 stroke-[1]" />
            <line x1="10" y1="60" x2="330" y2="60" className="stroke-slate-900/60 stroke-[1]" />
            <line x1="10" y1="100" x2="330" y2="100" className="stroke-slate-900 stroke-[1.5]" />

            {/* Area Area */}
            <path d="M 10 90 Q 90 40 170 60 T 330 15 L 330 100 L 10 100 Z" className="fill-[url(#areaGrad)]" />
            
            {/* Stroke Line */}
            <path d="M 10 90 Q 90 40 170 60 T 330 15" className="fill-none stroke-pink-500 stroke-[2] shadow-lg" />

            {/* Hitboxes & Indicators */}
            {[{ x: 10, y: 90 }, { x: 90, y: 50 }, { x: 170, y: 60 }, { x: 250, y: 38 }, { x: 330, y: 15 }].map((pt, idx) => (
              <g key={idx} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
                <circle cx={pt.x} cy={pt.y} r={hoveredIndex === idx ? 6 : 4} className="fill-slate-950 stroke-pink-500 stroke-[2] cursor-pointer transition duration-200" />
              </g>
            ))}
          </svg>

          <div className="flex justify-between px-2 text-[8px] font-bold text-slate-500 uppercase">
            {data.map((d, i) => <span key={i}>{d.label}</span>)}
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 min-h-[220px] flex flex-col justify-between">
          {hoveredIndex !== null ? (
            <div className="space-y-3 text-left">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 block">Scope Analytics</span>
              <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-pink-400" />
                <span>Vector Log: {data[hoveredIndex].label}</span>
              </h4>
              <div className="space-y-1.5 text-[10px] text-slate-400 font-semibold leading-normal">
                <p>Transactions: <span className="text-slate-200 font-bold">{data[hoveredIndex].scans} requests</span></p>
                <p>Accuracy Speed: <span className="text-pink-400 font-bold">{data[hoveredIndex].latency}</span></p>
                <p>Average Bias Density: <span className="text-indigo-400 font-bold">{data[hoveredIndex].bias}%</span></p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-8">
              <ShieldAlert className="h-8 w-8 text-slate-700 animate-pulse" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hover node data points to audit scopes</p>
            </div>
          )}
          {hoveredIndex !== null && (
            <div className="w-full text-center text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950/40 py-1.5 border border-slate-900 rounded-lg">
              Transaction verified
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

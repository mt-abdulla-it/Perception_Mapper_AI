"use client";

import React from "react";
import { Cpu, Radio } from "lucide-react";
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from "recharts";

interface LiveTelemetryProps {
  liveMetrics: {
    latencyMs: number;
    cpuLoad: number;
    memoryMb: number;
    activeConnections: number;
  };
  telemetryHistory: any[];
}

export default function LiveTelemetry({ liveMetrics, telemetryHistory }: LiveTelemetryProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cpu className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Live Telemetry</h3>
        </div>
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-950/40 text-emerald-400 text-[8px] font-bold uppercase tracking-wider">
          <Radio className="h-2 w-2 animate-pulse" />
          <span>Stream Active</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Latency", val: `${liveMetrics.latencyMs} ms`, color: "text-white" },
          { label: "CPU Workload", val: `${liveMetrics.cpuLoad}%`, color: "text-indigo-400" },
          { label: "Memory Allocation", val: `${liveMetrics.memoryMb} MB`, color: "text-white" },
          { label: "Active Connections", val: `${liveMetrics.activeConnections} sockets`, color: "text-purple-400" }
        ].map((item, i) => (
          <div key={i} className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/50">
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
            <span className={`text-sm font-extrabold mt-1 block ${item.color}`}>{item.val}</span>
          </div>
        ))}
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={telemetryHistory}>
            <defs>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#475569" fontSize={8} tickLine={false} />
            <YAxis stroke="#475569" fontSize={8} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", fontSize: 9, borderRadius: 8 }} />
            <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#6366f1" strokeWidth={1.5} fillOpacity={1} fill="url(#colorLatency)" />
            <Area type="monotone" dataKey="cpu" name="CPU (%)" stroke="#a855f7" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCpu)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

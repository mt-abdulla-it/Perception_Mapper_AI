"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { Badge } from "@perception-mapper/ui";

interface AuditLogConsoleProps {
  terminalLogs: string[];
  onClearLogs: () => void;
}

export default function AuditLogConsole({ terminalLogs, onClearLogs }: AuditLogConsoleProps) {
  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
            Console Stream
          </h3>
        </div>
        <Badge variant="success" className="text-[8px] font-mono select-none bg-emerald-950/40 border-emerald-800/20 text-emerald-400">
          WebSockets Stream
        </Badge>
      </div>

      <div className="flex-grow bg-slate-950/85 border border-slate-900 rounded-xl p-4 font-mono text-[9px] text-emerald-400 space-y-2 h-64 overflow-y-auto max-w-full">
        {terminalLogs.length === 0 ? (
          <div className="text-slate-650 italic">Orbital connection established. Waiting for logs...</div>
        ) : (
          terminalLogs.map((log, index) => (
            <div key={index} className="leading-relaxed break-all">
              <span className="text-indigo-400 font-bold select-none">❯</span> {log}
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold select-none uppercase">
        <span>Channel: SSL encrypted</span>
        <button
          onClick={onClearLogs}
          className="text-indigo-400 hover:text-indigo-300 transition hover:underline"
        >
          Clear Log View
        </button>
      </div>
    </div>
  );
}

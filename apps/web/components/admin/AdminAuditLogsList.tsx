"use client";

import React, { useState } from "react";
import { Download, Search } from "lucide-react";
import { AuditLog } from "../../types";

interface AdminAuditLogsListProps {
  logs: AuditLog[];
  onExport: () => void;
}

export default function AdminAuditLogsList({ logs, onExport }: AdminAuditLogsListProps) {
  const [query, setQuery] = useState("");
  const filtered = logs.filter((log) =>
    log.activity?.toLowerCase().includes(query.toLowerCase()) ||
    log.details?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md space-y-4 text-xs text-slate-300">
      <div className="flex justify-between items-center pb-3 border-b border-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Platform Audit Logs</h3>
        <button onClick={onExport} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition text-[10px] font-bold uppercase tracking-wide">
          <Download className="h-3 w-3" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search activity audit logs..."
          className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-650 outline-none transition"
        />
      </div>

      <div className="overflow-y-auto max-h-[400px] border border-slate-900 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-950 border-b border-slate-900 text-slate-500 text-[8px] font-bold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 pl-3">Log ID</th>
              <th className="py-2.5">Activity</th>
              <th className="py-2.5">Details</th>
              <th className="py-2.5">Latency</th>
              <th className="py-2.5 pr-3 text-right">Tokens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 font-mono text-[10px] text-slate-400">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-900/10">
                <td className="py-2.5 pl-3 text-slate-500 truncate max-w-[60px]">{log.id}</td>
                <td className="py-2.5 font-sans font-bold text-slate-300">{log.activity}</td>
                <td className="py-2.5 font-sans text-slate-400 truncate max-w-[150px]" title={log.details}>{log.details}</td>
                <td className="py-2.5">{log.latencyMs} ms</td>
                <td className="py-2.5 pr-3 text-right text-purple-400">{log.tokensCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

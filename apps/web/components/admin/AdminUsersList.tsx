"use client";

import React, { useState } from "react";
import { Search, RefreshCw, Lock, Unlock, ShieldAlert, Trash2 } from "lucide-react";
import { UserProfile } from "../../types";

interface AdminUsersListProps {
  users: UserProfile[];
  isLoading: boolean;
  actionLoading: string | null;
  onRefresh: () => void;
  onToggleBlock: (user: UserProfile) => void;
  onToggleRole: (user: UserProfile) => void;
  onUpdatePlan: (id: string, email: string, tier: string) => void;
  onDelete: (id: string, email: string) => void;
}

export default function AdminUsersList({
  users, isLoading, actionLoading, onRefresh, onToggleBlock, onToggleRole, onUpdatePlan, onDelete
}: AdminUsersListProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.email?.toLowerCase().includes(q) || u.name?.toLowerCase().includes(q);
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md space-y-5 text-xs text-slate-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search user name or email..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-650 outline-none transition"
          />
        </div>
        <button onClick={onRefresh} disabled={isLoading} className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-900 border border-slate-800 hover:text-white rounded-xl transition text-xs font-semibold text-slate-300">
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Sync Directory</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900 text-slate-500 text-[9px] font-bold uppercase tracking-wider">
              <th className="pb-3 pl-2">User Details</th>
              <th className="pb-3">Subscription</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Requests</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 font-mono">
            {paginated.map((item) => {
              const isBlocked = item.isBlocked || item.status === "BLOCKED";
              return (
                <tr key={item.id} className={`hover:bg-slate-900/10 transition ${isBlocked ? "opacity-60 bg-red-950/5" : ""}`}>
                  <td className="py-3.5 pl-2 font-sans">
                    <span className="block font-semibold text-white">{item.name || item.email?.split("@")[0]}</span>
                    <span className="block text-[9px] text-slate-400 font-medium truncate max-w-[150px]">{item.email}</span>
                  </td>
                  <td className="py-3.5 font-sans">
                    <select
                      value={item.plan || item.tier || "FREE"}
                      onChange={(e) => onUpdatePlan(item.id, item.email, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[10px] font-bold"
                    >
                      <option value="FREE">FREE</option>
                      <option value="PRO">PRO</option>
                      <option value="TEAM">TEAM</option>
                    </select>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase border ${item.role === "ADMIN" ? "bg-purple-950/40 border-purple-500/20 text-purple-400" : "bg-slate-900 border-slate-800 text-slate-400"}`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="py-3.5 font-sans">{item.totalAiRequests || 0} calls</td>
                  <td className="py-3.5 pr-2 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button onClick={() => onToggleBlock(item)} disabled={actionLoading === item.id} className={`p-1.5 rounded-lg border transition ${isBlocked ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400" : "bg-amber-950/20 border-amber-500/30 text-amber-400"}`}>
                        {isBlocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => onToggleRole(item)} disabled={actionLoading === item.id} className="p-1.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-400 hover:text-white transition">
                        <ShieldAlert className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => onDelete(item.id, item.email)} disabled={actionLoading === item.id} className="p-1.5 rounded-lg border bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-900/30 transition">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-900 text-[9px] font-bold uppercase text-slate-500">
        <span>Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} entries</span>
        <div className="flex space-x-2">
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition disabled:opacity-40">Prev</button>
          <button onClick={() => { if (page * perPage < filtered.length) setPage(page + 1); }} disabled={page * perPage >= filtered.length} className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}

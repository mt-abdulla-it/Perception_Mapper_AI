"use client";

import React, { useState } from "react";
import { Users } from "lucide-react";
import { Button, Input } from "@perception-mapper/ui";
import { TeamMember } from "../types";

interface TeamWorkspaceProps {
  teamMembers: TeamMember[];
  onInvite: (email: string, role: string) => void;
  onRevoke: (id: string, email: string) => void;
}

export default function TeamWorkspace({ teamMembers, onInvite, onRevoke }: TeamWorkspaceProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onInvite(email, role);
    setEmail("");
  };

  return (
    <div className="space-y-6 select-none font-sans">
      <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Team Workspace</h3>
        </div>
        <span className="text-[8px] font-mono text-slate-500 uppercase font-bold tracking-widest">Roster Seat Allocation</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@perception.ai"
          className="flex-grow text-xs"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-slate-950 border border-slate-800 hover:border-slate-700/60 focus:border-indigo-500/80 rounded-xl px-3 text-xs text-slate-350 outline-none transition focus:ring-4 focus:ring-indigo-500/10 cursor-pointer font-sans font-semibold"
        >
          <option value="USER" className="bg-slate-950 text-slate-300">USER</option>
          <option value="ADMIN" className="bg-slate-950 text-slate-300">ADMIN</option>
        </select>
        <Button type="submit" variant="primary" size="sm" className="shrink-0 font-bold tracking-wide uppercase px-4 py-2">
          Invite Seat
        </Button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-900 text-slate-500 text-[8px] font-bold uppercase tracking-widest">
              <th className="pb-3">User Email</th>
              <th className="pb-3">Access Tier</th>
              <th className="pb-3">Security Status</th>
              <th className="pb-3 text-right">Seat Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 font-mono">
            {teamMembers.map((m) => (
              <tr key={m.id} className="hover:bg-slate-900/20 transition duration-200">
                <td className="py-3.5 font-sans font-bold text-slate-300">{m.email}</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-900 text-slate-400 font-sans text-[8px] font-bold uppercase tracking-wider">
                    {m.role}
                  </span>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-400 text-[8px] font-bold font-sans uppercase tracking-wider">
                      ACTIVE
                    </span>
                  </div>
                </td>
                <td className="py-3.5 text-right font-sans">
                  <button
                    onClick={() => onRevoke(m.id, m.email)}
                    className="text-rose-400 hover:text-rose-350 text-[10px] font-bold tracking-wider uppercase transition duration-200"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


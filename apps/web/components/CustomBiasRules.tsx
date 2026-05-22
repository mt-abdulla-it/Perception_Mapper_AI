"use client";

import React, { useState } from "react";
import { Sliders, Trash2 } from "lucide-react";
import { Button } from "@perception-mapper/ui";
import { CustomRule } from "../types";

interface CustomBiasRulesProps {
  customRules: CustomRule[];
  onCreateRule: (pattern: string, rephrase: string) => void;
  onDeleteRule: (id: string, pattern: string) => void;
}

export default function CustomBiasRules({ customRules, onCreateRule, onDeleteRule }: CustomBiasRulesProps) {
  const [pattern, setPattern] = useState("");
  const [rephrase, setRephrase] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pattern.trim() || !rephrase.trim()) return;
    onCreateRule(pattern, rephrase);
    setPattern("");
    setRephrase("");
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="h-4 w-4 text-purple-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Custom Bias Rules</h3>
        </div>
        <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Safety Overrides</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div className="space-y-1">
          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Target word pattern regex</span>
          <input
            type="text"
            required
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. \b(clearly|evidently)\b"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="space-y-1">
          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Substitution Rephrase</span>
          <input
            type="text"
            required
            value={rephrase}
            onChange={(e) => setRephrase(e.target.value)}
            placeholder="e.g. evidence points to"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-500 transition"
          />
        </div>

        <Button type="submit" variant="primary" size="sm" className="w-full">
          Add Policy Override Rule
        </Button>
      </form>

      <div className="space-y-2">
        <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Policies</span>
        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
          {customRules.map((rule) => (
            <div key={rule.id} className="p-2.5 rounded-lg border border-slate-900 bg-slate-950 font-mono text-[9px] text-slate-300 flex justify-between items-center hover:border-slate-800 transition">
              <div>
                <span className="text-indigo-400 block font-bold font-sans text-[10px]">{rule.type}</span>
                <span>Pattern: <span className="text-pink-400">"{rule.pattern}"</span> ➔ <span className="text-emerald-400">"{rule.rephrase}"</span></span>
              </div>
              <button
                onClick={() => onDeleteRule(rule.id, rule.pattern)}
                className="p-1 hover:bg-slate-900 rounded"
              >
                <Trash2 className="h-3.5 w-3.5 text-slate-500 hover:text-rose-400 transition" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useMemo } from "react";
import { HistoryEntry, HistoryStats } from "../../types";
import { HistoryFilters } from "../../hooks/useHistory";

/* ─────────── Bias Index Color Helper ─────────── */
const getBiasColor = (index: number) => {
  if (index <= 30) return { bar: "bg-gradient-to-r from-emerald-500 to-emerald-400", text: "text-emerald-400", label: "Low" };
  if (index <= 60) return { bar: "bg-gradient-to-r from-amber-500 to-yellow-400", text: "text-amber-400", label: "Medium" };
  return { bar: "bg-gradient-to-r from-red-500 to-rose-400", text: "text-red-400", label: "High" };
};

const getLangIcon = (lang: string) => {
  if (lang === "Tamil") return "🇱🇰";
  if (lang === "Sinhala") return "🇱🇰";
  return "🇬🇧";
};

/* ─────────── Stat Card ─────────── */
const StatCard = ({ icon, label, value, sub, accentColor }: { icon: string; label: string; value: string | number; sub?: string; accentColor: string }) => (
  <div className="glass-card rounded-2xl p-5 flex flex-col gap-2 group hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</span>
    </div>
    <p className={`text-3xl font-black tracking-tight ${accentColor}`}>{value}</p>
    {sub && <span className="text-[10px] text-slate-500 font-medium">{sub}</span>}
  </div>
);

/* ─────────── Filter Bar ─────────── */
const FilterBar = ({
  filters,
  onApply,
  onExport,
  total,
  entryCount,
}: {
  filters: HistoryFilters;
  onApply: (f: HistoryFilters) => void;
  onExport: () => void;
  total: number;
  entryCount: number;
}) => {
  const [local, setLocal] = useState<HistoryFilters>(filters);

  const handleChange = (key: keyof HistoryFilters, value: string) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onApply(updated);
  };

  const handleReset = () => {
    const reset: HistoryFilters = { lang: "all", biasType: "all", from: "", to: "", search: "" };
    setLocal(reset);
    onApply(reset);
  };

  const selectClass = "bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-xs text-slate-300 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer";
  const inputClass = "bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-xs text-slate-300 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all";

  return (
    <div className="glass-card rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Filter & Search</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500">{entryCount} of {total} entries</span>
          <button onClick={handleReset} className="text-[10px] text-slate-500 hover:text-indigo-400 transition-colors font-medium">Reset</button>
          <button onClick={onExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-[10px] font-bold text-indigo-400 hover:bg-indigo-600/30 transition-all uppercase tracking-wider">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search text content..."
            value={local.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className={`${inputClass} w-full`}
          />
        </div>

        {/* Language */}
        <select value={local.lang} onChange={(e) => handleChange("lang", e.target.value)} className={selectClass}>
          <option value="all">All Languages</option>
          <option value="en">English</option>
          <option value="ta">Tamil</option>
          <option value="si">Sinhala</option>
        </select>

        {/* Bias Type */}
        <select value={local.biasType} onChange={(e) => handleChange("biasType", e.target.value)} className={selectClass}>
          <option value="all">All Bias Types</option>
          <option value="Over-generalization">Over-generalization</option>
          <option value="Confirmation Bias">Confirmation Bias</option>
          <option value="Sensationalism">Sensationalism</option>
          <option value="False Dilemma">False Dilemma</option>
          <option value="Ad Hominem">Ad Hominem</option>
          <option value="Appeal to Emotion">Appeal to Emotion</option>
        </select>

        {/* Date From */}
        <input
          type="date"
          value={local.from}
          onChange={(e) => handleChange("from", e.target.value)}
          className={inputClass}
          placeholder="From"
        />

        {/* Date To */}
        <input
          type="date"
          value={local.to}
          onChange={(e) => handleChange("to", e.target.value)}
          className={inputClass}
          placeholder="To"
        />
      </div>
    </div>
  );
};

/* ─────────── Timeline Entry Card ─────────── */
const TimelineCard = ({
  entry,
  index,
  onDelete,
  onReanalyze,
}: {
  entry: HistoryEntry;
  index: number;
  onDelete: (id: string) => void;
  onReanalyze: (text: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const biasColor = getBiasColor(entry.biasIndex);
  const date = new Date(entry.createdAt);
  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

  const biasTypes = useMemo(() => {
    const types = new Set(entry.biases.map((b) => b.type).filter((t) => t !== "Objective Statement" && t !== "Offline Mode"));
    return Array.from(types);
  }, [entry.biases]);

  return (
    <div
      className="relative flex gap-6 group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Timeline Spine Dot */}
      <div className="flex flex-col items-center flex-shrink-0 z-10">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 ring-4 ring-slate-950 group-hover:ring-indigo-500/20 group-hover:scale-125 transition-all duration-300 shadow-lg shadow-indigo-500/20" />
        <div className="w-0.5 flex-1 bg-gradient-to-b from-indigo-500/30 to-transparent" />
      </div>

      {/* Card */}
      <div className="flex-1 pb-8 animate-[fadeSlideIn_0.5s_ease-out_both]" style={{ animationDelay: `${index * 80}ms` }}>
        {/* Timestamp */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{timeStr}</span>
          <span className="text-[10px] text-slate-500 font-medium">{dateStr}</span>
          <span className="text-sm" title={entry.detectedLanguage}>{getLangIcon(entry.detectedLanguage)}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">{entry.detectedLanguage}</span>
        </div>

        {/* Main Card */}
        <div className="glass-card rounded-xl p-5 space-y-4 hover:border-indigo-500/20 transition-all duration-300">
          {/* Text Preview */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {expanded ? entry.inputText : entry.inputText.slice(0, 150)}
            {entry.inputText.length > 150 && !expanded && (
              <button onClick={() => setExpanded(true)} className="text-indigo-400 hover:text-indigo-300 ml-1 text-xs font-medium transition-colors">
                ...show more
              </button>
            )}
            {expanded && entry.inputText.length > 150 && (
              <button onClick={() => setExpanded(false)} className="text-indigo-400 hover:text-indigo-300 ml-1 text-xs font-medium transition-colors">
                show less
              </button>
            )}
          </p>

          {/* Metrics Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Bias Index Bar */}
            <div className="flex-1 min-w-[160px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Bias Index</span>
                <span className={`text-xs font-black ${biasColor.text}`}>{entry.biasIndex}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${biasColor.bar} transition-all duration-700`} style={{ width: `${entry.biasIndex}%` }} />
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-wider ${biasColor.text} mt-0.5 block`}>{biasColor.label} bias</span>
            </div>

            {/* Sentiment Badge */}
            <div className="text-center px-4 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
              <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Sentiment</p>
              <p className="text-lg font-black text-indigo-400">{entry.sentimentScore}</p>
            </div>

            {/* Objectivity Badge */}
            <div className="text-center px-4 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
              <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Objectivity</p>
              <p className="text-lg font-black text-purple-400">{entry.objectivity}%</p>
            </div>
          </div>

          {/* Tone Pills */}
          {entry.tones.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entry.tones.map((tone, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-800/60 border border-slate-700/30 text-slate-400"
                >
                  <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${tone.color}`} />
                  {tone.name} <span className="text-slate-500">{tone.score}%</span>
                </span>
              ))}
            </div>
          )}

          {/* Bias Type Tags */}
          {biasTypes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {biasTypes.map((type, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/20 text-red-400"
                >
                  ⚠ {type}
                </span>
              ))}
            </div>
          )}

          {/* Expanded: Full bias details */}
          {expanded && entry.biases.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-700/30">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Bias Details</span>
              {entry.biases.map((bias, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-red-400">{bias.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">&quot;{bias.quote}&quot;</p>
                  <p className="text-[10px] text-slate-500">{bias.description}</p>
                  <p className="text-[10px] text-emerald-400/80">
                    <span className="text-slate-500">→ Suggestion:</span> {bias.rephrase}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/40 border border-slate-700/30 hover:border-indigo-500/30 hover:text-indigo-400 transition-all"
            >
              {expanded ? "Collapse" : "View Details"}
            </button>
            <button
              onClick={() => onReanalyze(entry.inputText)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
            >
              Re-analyze
            </button>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="ml-auto px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 bg-slate-800/40 border border-slate-700/30 transition-all"
              >
                Delete
              </button>
            ) : (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-[10px] text-red-400 font-medium">Confirm?</span>
                <button
                  onClick={() => { onDelete(entry.id); setConfirmDelete(false); }}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-800/40 border border-slate-700/30 hover:text-slate-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────── Pagination ─────────── */
const Pagination = ({
  page,
  totalPages,
  hasNext,
  hasPrev,
  onPrev,
  onNext,
  onGoTo,
}: {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (p: number) => void;
}) => {
  const pages = useMemo(() => {
    const arr: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/40 border border-slate-700/30 hover:border-indigo-500/30 hover:text-indigo-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Previous
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onGoTo(p)}
          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
            p === page
              ? "bg-indigo-600 text-white border border-indigo-500 shadow-lg shadow-indigo-500/20"
              : "text-slate-400 bg-slate-800/40 border border-slate-700/30 hover:border-indigo-500/30 hover:text-indigo-400"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/40 border border-slate-700/30 hover:border-indigo-500/30 hover:text-indigo-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
};

/* ─────────── Empty State ─────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 space-y-6">
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center">
        <svg className="w-10 h-10 text-indigo-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-500/20 animate-ping" />
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-lg font-bold text-slate-300">No Analysis History Yet</h3>
      <p className="text-sm text-slate-500 max-w-sm">Run your first analysis from the dashboard to see your cognitive bias detection timeline here.</p>
    </div>
    <a
      href="/dashboard"
      className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20"
    >
      Go to Dashboard →
    </a>
  </div>
);

/* ─────────── Loading Skeleton ─────────── */
const TimelineSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex gap-6" style={{ opacity: 1 - i * 0.15 }}>
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-4 h-4 rounded-full bg-slate-700 animate-pulse" />
          <div className="w-0.5 flex-1 bg-slate-800" />
        </div>
        <div className="flex-1 pb-8">
          <div className="h-3 w-32 bg-slate-800 rounded animate-pulse mb-3" />
          <div className="glass-card rounded-xl p-5 space-y-4">
            <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-1/2" />
            <div className="flex gap-4">
              <div className="h-8 bg-slate-800 rounded animate-pulse flex-1" />
              <div className="h-8 bg-slate-800 rounded animate-pulse w-20" />
              <div className="h-8 bg-slate-800 rounded animate-pulse w-20" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN COMPONENT: HistoryTimeline
   ═══════════════════════════════════════════════ */
export default function HistoryTimeline({
  entries,
  stats,
  loading,
  statsLoading,
  error,
  page,
  totalPages,
  total,
  hasNext,
  hasPrev,
  filters,
  onApplyFilters,
  onNextPage,
  onPrevPage,
  onGoToPage,
  onDelete,
  onExport,
  onReanalyze,
}: {
  entries: HistoryEntry[];
  stats: HistoryStats | null;
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
  filters: HistoryFilters;
  onApplyFilters: (f: HistoryFilters) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToPage: (p: number) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onReanalyze: (text: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Analysis Timeline</h2>
          <p className="text-sm text-slate-500 mt-1">Your cognitive bias detection history and metrics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/30">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live History Feed</span>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
              <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
              <div className="h-8 w-16 bg-slate-800 rounded animate-pulse" />
            </div>
          ))
        ) : stats ? (
          <>
            <StatCard
              icon="📊"
              label="Total Analyses"
              value={stats.totalAnalyses}
              sub="All time scans"
              accentColor="text-indigo-400"
            />
            <StatCard
              icon="🎯"
              label="Avg Bias Index"
              value={`${stats.avgBiasIndex}%`}
              sub={getBiasColor(stats.avgBiasIndex).label + " average"}
              accentColor={getBiasColor(stats.avgBiasIndex).text}
            />
            <StatCard
              icon="⚠️"
              label="Top Bias Type"
              value={stats.topBiasType}
              sub={`Detected ${stats.topBiasCount} times`}
              accentColor="text-amber-400"
            />
            <StatCard
              icon="🌐"
              label="Languages"
              value={stats.languageDistribution.length}
              sub={stats.languageDistribution.map((l) => `${l.name} ${l.percentage}%`).join(" · ")}
              accentColor="text-purple-400"
            />
          </>
        ) : null}
      </div>

      {/* ── Filter Bar ── */}
      <FilterBar
        filters={filters}
        onApply={onApplyFilters}
        onExport={onExport}
        total={total}
        entryCount={entries.length}
      />

      {/* ── Error State ── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          ⚠ {error}
        </div>
      )}

      {/* ── Timeline ── */}
      {loading ? (
        <TimelineSkeleton />
      ) : entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="relative">
          {/* Spine background line */}
          <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent" />

          {entries.map((entry, index) => (
            <TimelineCard
              key={entry.id}
              entry={entry}
              index={index}
              onDelete={onDelete}
              onReanalyze={onReanalyze}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && entries.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onPrev={onPrevPage}
          onNext={onNextPage}
          onGoTo={onGoToPage}
        />
      )}

      {/* CSS keyframes for entry animation */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

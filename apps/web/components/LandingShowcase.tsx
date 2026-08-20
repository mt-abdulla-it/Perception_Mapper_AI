"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Badge } from "@perception-mapper/ui";
import {
  Sparkles,
  Layers,
  Zap,
  FileText,
  Download,
  BarChart3,
  Brain,
  Globe,
  Activity,
  Settings,
  Play,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Network,
} from "lucide-react";

// ─── Tier Configuration ──────────────────────────────────────────────────────

type TierKey = "FREE" | "BASIC" | "PRO";

interface TierConfig {
  key: TierKey;
  label: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  glowFrom: string;
  glowTo: string;
  borderActive: string;
  features: { label: string; icon: React.ReactNode }[];
}

const TIERS: TierConfig[] = [
  {
    key: "FREE",
    label: "Free",
    tagline: "Acoustic Basic Gateway",
    icon: <Sparkles className="h-4 w-4" />,
    color: "text-cyan-400",
    glowFrom: "from-cyan-600",
    glowTo: "to-blue-600",
    borderActive: "border-cyan-500/40 shadow-cyan-500/10",
    features: [
      { label: "Real-time Word Counter", icon: <FileText className="h-3 w-3" /> },
      { label: "English Baseline Scan", icon: <Globe className="h-3 w-3" /> },
      { label: "3 Core Bias Types", icon: <AlertTriangle className="h-3 w-3" /> },
      { label: "Objectivity Score", icon: <BarChart3 className="h-3 w-3" /> },
    ],
  },
  {
    key: "BASIC",
    label: "Basic",
    tagline: "Pro Workspace Suite",
    icon: <Layers className="h-4 w-4" />,
    color: "text-purple-400",
    glowFrom: "from-purple-600",
    glowTo: "to-indigo-600",
    borderActive: "border-purple-500/40 shadow-purple-500/10",
    features: [
      { label: "Rephrase Sandbox", icon: <Brain className="h-3 w-3" /> },
      { label: "Batch Processor", icon: <Layers className="h-3 w-3" /> },
      { label: "CSV / PDF Export", icon: <Download className="h-3 w-3" /> },
      { label: "Multilingual Engine", icon: <Globe className="h-3 w-3" /> },
    ],
  },
  {
    key: "PRO",
    label: "Pro",
    tagline: "Enterprise OS Telemetry",
    icon: <Zap className="h-4 w-4" />,
    color: "text-pink-400",
    glowFrom: "from-pink-600",
    glowTo: "to-purple-600",
    borderActive: "border-pink-500/40 shadow-pink-500/10",
    features: [
      { label: "Bias Network Graph", icon: <Network className="h-3 w-3" /> },
      { label: "TTS Audio Readout", icon: <Volume2 className="h-3 w-3" /> },
      { label: "Custom Bias Rules", icon: <Settings className="h-3 w-3" /> },
      { label: "WebSocket Telemetry", icon: <Activity className="h-3 w-3" /> },
    ],
  },
];

// ─── Animated Counter Hook ───────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 1500, active = true): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    let frame = 0;
    const fps = 60;
    const totalFrames = Math.round((duration / 1000) * fps);
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const ease = progress * (2 - progress); // easeOutQuad
      setValue(Math.round(ease * target));
      if (frame >= totalFrames) clearInterval(interval);
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [target, duration, active]);

  return value;
}

// ─── Free Tier Preview ───────────────────────────────────────────────────────

function FreeTierPreview() {
  const objectivity = useAnimatedCounter(72, 1800);
  const sentiment = useAnimatedCounter(58, 2000);
  const biasIndex = useAnimatedCounter(28, 1600);
  const wordCount = useAnimatedCounter(47, 1200);

  return (
    <div className="space-y-5">
      {/* Mock Input Area */}
      <div className="space-y-2">
        <span className="block text-[9px] font-extrabold text-cyan-400 uppercase tracking-widest">
          Text Input Console
        </span>
        <div className="relative rounded-xl border border-slate-800 bg-slate-950/80 p-4 overflow-hidden">
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            <span className="text-slate-300">The development team</span>{" "}
            <span className="border-b border-dashed border-amber-500/60 text-amber-300">absolutely</span>{" "}
            <span className="text-slate-300">and</span>{" "}
            <span className="border-b border-dashed border-red-500/60 text-red-300">flawlessly</span>{" "}
            <span className="border-b border-dashed border-red-500/60 text-red-300">crushed</span>{" "}
            <span className="text-slate-300">this</span>{" "}
            <span className="border-b border-dashed border-amber-500/60 text-amber-300">terrible</span>{" "}
            <span className="text-slate-300">bug with</span>{" "}
            <span className="border-b border-dashed border-amber-500/60 text-amber-300">total ease</span>
            <span className="animate-pulse text-cyan-400 font-bold ml-0.5">|</span>
          </p>
          <div className="absolute bottom-2 right-3 text-[8px] font-bold text-slate-600 uppercase tracking-wider">
            {wordCount} words
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3 text-center space-y-2">
          <span className="block text-[8px] font-extrabold text-slate-500 uppercase tracking-widest">Objectivity</span>
          <span className="text-xl font-black text-emerald-400">{objectivity}%</span>
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${objectivity}%` }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
            />
          </div>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3 text-center space-y-2">
          <span className="block text-[8px] font-extrabold text-slate-500 uppercase tracking-widest">Sentiment</span>
          <span className="text-xl font-black text-indigo-400">{sentiment}%</span>
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${sentiment}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full"
            />
          </div>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3 text-center space-y-2">
          <span className="block text-[8px] font-extrabold text-slate-500 uppercase tracking-widest">Bias Index</span>
          <span className="text-xl font-black text-amber-400">{biasIndex}%</span>
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${biasIndex}%` }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-500 to-red-400 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Basic Tier Preview ──────────────────────────────────────────────────────

function BasicTierPreview() {
  const [activeTab, setActiveTab] = useState<"rephrase" | "batch">("rephrase");

  const tones = [
    { name: "Journalistic", text: "Evidence suggests the team resolved the software bug efficiently.", score: 94 },
    { name: "Empathetic", text: "We understand the challenge, and the team addressed the issue effectively.", score: 88 },
    { name: "Professional", text: "The engineering team resolved the bug and stabilized the codebase.", score: 96 },
  ];

  const batchItems = [
    { text: "Report #1 — Quarterly Review", status: "complete" as const, bias: 12 },
    { text: "Report #2 — Incident Summary", status: "complete" as const, bias: 67 },
    { text: "Report #3 — Press Release", status: "processing" as const, bias: 0 },
  ];

  return (
    <div className="space-y-4">
      {/* Mini Tab Bar */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab("rephrase")}
          className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-widest transition ${
            activeTab === "rephrase"
              ? "bg-purple-950/40 text-purple-300 border border-purple-500/30"
              : "text-slate-500 border border-slate-800/60 hover:text-slate-300"
          }`}
        >
          <Brain className="h-3 w-3 inline mr-1" />
          Rephrase Sandbox
        </button>
        <button
          onClick={() => setActiveTab("batch")}
          className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-widest transition ${
            activeTab === "batch"
              ? "bg-purple-950/40 text-purple-300 border border-purple-500/30"
              : "text-slate-500 border border-slate-800/60 hover:text-slate-300"
          }`}
        >
          <Layers className="h-3 w-3 inline mr-1" />
          Batch Processor
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "rephrase" ? (
          <motion.div
            key="rephrase"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {tones.map((tone, idx) => (
              <motion.div
                key={tone.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12 }}
                className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-purple-400">
                      {tone.name}
                    </span>
                    <Badge variant="success" className="text-[7px] px-1.5 py-0.5">{tone.score}% Match</Badge>
                  </div>
                  <button className="text-[8px] font-bold text-slate-500 hover:text-white uppercase tracking-wider transition flex items-center space-x-1">
                    <Play className="h-2.5 w-2.5" />
                    <span>TTS</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{tone.text}</p>
              </motion.div>
            ))}
            <div className="flex space-x-2">
              <button className="flex-1 py-2 rounded-lg border border-slate-800/60 bg-slate-950/60 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest hover:text-white hover:border-slate-700 transition flex items-center justify-center space-x-1.5">
                <Download className="h-3 w-3" />
                <span>Export CSV</span>
              </button>
              <button className="flex-1 py-2 rounded-lg border border-slate-800/60 bg-slate-950/60 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest hover:text-white hover:border-slate-700 transition flex items-center justify-center space-x-1.5">
                <FileText className="h-3 w-3" />
                <span>Export PDF</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="batch"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {batchItems.map((item, idx) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === "complete" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                  }`} />
                  <span className="text-xs font-bold text-slate-300">{item.text}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  {item.status === "complete" ? (
                    <>
                      <Badge
                        variant={item.bias > 50 ? "error" : "success"}
                        className="text-[7px] px-1.5 py-0.5"
                      >
                        Bias: {item.bias}%
                      </Badge>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    </>
                  ) : (
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Pro Tier Preview ────────────────────────────────────────────────────────

function ProTierPreview() {
  // Animated waveform bars
  const [wavePhase, setWavePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWavePhase((prev) => (prev + 1) % 100);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Bias network graph nodes
  const nodes = [
    { id: "sensationalism", label: "Sensationalism", x: 50, y: 30, size: 28, color: "#f43f5e" },
    { id: "overgeneralization", label: "Over-generalization", x: 20, y: 65, size: 22, color: "#f59e0b" },
    { id: "confirmation", label: "Confirmation Bias", x: 80, y: 65, size: 24, color: "#8b5cf6" },
    { id: "anchoring", label: "Anchoring", x: 35, y: 40, size: 16, color: "#06b6d4" },
    { id: "framing", label: "Framing Effect", x: 65, y: 45, size: 18, color: "#ec4899" },
  ];

  const edges = [
    { from: "sensationalism", to: "overgeneralization" },
    { from: "sensationalism", to: "confirmation" },
    { from: "sensationalism", to: "framing" },
    { from: "overgeneralization", to: "anchoring" },
    { from: "confirmation", to: "framing" },
    { from: "anchoring", to: "framing" },
  ];

  const getNode = useCallback((id: string) => nodes.find((n) => n.id === id), []);

  const waveHeights = Array.from({ length: 24 }, (_, i) => {
    const base = Math.sin((i + wavePhase) * 0.4) * 0.4 + 0.5;
    const jitter = Math.sin((i * 2.3 + wavePhase * 1.7) * 0.6) * 0.2;
    return Math.max(0.15, Math.min(1, base + jitter));
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bias Network Graph */}
        <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-4 space-y-2.5">
          <div className="flex items-center space-x-1.5">
            <Network className="h-3.5 w-3.5 text-pink-400" />
            <span className="text-[9px] font-extrabold text-pink-400 uppercase tracking-widest">
              Bias Network Graph
            </span>
          </div>
          <div className="relative w-full aspect-[16/10] rounded-lg bg-slate-950/80 border border-slate-900/60 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/4 left-1/3 w-20 h-20 rounded-full bg-pink-500/5 blur-2xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full bg-purple-500/5 blur-2xl pointer-events-none" />

            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Edges */}
              {edges.map((edge, idx) => {
                const from = getNode(edge.from);
                const to = getNode(edge.to);
                if (!from || !to) return null;
                return (
                  <line
                    key={idx}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="rgba(148,163,184,0.15)"
                    strokeWidth="0.4"
                    strokeDasharray="2,2"
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => (
                <g key={node.id}>
                  {/* Glow */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 3 + 3}
                    fill={node.color}
                    opacity={0.08}
                  />
                  {/* Node */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 3}
                    fill={node.color}
                    opacity={0.7}
                    stroke={node.color}
                    strokeWidth="0.5"
                    strokeOpacity={0.3}
                  />
                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y + node.size / 3 + 6}
                    textAnchor="middle"
                    fill="rgba(148,163,184,0.7)"
                    fontSize="3"
                    fontWeight="bold"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* TTS + Custom Rules */}
        <div className="space-y-4">
          {/* TTS Waveform */}
          <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Volume2 className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest">
                  TTS Audio Synthesizer
                </span>
              </div>
              <button className="flex items-center space-x-1 px-2 py-1 rounded-lg border border-indigo-500/30 bg-indigo-950/30 text-[8px] font-extrabold text-indigo-300 uppercase tracking-wider">
                <Play className="h-2.5 w-2.5" />
                <span>Live</span>
              </button>
            </div>
            <div className="flex items-end justify-center space-x-[3px] h-10">
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 transition-all duration-100"
                  style={{ height: `${h * 100}%`, opacity: 0.5 + h * 0.5 }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-[8px] font-bold text-slate-600 uppercase tracking-wider">
              <span>00:00</span>
              <span className="text-indigo-400 animate-pulse">● Streaming</span>
              <span>02:47</span>
            </div>
          </div>

          {/* Custom Rules Console */}
          <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center space-x-1.5">
              <Settings className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest">
                Custom Bias Rules
              </span>
            </div>
            <div className="space-y-2">
              {[
                { pattern: "/\\b(always|never|everyone)\\b/gi", type: "Over-generalization", active: true },
                { pattern: "/\\b(obviously|clearly)\\b/gi", type: "Confirmation Bias", active: true },
                { pattern: "/\\b(disaster|shocking)\\b/gi", type: "Sensationalism", active: false },
              ].map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-slate-900/60 bg-slate-950/80 px-3 py-2"
                >
                  <div className="space-y-0.5 truncate flex-1 min-w-0 mr-2">
                    <code className="block text-[9px] text-slate-400 font-mono truncate">{rule.pattern}</code>
                    <span className="text-[7px] font-extrabold text-slate-600 uppercase tracking-widest">{rule.type}</span>
                  </div>
                  <div className={`w-7 h-4 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${
                    rule.active ? "bg-emerald-500/30 justify-end" : "bg-slate-800 justify-start"
                  }`}>
                    <div className={`w-3 h-3 rounded-full transition-colors ${
                      rule.active ? "bg-emerald-400" : "bg-slate-600"
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WebSocket Telemetry Bar */}
      <div className="rounded-xl border border-slate-800/60 bg-slate-950/80 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest">
            WebSocket Telemetry Stream — Connected
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[8px] font-bold text-slate-600 uppercase tracking-wider">
          <span>Latency: <span className="text-emerald-400">12ms</span></span>
          <span>Events: <span className="text-indigo-400">1,847</span></span>
        </div>
      </div>
    </div>
  );
}

// ─── Main LandingShowcase Component ──────────────────────────────────────────

export default function LandingShowcase() {
  const [activeTier, setActiveTier] = useState<TierKey>("FREE");
  const activeTierConfig = TIERS.find((t) => t.key === activeTier)!;

  return (
    <div id="showcase" className="w-full max-w-6xl mx-auto py-16 space-y-12 relative z-10 select-none">
      {/* Ambient glow */}
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-indigo-500/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] rounded-full bg-purple-500/3 blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3 max-w-2xl mx-auto"
      >
        <Badge
          variant="info"
          className="px-3.5 py-1 text-[10px] tracking-widest font-extrabold shadow-sm bg-indigo-950/60 border border-indigo-500/20 text-indigo-400"
        >
          🔮 PLATFORM SHOWCASE
        </Badge>
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Explore Every Tier in Action
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-lg mx-auto">
          Preview what each subscription tier unlocks — from baseline linguistic scanning to enterprise-grade
          bias network telemetry.
        </p>
      </motion.div>

      {/* Tier Tab Selector */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex justify-center"
      >
        <div className="inline-flex items-center p-1.5 rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-md gap-1.5">
          {TIERS.map((tier) => {
            const isActive = activeTier === tier.key;
            return (
              <button
                key={tier.key}
                onClick={() => setActiveTier(tier.key)}
                className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${tier.glowFrom} ${tier.glowTo} text-white shadow-lg`
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/40"
                }`}
              >
                {tier.icon}
                <span>{tier.label}</span>
                {tier.key === "PRO" && !isActive && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[6px] font-black uppercase bg-pink-500 text-white rounded-full leading-none tracking-wider">
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Preview Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <Card className={`relative overflow-hidden border-slate-800/60 bg-slate-950/40 backdrop-blur-md p-6 md:p-8 shadow-2xl transition-shadow duration-500 ${
          activeTier === "PRO" ? "shadow-pink-500/5" : activeTier === "BASIC" ? "shadow-purple-500/5" : "shadow-cyan-500/5"
        }`} hoverEffect={false}>
          {/* Top accent line */}
          <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${activeTierConfig.glowFrom} ${activeTierConfig.glowTo} opacity-40`} />

          {/* Tier label */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2.5">
              <div className={`p-2 rounded-lg border border-slate-800/60 bg-slate-950/80 ${activeTierConfig.color}`}>
                {activeTierConfig.icon}
              </div>
              <div>
                <span className={`block text-xs font-extrabold ${activeTierConfig.color}`}>
                  {activeTierConfig.label} Tier
                </span>
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  {activeTierConfig.tagline}
                </span>
              </div>
            </div>
            <Badge
              variant="info"
              className={`text-[7px] px-2 py-0.5 ${
                activeTier === "PRO"
                  ? "bg-pink-950/40 text-pink-300 border-pink-800/40"
                  : activeTier === "BASIC"
                  ? "bg-purple-950/40 text-purple-300 border-purple-800/40"
                  : "bg-cyan-950/40 text-cyan-300 border-cyan-800/40"
              }`}
            >
              Live Preview
            </Badge>
          </div>

          {/* Dashboard Preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTier}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {activeTier === "FREE" && <FreeTierPreview />}
              {activeTier === "BASIC" && <BasicTierPreview />}
              {activeTier === "PRO" && <ProTierPreview />}
            </motion.div>
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Feature Badges Row */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="flex flex-wrap justify-center gap-3"
      >
        <AnimatePresence mode="wait">
          {activeTierConfig.features.map((feature, idx) => (
            <motion.div
              key={`${activeTier}-${feature.label}`}
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ duration: 0.25, delay: idx * 0.06 }}
            >
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-800/60 bg-slate-950/40 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider ${activeTierConfig.color} transition-colors`}>
                {feature.icon}
                <span>{feature.label}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

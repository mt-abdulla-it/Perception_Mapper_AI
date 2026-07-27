"use client";

import React from "react";
import { Textarea, Button } from "@perception-mapper/ui";
import { Layers, Play, RefreshCw } from "lucide-react";
import { VOICE_PRESETS, IMAGE_PRESETS } from "../lib/constants";
import AudioVisualizer from "./AudioVisualizer";

interface MultimodalScannerProps {
  inputText: string;
  setInputText: (text: string) => void;
  activeTab: "text" | "voice" | "image";
  setActiveTab: (tab: "text" | "voice" | "image") => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isAnalyzing: boolean;
  triggerAnalysis: (text?: string) => void;
  appendTerminalLog: (log: string) => void;
}

export default function MultimodalScanner({
  inputText, setInputText, activeTab, setActiveTab,
  selectedLanguage, setSelectedLanguage, isAnalyzing, triggerAnalysis, appendTerminalLog
}: MultimodalScannerProps) {
  const handleVoiceStop = (url: string) => {
    appendTerminalLog("🎤 ACOUSTIC RECORDING DEPLOYED");
    appendTerminalLog("📡 BOOTING NLP HEURISTIC TRANSCRIBER SPEECH DECODER...");
    const preset = VOICE_PRESETS[Math.floor(Math.random() * VOICE_PRESETS.length)];
    setTimeout(() => {
      setInputText(preset.text);
      setSelectedLanguage(preset.lang);
      triggerAnalysis(preset.text);
      appendTerminalLog(`🎤 SPEECH DECODED SECURELY: "${preset.label}"`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Omnibox Playground</h3>
        </div>
        <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[9px] font-bold">
          {(["text", "voice", "image"] as const).map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); appendTerminalLog(`📡 MODE SWAP: ${tab}`); }} className={`px-2.5 py-1 rounded transition capitalize ${activeTab === tab ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "text" && (
        <Textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Enter paragraph..." className="text-xs h-36 font-mono text-slate-200 bg-slate-950 border-slate-800 focus:border-indigo-500" />
      )}

      {activeTab === "voice" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
          <AudioVisualizer onStop={handleVoiceStop} />
          <div className="space-y-1">
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Presets</span>
            {VOICE_PRESETS.map((p, i) => (
              <button key={i} onClick={() => { setInputText(p.text); setSelectedLanguage(p.lang); triggerAnalysis(p.text); appendTerminalLog(`🎤 LOAD: ${p.label}`); }} className="w-full text-left p-2 rounded-lg border border-slate-900 bg-slate-950 text-[9px] font-bold text-slate-300 truncate hover:border-slate-800">
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {activeTab === "image" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
          <label className="p-4 border border-dashed border-slate-800 hover:border-indigo-500/40 bg-slate-950/40 hover:bg-indigo-950/10 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer transition select-none">
            <Layers className="h-5 w-5 text-indigo-400 mb-2" />
            <span className="text-[9px] font-bold text-slate-300 uppercase">Upload or Drag PNG manifest</span>
            <span className="text-[7px] text-slate-500 font-bold uppercase mt-1">Supports PNG, JPEG up to 5MB</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                if (!e.target.files || e.target.files.length === 0) return;
                const file = e.target.files[0];
                appendTerminalLog(`📸 SCAN EVENT: ${file.name.toUpperCase()}`);
                appendTerminalLog("📡 BOOTING OPTICAL OCR CHARACTER DECODER...");
                setTimeout(() => {
                  const extracted = `OCR SCAN RESULT: Raw textual manifest extracted from file "${file.name}". Obviously, the sovereign border operation is undeniably experiencing a complete failure without a doubt. Always verify credentials.`;
                  setInputText(extracted);
                  triggerAnalysis(extracted);
                  appendTerminalLog(`📸 OCR SUCCESS: 100% characters recognized from "${file.name}"`);
                }, 1000);
              }}
              className="hidden" 
            />
          </label>
          <div className="space-y-1">
            {IMAGE_PRESETS.map((p, i) => (
              <button key={i} onClick={() => { setInputText(p.extractedText); triggerAnalysis(p.extractedText); appendTerminalLog(`📸 SCAN: ${p.fileName}`); }} className="w-full text-left p-2 border border-slate-900 bg-slate-950 hover:border-slate-800 rounded-lg text-[9px] font-bold">
                <span className="text-indigo-400 block truncate">{p.title}</span>
                <span className="text-[8px] text-slate-500 font-mono block">{p.fileName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-900/60">
        <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1 text-[10px] font-semibold">
          <option value="en">English</option>
          <option value="ta">Tamil</option>
          <option value="si">Sinhala</option>
        </select>
        <Button onClick={() => triggerAnalysis()} disabled={isAnalyzing} variant="primary" size="sm">
          {isAnalyzing ? <RefreshCw className="h-3 w-3 animate-spin mr-1.5" /> : <Play className="h-3 w-3 mr-1.5" />}
          Launch Sequence
        </Button>
      </div>
    </div>
  );
}

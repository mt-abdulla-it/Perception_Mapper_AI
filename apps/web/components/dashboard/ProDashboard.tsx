"use client";

import React from "react";
import MultimodalScanner from "../MultimodalScanner";
import CognitiveAnalytics from "../CognitiveAnalytics";
import LiveTelemetry from "../LiveTelemetry";
import CustomBiasRules from "../CustomBiasRules";
import { Card } from "@perception-mapper/ui";
import { Lock, Terminal } from "lucide-react";
import { SubscriptionTier } from "../../lib/auth";

interface DashboardProps {
  db: any;
  onUpgrade: (tier: SubscriptionTier) => void;
  onExploreRephrase: (quote: string) => void;
}

export default function ProDashboard({ db, onUpgrade, onExploreRephrase }: DashboardProps) {
  return (
    <div className="space-y-8 animate-fadeIn duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-7 p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
          <MultimodalScanner
            inputText={db.inputText} setInputText={db.setInputText}
            activeTab={db.activeTab} setActiveTab={db.setActiveTab}
            selectedLanguage={db.selectedLanguage} setSelectedLanguage={db.setSelectedLanguage}
            isAnalyzing={db.isAnalyzing} triggerAnalysis={db.triggerAnalysis}
            appendTerminalLog={db.appendTerminalLog}
          />
        </Card>

        <Card className="lg:col-span-5 p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
          <CognitiveAnalytics
            analysisResult={db.analysisResult}
            isAnalyzing={db.isAnalyzing}
            onRephrase={(quote, rephrase) => {
              const cleanText = db.inputText.replace(quote, rephrase);
              db.setInputText(cleanText);
              db.appendTerminalLog("💡 Applied objective rephrase pattern.");
            }}
            onExploreRephrase={onExploreRephrase}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
          <LiveTelemetry liveMetrics={db.liveMetrics} telemetryHistory={db.telemetryHistory} />
        </Card>
        
        <div className="lg:col-span-4 relative overflow-hidden bg-slate-950/30 border border-slate-900 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between min-h-[260px] hover:border-slate-800 transition">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent pointer-events-none" />
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-3.5 w-3.5 text-pink-400 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Audit Console</h3>
              </div>
              <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-pink-950/40 border border-pink-500/20 text-pink-400">
                Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Deploy secure terminal telemetry exports, persistent session recording traces, and absolute compliance rule audit feeds.
            </p>
          </div>

          <button
            onClick={() => onUpgrade("PRO")}
            className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-pink-900/40 border border-slate-800 hover:border-pink-500/30 text-white rounded-xl text-[10px] font-bold transition duration-300 flex items-center justify-center space-x-1.5"
          >
            <span>Upgrade to Pro</span>
            <Terminal className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
          <CustomBiasRules
            customRules={db.customRules}
            onCreateRule={(pattern, rephrase) => {
              const newRule = { id: Math.random().toString(36).substr(2, 5), pattern, type: "Custom Rule", category: "Linguistic", rephrase };
              db.setCustomRules([...db.customRules, newRule]);
              db.appendTerminalLog(`📏 Custom rule policy persisted: ${pattern}`);
            }}
            onDeleteRule={(id, pattern) => {
              db.setCustomRules(db.customRules.filter((r) => r.id !== id));
              db.appendTerminalLog(`📏 Safety rule purged: ${pattern}`);
            }}
          />
        </Card>
      </div>
    </div>
  );
}

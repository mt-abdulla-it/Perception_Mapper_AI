"use client";

import React from "react";
import MultimodalScanner from "../MultimodalScanner";
import CognitiveAnalytics from "../CognitiveAnalytics";
import { Card } from "@perception-mapper/ui";
import { Lock, Cpu } from "lucide-react";
import { SubscriptionTier } from "../../lib/auth";
import TierSelector from "./TierSelector";

interface DashboardProps {
  db: any;
  onUpgrade: (tier: SubscriptionTier) => void;
  onExploreRephrase: (quote: string) => void;
}

export default function BasicDashboard({ db, onUpgrade, onExploreRephrase }: DashboardProps) {
  return (
    <div className="space-y-8 animate-fadeIn duration-500">
      <TierSelector currentTier="FREE" onChangeTier={onUpgrade} />

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <LockedCard
          title="Cognitive Telemetry"
          desc="Real-time biometric signals, memory throughput indicators, and NLP semantic speed tracks."
          badge="Basic"
          onClick={() => onUpgrade("BASIC")}
        />
        <LockedCard
          title="Team Collaboration"
          desc="Synchronized model annotations, shared datasets, custom workspace folders, and seat management."
          badge="Basic"
          onClick={() => onUpgrade("BASIC")}
        />
        <LockedCard
          title="Safety Bias Mapping"
          desc="Deploy customized linguistic guardrails, toxicity thresholds, and strict compliance triggers."
          badge="Basic"
          onClick={() => onUpgrade("BASIC")}
        />
      </div>
    </div>
  );
}

function LockedCard({ title, desc, badge, onClick }: { title: string; desc: string; badge: string; onClick: () => void }) {
  return (
    <div className="relative group overflow-hidden bg-slate-950/30 border border-slate-900/60 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between min-h-[220px] transition duration-300 hover:border-slate-800">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <Lock className="h-3.5 w-3.5 text-indigo-400/80 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-200 tracking-wide">{title}</h3>
          </div>
          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-indigo-400">
            {badge}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{desc}</p>
      </div>

      <button
        onClick={onClick}
        className="w-full mt-6 py-2 bg-slate-900 hover:bg-indigo-900/40 border border-slate-800 hover:border-indigo-500/30 text-white rounded-xl text-[10px] font-bold transition duration-300 flex items-center justify-center space-x-1"
      >
        <span>Upgrade to Unlock</span>
        <Cpu className="h-3 w-3" />
      </button>
    </div>
  );
}

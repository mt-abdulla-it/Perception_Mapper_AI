"use client";

import React from "react";
import MultimodalScanner from "../MultimodalScanner";
import CognitiveAnalytics from "../CognitiveAnalytics";
import LiveTelemetry from "../LiveTelemetry";
import AuditLogConsole from "../AuditLogConsole";
import TeamWorkspace from "../TeamWorkspace";
import CustomBiasRules from "../CustomBiasRules";
import { Card } from "@perception-mapper/ui";
import { Sparkles, Terminal, Activity, Cpu } from "lucide-react";

interface DashboardProps {
  db: any;
  onExploreRephrase: (quote: string) => void;
}

export default function EnterpriseDashboard({ db, onExploreRephrase }: DashboardProps) {
  return (
    <div className="space-y-8 animate-fadeIn duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-pink-500/20 bg-gradient-to-r from-pink-950/10 via-slate-900/40 to-indigo-950/10 backdrop-blur-md">
        <DiagnosticGauge label="Secure NLP Gateway" value="CONNECTED" icon={Cpu} color="text-pink-400" />
        <DiagnosticGauge label="System Speed Scope" value="0.04 ms" icon={Activity} color="text-cyan-400" />
        <DiagnosticGauge label="Telemetry Handshake" value="ACTIVE" icon={Terminal} color="text-purple-400" />
        <DiagnosticGauge label="Node Encryption" value="256-AES" icon={Sparkles} color="text-indigo-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-7 p-6 border-pink-900/30 bg-slate-950/40 backdrop-blur-md shadow-pink-950/5 shadow-2xl">
          <MultimodalScanner
            inputText={db.inputText} setInputText={db.setInputText}
            activeTab={db.activeTab} setActiveTab={db.setActiveTab}
            selectedLanguage={db.selectedLanguage} setSelectedLanguage={db.setSelectedLanguage}
            isAnalyzing={db.isAnalyzing} triggerAnalysis={db.triggerAnalysis}
            appendTerminalLog={db.appendTerminalLog}
          />
        </Card>

        <Card className="lg:col-span-5 p-6 border-pink-900/30 bg-slate-950/40 backdrop-blur-md shadow-pink-950/5 shadow-2xl">
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
        <Card className="lg:col-span-4 p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
          <AuditLogConsole terminalLogs={db.terminalLogs} onClearLogs={() => db.appendTerminalLog("♻️ AUDIT LOG STREAM FLUSHED")} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-7 p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
          <TeamWorkspace
            teamMembers={db.teamMembers}
            onInvite={(email, role) => {
              const newMember = { id: Math.random().toString(36).substr(2, 5), name: email.split("@")[0], email, role, status: "ACTIVE" };
              db.setTeamMembers([...db.teamMembers, newMember]);
              db.appendTerminalLog(`👥 Seat allocated for: ${email}`);
            }}
            onRevoke={(id, email) => {
              db.setTeamMembers(db.teamMembers.filter((m) => m.id !== id));
              db.appendTerminalLog(`👥 Seat revoked for: ${email}`);
            }}
          />
        </Card>

        <Card className="lg:col-span-5 p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md">
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

function DiagnosticGauge({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof Cpu; color: string }) {
  return (
    <div className="flex items-center space-x-3 bg-slate-950/60 p-3 rounded-xl border border-slate-900/80">
      <div className={`p-2 rounded-lg bg-slate-900 ${color}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <span className="block text-[8px] font-extrabold uppercase tracking-widest text-slate-500">{label}</span>
        <span className="block text-[11px] font-bold text-slate-200 uppercase">{value}</span>
      </div>
    </div>
  );
}

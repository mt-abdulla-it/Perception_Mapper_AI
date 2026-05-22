import { useState, useEffect, useCallback } from "react";
import { TeamMember, CustomRule, AnalysisResult } from "../types";
import { INITIAL_TEAM_MEMBERS, INITIAL_CUSTOM_RULES } from "../lib/constants";
import { io } from "socket.io-client";

export const useDashboard = () => {
  const [inputText, setInputText] = useState("Obviously, this disaster is a complete conspiracy. Everyone knows that the corporation is undeniably trying to cover up their horrible, catastrophic failure without a doubt.");
  const [activeTab, setActiveTab] = useState<"text" | "voice" | "image">("text");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [customRules, setCustomRules] = useState<CustomRule[]>(INITIAL_CUSTOM_RULES);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const [liveMetrics, setLiveMetrics] = useState({ latencyMs: 41, cpuLoad: 12, memoryMb: 346, activeConnections: 5 });
  const [telemetryHistory, setTelemetryHistory] = useState<any[]>([]);

  const appendTerminalLog = useCallback((log: string) => {
    setTerminalLogs((prev) => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${log}`]);
  }, []);

  // WebSockets telemetry connection
  useEffect(() => {
    const socket = io("http://localhost:3001/telemetry", {
      transports: ["websocket"],
    });

    socket.on("status", () => {
      appendTerminalLog("🔌 Real-Time Telemetry Socket Connection Established.");
    });

    socket.on("analysis", (data) => {
      appendTerminalLog(`🛡️ [Linguistic Handshake] Locale=${data.detectedLanguage} | BiasIndex=${data.biasIndex}% | Chars=${data.textLength}`);
      setLiveMetrics((prev) => ({
        latencyMs: 15 + Math.floor(Math.random() * 20),
        cpuLoad: 25 + Math.floor(Math.random() * 15),
        memoryMb: prev.memoryMb,
        activeConnections: prev.activeConnections,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [appendTerminalLog]);

  // Telemetry simulation fallback for metrics
  useEffect(() => {
    const interval = setInterval(() => {
      const latency = 38 + Math.floor(Math.random() * 12);
      const cpu = 8 + Math.floor(Math.random() * 15);
      const ram = 320 + Math.floor(Math.random() * 40);
      const conn = 4 + Math.floor(Math.random() * 3);

      setLiveMetrics((prev) => ({ latencyMs: latency, cpuLoad: cpu, memoryMb: ram, activeConnections: conn }));
      setTelemetryHistory((prev) => [...prev, { name: new Date().toLocaleTimeString().slice(-8), latency, cpu }].slice(-8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const triggerAnalysis = useCallback(async (customText?: string) => {
    const text = customText || inputText;
    if (!text.trim()) return;
    setIsAnalyzing(true);
    appendTerminalLog(`🤖 SCANNING CHUNK: "${text.slice(0, 35)}..."`);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error(`API returned status ${response.status}`);
      const result = await response.json();
      setAnalysisResult(result);
      appendTerminalLog(`✅ ANALYSIS RESOLVED`);
    } catch (err: any) {
      appendTerminalLog(`❌ ANALYSIS FAILED: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [inputText, appendTerminalLog]);

  const cleanBias = useCallback(() => {
    let cleansed = inputText
      .replace(/obviously/gi, "evidence indicates")
      .replace(/complete conspiracy/gi, "complex event")
      .replace(/everyone knows/gi, "stakeholders observe")
      .replace(/undeniably/gi, "allegedly");
    setInputText(cleansed);
    setActionMessage("✨ Rephrased successfully.");
    setTimeout(() => setActionMessage(null), 3000);
    triggerAnalysis(cleansed);
  }, [inputText, triggerAnalysis]);

  return {
    inputText, setInputText,
    activeTab, setActiveTab,
    selectedLanguage, setSelectedLanguage,
    isAnalyzing, analysisResult, actionMessage,
    teamMembers, setTeamMembers,
    customRules, setCustomRules,
    terminalLogs, appendTerminalLog,
    liveMetrics, telemetryHistory,
    triggerAnalysis, cleanBias,
  };
};

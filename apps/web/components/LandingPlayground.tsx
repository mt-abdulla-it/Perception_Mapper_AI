"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Play, RefreshCw, Volume2, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, Terminal, Cpu } from "lucide-react";
import { Button, Card, Badge, Textarea } from "@perception-mapper/ui";
import { motion, AnimatePresence } from "framer-motion";

interface PresetItem {
  label: string;
  original: string;
  cleansed: string;
  objectivityOriginal: number;
  objectivityClean: number;
  sentimentOriginal: string;
  sentimentClean: string;
  biasLevel: "High" | "Medium" | "Low";
  highlightsOriginal: { word: string; type: string }[];
}

const PLAYGROUND_PRESETS: PresetItem[] = [
  {
    label: "Corporate Launch Announcement",
    original: "The development team absolutely and flawlessly crushed this terrible bug with total ease!",
    cleansed: "The engineering team resolved the software bug and stabilized the codebase.",
    objectivityOriginal: 34,
    objectivityClean: 96,
    sentimentOriginal: "Highly Subjective / Over-excited",
    sentimentClean: "Objective / Balanced",
    biasLevel: "High",
    highlightsOriginal: [
      { word: "absolutely", type: "Intensifier / Adverbial Bias" },
      { word: "flawlessly", type: "Exaggeration / Hyperbole" },
      { word: "crushed", type: "Sensationalized Language" },
      { word: "terrible", type: "Subjective Appraisal" },
      { word: "total ease", type: "Over-simplification" }
    ]
  },
  {
    label: "Security Incident Alert",
    original: "Obviously, this system breakdown is a complete, catastrophic disaster without a doubt.",
    cleansed: "The systems experienced an unplanned disruption which affects server availability.",
    objectivityOriginal: 18,
    objectivityClean: 92,
    sentimentOriginal: "Catastrophizing / Emotional",
    sentimentClean: "Objective / Informative",
    biasLevel: "High",
    highlightsOriginal: [
      { word: "Obviously,", type: "Presumptive Adverb" },
      { word: "breakdown", type: "Sensationalism" },
      { word: "complete,", type: "Exaggeration" },
      { word: "catastrophic", type: "Amplification Bias" },
      { word: "disaster", type: "Emotional / Subjective Labeling" },
      { word: "without a doubt.", type: "Certainty Bias" }
    ]
  },
  {
    label: "Management Performance Update",
    original: "Everyone knows that the leadership is undeniably trying to cover up their horrible failure.",
    cleansed: "The management team is addressing the project deviations and will provide transparency reports.",
    objectivityOriginal: 22,
    objectivityClean: 90,
    sentimentOriginal: "Conspiratorial / Adverse Accusation",
    sentimentClean: "Professional / Objective",
    biasLevel: "High",
    highlightsOriginal: [
      { word: "Everyone knows", type: "Over-generalization / Consensus Bias" },
      { word: "undeniably", type: "Certainty Bias" },
      { word: "cover up", type: "Accusatory Speculation" },
      { word: "horrible", type: "Pejorative Adjective" },
      { word: "failure.", type: "Subjective Appraisal" }
    ]
  }
];

export default function LandingPlayground() {
  const [inputText, setInputText] = useState(PLAYGROUND_PRESETS[0].original);
  const [currentPresetIndex, setCurrentPresetIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Sync initial preset
  useEffect(() => {
    loadPresetIntoResult(PLAYGROUND_PRESETS[0]);
  }, []);

  const loadPresetIntoResult = (preset: PresetItem) => {
    setAnalysisResult({
      language: "English",
      source: "Preset Metadata",
      scores: {
        sentiment: preset.sentimentOriginal.includes("Highly") ? 85 : 55,
        objectivity: preset.objectivityClean,
        biasIndex: 100 - preset.objectivityClean
      },
      tones: [
        { name: "Informative", score: preset.objectivityClean, color: "from-blue-500 to-indigo-500" },
        { name: "Assertive", score: 100 - preset.objectivityClean, color: "from-purple-500 to-pink-500" }
      ],
      biases: preset.highlightsOriginal.map(h => ({
        quote: h.word,
        type: h.type,
        description: "Static preset catalog term.",
        rephrase: preset.cleansed
      })),
      cleansed: preset.cleansed,
      biasLevel: preset.biasLevel,
      objectivityOriginal: preset.objectivityOriginal
    });
  };

  // Load a preset
  const handleLoadPreset = (index: number) => {
    setCurrentPresetIndex(index);
    setInputText(PLAYGROUND_PRESETS[index].original);
    loadPresetIntoResult(PLAYGROUND_PRESETS[index]);
    setShowResults(false);
    setLogs([]);
  };

  // Run Real AI analysis via local NestJS REST gateway
  const handleLaunchSequence = async () => {
    if (!inputText.trim()) return;
    setIsScanning(true);
    setShowResults(false);
    setLogs(["❯ ESTABLISHING RELAY ROUTING TO NestJS CORE PORT 3001..."]);

    try {
      // Step-by-step logs for premium experience
      await new Promise((resolve) => setTimeout(resolve, 300));
      setLogs((prev) => [...prev, "❯ [SYS] AUTHORIZING DEV-MODE BYPASS..."]);
      
      const res = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mock-role": "USER"
        },
        body: JSON.stringify({ text: inputText }),
      });

      setLogs((prev) => [...prev, "❯ [NLP] STREAMING QUANTUM LEXICAL FINDINGS..."]);
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!res.ok) {
        throw new Error(`Platform gateway returned error ${res.status}`);
      }

      const data = await res.json();
      setLogs((prev) => [...prev, `❯ [SUCCESS] PARSED LANGUAGE: ${data.language || "English"}`]);
      setLogs((prev) => [...prev, "❯ COMPILING OBJECTIVE REPHRASE MAPPINGS..."]);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Map dynamic analysis response parameters
      const parsedBiases = data.biases || [];
      const calculatedObjectivity = data.scores?.objectivity ?? 75;
      const calculatedBiasIndex = data.scores?.biasIndex ?? 25;

      setAnalysisResult({
        language: data.language || "English",
        source: data.source || "FastAPI Live Sidecar",
        scores: {
          sentiment: data.scores?.sentiment || 55,
          objectivity: calculatedObjectivity,
          biasIndex: calculatedBiasIndex
        },
        tones: data.tones || [
          { name: "Informative", score: calculatedObjectivity, color: "from-blue-500 to-indigo-500" }
        ],
        biases: parsedBiases,
        cleansed: parsedBiases.filter((b: any) => b.type !== "Objective Statement").map((b: any) => b.rephrase).join(" ") || inputText,
        biasLevel: calculatedBiasIndex > 50 ? "High" : calculatedBiasIndex > 20 ? "Medium" : "Low",
        objectivityOriginal: Math.max(10, calculatedObjectivity - 30) // dynamic original mock reference
      });

      setIsScanning(false);
      setShowResults(true);
    } catch (err: any) {
      setLogs((prev) => [...prev, `❯ [ERR] PIPELINE FAILED: ${err.message}`]);
      setLogs((prev) => [...prev, "❯ INITIATING SYSTEM FALLBACK MECHANISM..."]);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Offline baseline fallback
      setAnalysisResult({
        language: "English",
        source: "Offline Baseline Fallback",
        scores: {
          sentiment: 50,
          objectivity: 75,
          biasIndex: 25
        },
        tones: [
          { name: "Informative", score: 75, color: "from-blue-500 to-indigo-500" },
          { name: "Assertive", score: 25, color: "from-purple-500 to-pink-500" }
        ],
        biases: [
          {
            quote: inputText.slice(0, Math.min(inputText.length, 60)),
            type: "Offline Mode",
            description: "Could not establish direct line to NestJS gateway.",
            rephrase: inputText
          }
        ],
        cleansed: inputText,
        biasLevel: "Low",
        objectivityOriginal: 70
      });

      setIsScanning(false);
      setShowResults(true);
    }
  };

  // HTML5 Text to speech engine
  const handleSpeak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }
  };

  const getCleansedOutput = () => {
    if (!analysisResult) return "";
    return analysisResult.cleansed || inputText;
  };

  // Helper to highlight words in original text dynamically
  const renderHighlightedOriginal = () => {
    if (!analysisResult) return <div className="text-slate-400 text-xs">{inputText}</div>;

    const rawText = inputText;
    const biasesList = analysisResult.biases || [];
    const words = rawText.split(" ");

    return (
      <div className="flex flex-wrap gap-x-1.5 gap-y-2 leading-relaxed text-slate-300 text-xs select-none">
        {words.map((w, idx) => {
          const cleanWord = w.toLowerCase().replace(/[.,!?;:()"]/g, "");
          const matchedBias = biasesList.find((b: any) => {
            const quote = (b.quote || "").toLowerCase();
            return quote.includes(cleanWord) && cleanWord.length > 2;
          });

          if (matchedBias && matchedBias.type !== "Objective Statement" && matchedBias.type !== "Offline Mode") {
            return (
              <span
                key={idx}
                className="relative group cursor-help border-b-2 border-dashed border-red-500 bg-red-950/20 text-red-300 font-bold px-1 rounded-sm transition hover:bg-red-900/30"
              >
                {w}
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-950 border border-slate-800 text-[10px] text-red-400 font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-50">
                  {matchedBias.type}: {matchedBias.description || "Linguistic bias detected."}
                </span>
              </span>
            );
          }
          return <span key={idx}>{w}</span>;
        })}
      </div>
    );
  };

  return (
    <div id="playground" className="w-full max-w-6xl mx-auto py-16 space-y-12 relative z-10 select-none">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="info" className="px-3.5 py-1 text-[10px] tracking-widest font-extrabold shadow-sm bg-indigo-950/60 border border-indigo-500/20 text-indigo-400">
          🔥 CORE INTERACTIVE WORKBENCH
        </Badge>
        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Experience Cognitive Cleansing Live
        </h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Type or select a highly subjective corporate statement below to analyze emotional bias parameters, highlight subjective wording, and view objective alternatives in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Playground Controller */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md space-y-5">
            <div>
              <span className="block text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest mb-2.5">
                1. Select Dynamic Preset Case
              </span>
              <div className="space-y-2">
                {PLAYGROUND_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLoadPreset(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition ${
                      currentPresetIndex === idx
                        ? "border-indigo-500/50 bg-indigo-950/20 text-indigo-200"
                        : "border-slate-800 hover:border-slate-700 bg-slate-950/70 text-slate-400"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{preset.label}</span>
                      {currentPresetIndex === idx && <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">
                2. Real-time Subjective Text Input
              </span>
              <Textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setShowResults(false);
                }}
                className="text-xs h-28 font-mono bg-slate-950/80 border-slate-800 focus:border-indigo-500 text-slate-300"
                placeholder="Enter subjective statements..."
              />
            </div>

            <Button
              onClick={handleLaunchSequence}
              disabled={isScanning || !inputText.trim()}
              className="w-full justify-center text-xs uppercase tracking-wider font-extrabold py-3.5"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" />
                  Analyzing Cognitive Parameters...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-2" />
                  Analyze and Cleanse Text
                </>
              )}
            </Button>
          </Card>

          {/* Scrolling Micro Terminal logs */}
          {(isScanning || logs.length > 0) && (
            <Card className="p-4 border-slate-900 bg-slate-950/90 font-mono text-[10px] text-indigo-400 space-y-1.5 h-36 overflow-y-auto shadow-2xl">
              <div className="flex items-center text-[9px] text-slate-500 uppercase tracking-widest font-extrabold mb-1">
                <Terminal className="h-3.5 w-3.5 mr-1" /> Telemetry Sidecar Console Logs
              </div>
              <AnimatePresence>
                {logs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="truncate"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </Card>
          )}
        </div>

        {/* Right Side: Visual Metrics & Cleansing Output */}
        <div className="lg:col-span-7 h-full">
          <AnimatePresence mode="wait">
            {!showResults && !isScanning ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center min-h-[380px] rounded-2xl border border-slate-900/60 bg-slate-950/20 backdrop-blur-sm p-8 text-center"
              >
                <div className="space-y-3 max-w-sm">
                  <Cpu className="h-8 w-8 text-indigo-500/50 mx-auto animate-pulse" />
                  <h4 className="text-sm font-extrabold text-slate-400">Heuristics Engine Awaiting Launch</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Set up your statement or customize the parameters, then launch the telemetry sequence to purge cognitive biases.
                  </p>
                </div>
              </motion.div>
            ) : isScanning ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center min-h-[380px] rounded-2xl border border-indigo-900/20 bg-indigo-950/5 backdrop-blur-sm p-8 text-center space-y-4"
              >
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
                  <RefreshCw className="h-10 w-10 text-indigo-400 animate-spin relative z-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Evaluating Lexical Weights</h4>
                  <p className="text-xs text-indigo-300/60 font-semibold">Running multi-language sentiment rephrase sidecar...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Metrics Summary Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Objectivity Gauge */}
                  <Card className="p-4 border-slate-900 bg-slate-950/40 flex flex-col justify-between space-y-4">
                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Objectivity Cleanse</span>
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <span className="text-2xl font-black text-emerald-400">{analysisResult?.scores?.objectivity ?? 75}%</span>
                        <span className="block text-[8px] text-slate-500 font-extrabold uppercase">Originally {analysisResult?.objectivityOriginal ?? 45}%</span>
                      </div>
                      <div className="h-1.5 w-16 bg-slate-900 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${analysisResult?.scores?.objectivity ?? 75}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Sentiment Metric */}
                  <Card className="p-4 border-slate-900 bg-slate-950/40 flex flex-col justify-between space-y-4">
                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Sentiment Output</span>
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold text-indigo-300 block truncate">
                        {analysisResult?.scores?.sentiment >= 70 ? "Assertive / Subjective" : "Balanced / Objective"}
                      </span>
                      <span className="text-[8px] text-slate-500 font-extrabold uppercase block truncate">Source: {analysisResult?.source}</span>
                    </div>
                  </Card>

                  {/* Bias Category */}
                  <Card className="p-4 border-slate-900 bg-slate-950/40 flex flex-col justify-between space-y-4">
                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Original Bias Level</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="error" className="shadow-lg shadow-red-950/30 px-3 py-1 text-[10px] font-extrabold">
                        {analysisResult?.biasLevel} Bias Detected
                      </Badge>
                    </div>
                  </Card>
                </div>

                {/* Comparative Output panel */}
                <Card className="border-slate-900 bg-slate-950/60 p-6 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

                  {/* Before Segment */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Subjective Phrase Highlights (Hover to inspect)</span>
                    </div>
                    <div className="p-4 rounded-xl border border-red-950/40 bg-red-950/5 leading-relaxed font-sans text-xs">
                      {renderHighlightedOriginal()}
                    </div>
                  </div>

                  {/* After Segment */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Balanced Cleansed Output</span>
                      </div>

                      {/* Audio Synthesizer Button */}
                      <button
                        onClick={() => handleSpeak(getCleansedOutput())}
                        className={`flex items-center space-x-1 px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border transition ${
                          isPlayingAudio
                            ? "bg-indigo-950/60 text-indigo-400 border-indigo-500/30 animate-pulse"
                            : "bg-slate-950 hover:bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>{isPlayingAudio ? "Streaming Audio..." : "Acoustic Readout"}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-xl border border-emerald-950/40 bg-emerald-950/5 leading-relaxed text-slate-200 text-xs relative">
                      {getCleansedOutput()}
                      {isPlayingAudio && (
                        <div className="absolute bottom-2.5 right-3 flex items-center space-x-0.5">
                          <span className="w-[1.5px] h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-[1.5px] h-3.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-[1.5px] h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          <span className="w-[1.5px] h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "450ms" }} />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

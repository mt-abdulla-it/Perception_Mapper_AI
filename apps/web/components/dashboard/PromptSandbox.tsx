"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Shield, Play, RotateCcw, Copy, Check } from "lucide-react";

export default function PromptSandbox() {
  const defaultPrompt = "You are a neutral linguistic security auditor. Extract all subjective intensifiers, loaded bias quote parameters, and emotional intensifiers, and replace them with objective alternatives.";
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [sandboxInput, setSandboxInput] = useState("We are completely thrilled to announce that this spectacular release is incredibly revolutionary!");
  const [sandboxOutput, setSandboxOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"curl" | "node" | "python">("curl");
  const [copied, setCopied] = useState(false);

  const [customGeminiKey, setCustomGeminiKey] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCustomGeminiKey(localStorage.getItem("pm_gemini_api_key") || "");
    }
  }, []);

  const handleGeminiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomGeminiKey(val);
    if (typeof window !== "undefined") {
      if (val.trim()) {
        localStorage.setItem("pm_gemini_api_key", val.trim());
      } else {
        localStorage.removeItem("pm_gemini_api_key");
      }
    }
  };

  const handleDryRun = () => {
    if (!sandboxInput || isRunning) return;
    setIsRunning(true);
    setTimeout(() => {
      if (prompt.toLowerCase().includes("extreme") || prompt.toLowerCase().includes("neutral")) {
        setSandboxOutput("We announce that this release is active and deployed.");
      } else {
        setSandboxOutput("We announce that this release is functional.");
      }
      setIsRunning(false);
    }, 900);
  };

  const codeSnippets = {
    curl: `curl -X POST http://localhost:3001/api/analyze/developer \\\n  -H "X-API-Key: pm_key_team_pro_2026" \\\n  -H "Content-Type: application/json" \\\n  -d '{"text": "${sandboxInput.replace(/'/g, "\\'")}"}'`,
    node: `import { PerceptionMapper } from '@perception-mapper/sdk';\n\nconst client = new PerceptionMapper({ apiKey: 'pm_key_team_pro_2026' });\nconst result = await client.analyze({\n  text: '${sandboxInput.replace(/'/g, "\\'")}'\n});\nconsole.log(result.cleansedText);`,
    python: `import requests\n\nresponse = requests.post(\n    "http://localhost:3001/api/analyze/developer",\n    headers={"X-API-Key": "pm_key_team_pro_2026"},\n    json={"text": "${sandboxInput.replace(/"/g, '\\"')}"}\n)\nprint(response.json()["cleansedText"])`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950/40 border border-slate-900/60 backdrop-blur-md rounded-2xl p-6 relative select-none font-sans overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-6">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-purple-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">System Directives Sandbox</h3>
        </div>
        <button onClick={() => setPrompt(defaultPrompt)} className="flex items-center space-x-1 px-2.5 py-1 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-[9px] font-bold text-slate-500 hover:text-slate-300 rounded-lg transition cursor-pointer">
          <RotateCcw className="h-3 w-3" />
          <span>Reset Prompt</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
        <div className="space-y-4">
          <div>
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">System Prompt Instructions</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-900 focus:border-purple-500 focus:outline-none rounded-xl p-3.5 text-[10.5px] font-mono leading-relaxed text-slate-300 h-28 resize-none"
            />
          </div>
          <div>
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Dry-Run Test Input</span>
            <input
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-900 focus:border-purple-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-[10.5px] text-slate-300 font-sans"
            />
          </div>
        </div>

        <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-3.5">
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 block">Dry-Run Output Auditing</span>
            {sandboxOutput ? (
              <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl space-y-2">
                <div className="flex items-center space-x-1.5">
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wide">Directive override verified</span>
                </div>
                <p className="text-[10px] text-slate-300 italic">"{sandboxOutput}"</p>
              </div>
            ) : (
              <div className="text-center py-8 text-[9px] font-bold uppercase tracking-wider text-slate-600">Awaiting dry-run execution</div>
            )}
          </div>

          <button
            onClick={handleDryRun}
            disabled={isRunning || !sandboxInput}
            className="w-full py-2.5 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition duration-300 disabled:opacity-40 flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            {isRunning ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                <span>Scanning Sandbox Vector...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Execute Sandbox Heuristic</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Developer API Console & Playground Code Generator */}
      <div className="border-t border-slate-900 mt-8 pt-6 space-y-4 text-left">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Developer API Integration Console</h3>
        </div>
        <p className="text-[10px] text-slate-400">
          Access automated multilingual perception audits inside your publishing queue or custom pipelines by routing payload triggers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 bg-slate-950/80 border border-slate-900 rounded-xl p-4 space-y-3.5">
            <div>
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">Developer Integration Key</span>
              <div className="bg-slate-950 border border-slate-900 rounded-lg p-2.5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-indigo-400 select-all font-bold">pm_key_team_pro_2026</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 font-extrabold">ACTIVE</span>
              </div>
            </div>

            <div className="border-t border-slate-900 pt-3">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">Gemini API Key Override</span>
              <div className="space-y-2">
                <input
                  type="password"
                  value={customGeminiKey}
                  onChange={handleGeminiKeyChange}
                  placeholder="Enter Gemini API Key..."
                  className="w-full bg-slate-950 border border-slate-900 focus:border-purple-500 focus:outline-none rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300 font-mono"
                />
                <p className="text-[9px] text-slate-500 leading-relaxed">
                  Used client-side for dynamic AI-powered rephrasings (saved to your local session).
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-950/80 border border-slate-900 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900/60 pb-2">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Playground Code Generator</span>
              <span className="text-[8px] text-indigo-400 font-bold uppercase">Rate limit: 120/min</span>
            </div>

            <div className="space-y-2">
              {/* Interactive Tabs & Copy */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <div className="flex space-x-2">
                  <button onClick={() => setActiveTab("curl")} className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition cursor-pointer ${activeTab === "curl" ? "text-white bg-slate-800 border border-slate-700" : "text-slate-400 hover:text-white"}`}>cURL</button>
                  <button onClick={() => setActiveTab("node")} className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition cursor-pointer ${activeTab === "node" ? "text-white bg-slate-800 border border-slate-700" : "text-slate-400 hover:text-white"}`}>Node.js</button>
                  <button onClick={() => setActiveTab("python")} className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition cursor-pointer ${activeTab === "python" ? "text-white bg-slate-800 border border-slate-700" : "text-slate-400 hover:text-white"}`}>Python</button>
                </div>
                <button onClick={handleCopyCode} className="flex items-center space-x-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[9px] font-bold text-slate-300 hover:text-white rounded transition cursor-pointer">
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-slate-400" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* Code Snippet Box */}
              <pre className="bg-slate-950 border border-slate-900 rounded-lg p-3 text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
{codeSnippets[activeTab]}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


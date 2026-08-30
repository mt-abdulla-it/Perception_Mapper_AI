"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@perception-mapper/ui";
import { Globe, Mic, Cpu, Layers, Sparkles, ShieldCheck } from "lucide-react";

export default function LandingFeatures() {
  const list = [
    { title: "Multilingual Analysis", desc: "Analyze text sentiment and cognitive bias in English, Tamil, and Sinhala.", icon: <Globe className="h-5 w-5" />, glow: "hover:shadow-indigo-500/10 hover:border-indigo-500/30", text: "text-indigo-400" },
    { title: "Voice Input & Readout", desc: "Record speech for instant transcription and listen to cleansed outputs via TTS.", icon: <Mic className="h-5 w-5" />, glow: "hover:shadow-purple-500/10 hover:border-purple-500/30", text: "text-purple-400" },
    { title: "Image OCR Scanner", desc: "Extract and analyze text from images, documents, and scanned files.", icon: <Cpu className="h-5 w-5" />, glow: "hover:shadow-pink-500/10 hover:border-pink-500/30", text: "text-pink-400" },
    { title: "Custom Bias Rules", desc: "Define custom regex patterns and classification rules to tailor scans to your needs.", icon: <Layers className="h-5 w-5" />, glow: "hover:shadow-blue-500/10 hover:border-blue-500/30", text: "text-blue-400" },
    { title: "One-Click Rephrasing", desc: "Instantly generate objective alternatives in journalistic, empathetic, or professional tones.", icon: <Sparkles className="h-5 w-5" />, glow: "hover:shadow-cyan-500/10 hover:border-cyan-500/30", text: "text-cyan-400" },
    { title: "Role-Based Access Control", desc: "Secure your workspace with admin guards, API key authentication, and audit logging.", icon: <ShieldCheck className="h-5 w-5" />, glow: "hover:shadow-emerald-500/10 hover:border-emerald-500/30", text: "text-emerald-400" }
  ];

  return (
    <div id="features" className="w-full max-w-6xl mx-auto py-16 space-y-10 relative z-10 select-none">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Powerful Multimodal Features
        </h3>
        <p className="text-xs text-slate-400">
          Detect, evaluate, and correct cognitive bias across multilingual text, voice, and image inputs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {list.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
          >
            <Card className={`p-6 border-slate-900 bg-slate-950/40 backdrop-blur-md transition-all duration-300 h-full flex flex-col justify-between ${item.glow} hover:shadow-lg`}>
              <div>
                <div className={`p-3 rounded-xl border border-slate-900 bg-slate-950/80 w-11 h-11 flex items-center justify-center mb-5 ${item.text}`}>
                  {item.icon}
                </div>
                <h4 className="text-sm font-extrabold text-white tracking-wide mb-2.5">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  {item.desc}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

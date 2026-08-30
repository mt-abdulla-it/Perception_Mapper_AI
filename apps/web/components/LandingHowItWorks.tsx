"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ShieldAlert, Cpu } from "lucide-react";

export default function LandingHowItWorks() {
  const steps = [
    { title: "1. Enter Your Text", desc: "Type a statement, record via microphone, or upload an image for OCR extraction.", icon: <Cpu className="h-5 w-5" />, color: "text-indigo-400 border-indigo-500/20 bg-indigo-950/40" },
    { title: "2. AI Analyzes Bias", desc: "Multi-layered NLP models detect sentiment, tone, and cognitive bias patterns.", icon: <ShieldAlert className="h-5 w-5" />, color: "text-purple-400 border-purple-500/20 bg-purple-950/40" },
    { title: "3. Get Clean Output", desc: "Receive objective, balanced rephrasings you can use immediately.", icon: <CheckCircle className="h-5 w-5" />, color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/40" }
  ];

  return (
    <div id="how-it-works" className="w-full max-w-5xl mx-auto py-16 space-y-12 relative z-10 select-none">
      <div className="text-center space-y-3">
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          How It Works
        </h3>
        <p className="text-xs text-slate-400">Three simple steps to analyze and cleanse cognitive bias from your text</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connector line for desktop */}
        <div className="absolute top-1/3 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-cyan-500/30 hidden md:block" />

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="flex flex-col items-center text-center space-y-4 relative"
          >
            <div className={`p-4 rounded-full border shadow-lg ${step.color} relative z-10 w-14 h-14 flex items-center justify-center`}>
              {step.icon}
            </div>
            <div className="space-y-1.5 max-w-xs">
              <h4 className="text-sm font-extrabold text-white">{step.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

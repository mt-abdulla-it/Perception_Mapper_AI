"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LandingStats() {
  const [users, setUsers] = useState(0);
  const [apiCalls, setApiCalls] = useState(0);
  const [uptime, setUptime] = useState(90.0);
  const [analyses, setAnalyses] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds count up
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Easing out quad
      const ease = progress * (2 - progress);

      setUsers(Math.round(ease * 12450));
      setApiCalls(Number((ease * 45.8).toFixed(1)));
      setUptime(Number((90.0 + ease * 9.9).toFixed(1)));
      setAnalyses(Math.round(ease * 123890));

      if (frame >= totalFrames) {
        clearInterval(interval);
      }
    }, frameRate);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Active Users", val: `${users.toLocaleString()}+`, color: "text-indigo-400" },
    { label: "Texts Analyzed", val: `${analyses.toLocaleString()}+`, color: "text-purple-400" },
    { label: "API Requests Served", val: `${apiCalls}M+`, color: "text-cyan-400" },
    { label: "Platform Uptime", val: `${uptime}%`, color: "text-emerald-400" }
  ];

  return (
    <div id="stats" className="w-full max-w-6xl mx-auto py-10 relative z-10 select-none">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md text-center shadow-lg"
          >
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-2">
              {stat.label}
            </span>
            <span className={`text-2xl md:text-3xl font-extrabold tracking-tight ${stat.color}`}>
              {stat.val}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

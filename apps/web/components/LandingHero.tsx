"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Badge } from "@perception-mapper/ui";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface LandingHeroProps {
  onSignUp?: () => void;
  loadingAction?: string | null;
}

export default function LandingHero({ onSignUp, loadingAction = null }: LandingHeroProps) {
  const [typedText, setTypedText] = useState("");
  const fullText = "Unveil implicit cognitive biases, rephrase subjective phrases, and audit transaction logs securely.";
  const router = useRouter();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, []);

  const handleAction = () => {
    if (onSignUp) {
      onSignUp();
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <div id="hero" className="text-center max-w-4xl mx-auto space-y-6 relative pt-12 select-none">
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none animate-pulse" />
      
      <Badge variant="info" className="px-3.5 py-1 text-[10px] tracking-widest font-extrabold shadow-sm bg-indigo-950/60 border border-indigo-500/20 text-indigo-400">
        ✨ PERCEPTION AI PLATFORM v1.0 ENTERPRISE
      </Badge>
      
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
        The Advanced Cognitive <br />
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Perception Security Suite
        </span>
      </h1>
      
      <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed h-12 font-semibold">
        {typedText}
        <span className="animate-pulse text-indigo-400 font-bold ml-0.5">|</span>
      </p>

      <div className="flex justify-center items-center gap-4 pt-4 relative z-10 font-sans">
        <motion.button
          onClick={handleAction}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loadingAction === "sign-up"}
          aria-label="Get started with Perception Mapper AI for free"
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-650 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl px-7 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-650/15 transition duration-300 disabled:opacity-50"
        >
          {loadingAction === "sign-up" && (
            <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" />
          )}
          <span>Get Started Free</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </motion.button>
      </div>
    </div>
  );
}

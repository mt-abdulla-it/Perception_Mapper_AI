"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface LandingCTAProps {
  onSignUp?: () => void;
}

export default function LandingCTA({ onSignUp }: LandingCTAProps) {
  const router = useRouter();

  const handleAction = () => {
    if (onSignUp) {
      onSignUp();
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <div id="cta" className="w-full max-w-5xl mx-auto py-16 relative z-10 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-cyan-950/40 p-8 md:p-12 text-center shadow-2xl shadow-indigo-500/5 flex flex-col items-center space-y-6"
      >
        <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-indigo-500/10 blur-[30px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[150px] h-[150px] rounded-full bg-cyan-500/10 blur-[30px] pointer-events-none" />
        
        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none text-white max-w-xl">
          Start Writing With Clarity and Confidence
        </h3>
        
        <p className="text-xs md:text-sm text-slate-300 max-w-md leading-relaxed font-semibold">
          Detect cognitive biases, receive objective rephrasing suggestions, and ensure balanced multilingual communication — all in one platform.
        </p>

        <motion.button
          onClick={handleAction}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl px-8 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition duration-300 relative z-10"
        >
          <span>Start Analyzing Text</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </motion.button>
      </motion.div>
    </div>
  );
}

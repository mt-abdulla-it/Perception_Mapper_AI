"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface TTSReadoutProps {
  text: string;
  mode: "emotional" | "neutral";
}

export default function TTSReadout({ text, mode }: TTSReadoutProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const handleSpeak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Apply speech profiles
    if (mode === "emotional") {
      utterance.pitch = 1.25;
      utterance.rate = 1.1;
    } else {
      utterance.pitch = 0.65;
      utterance.rate = 0.82;
      
      // Select a deeper/robotic voice if available
      const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
      const robotVoice = availableVoices.find((v) => v.name.includes("Google") || v.name.includes("Microsoft"));
      if (robotVoice) utterance.voice = robotVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-[9px] font-extrabold uppercase tracking-wider transition-all duration-300 relative hover:scale-[1.02] active:scale-[0.98] ${
        isPlaying
          ? "bg-rose-950/40 border-rose-500/25 text-rose-400 hover:text-white hover:border-rose-500/50 shadow-sm shadow-rose-950/50"
          : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 shadow-sm"
      }`}
    >
      {isPlaying ? (
        <>
          <VolumeX className="h-3 w-3 animate-pulse" />
          <span>Stop Readout</span>
        </>
      ) : (
        <>
          <Volume2 className="h-3 w-3" />
          <span>vocalize {mode}</span>
        </>
      )}
    </button>
  );
}

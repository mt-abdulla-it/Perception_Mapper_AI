"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@perception-mapper/ui";

export default function LandingTestimonials() {
  const reviews = [
    { text: "“Perception Mapper transformed how our editorial team reviews content for objectivity. We catch biases we’d never notice manually.”", name: "Arjun Mehta", role: "Head of Content", company: "MediaWorks Digital", avatar: "https://ui-avatars.com/api/?name=Arjun+Mehta&background=4f46e5&color=fff" },
    { text: "“The multilingual support is a game-changer. Analyzing Tamil and Sinhala content alongside English in one platform saves us hours.”", name: "Priya Ramanathan", role: "Localization Lead", company: "LangBridge Solutions", avatar: "https://ui-avatars.com/api/?name=Priya+Ramanathan&background=3b0764&color=fff" },
    { text: "“Custom bias rules let us enforce our editorial standards automatically. The rephrase suggestions are surprisingly accurate.”", name: "David Chen", role: "Quality Assurance Manager", company: "Newsroom Analytics", avatar: "https://ui-avatars.com/api/?name=David+Chen&background=0284c7&color=fff" }
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <div id="testimonials" className="w-full max-w-4xl mx-auto py-16 space-y-8 relative z-10 select-none">
      <div className="text-center space-y-3">
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Trusted by Content Teams
        </h3>
        <p className="text-xs text-slate-400">See how teams use Perception Mapper to improve content objectivity</p>
      </div>

      <div className="relative h-44 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl"
          >
            <Card className="p-6 text-center border-slate-900 bg-slate-950/40 backdrop-blur-md space-y-4 shadow-xl">
              <p className="text-xs md:text-sm text-slate-300 italic leading-relaxed font-semibold">
                {reviews[active].text}
              </p>
              <div className="flex items-center justify-center space-x-3 text-xs">
                <img
                  src={reviews[active].avatar}
                  alt={reviews[active].name}
                  className="h-8 w-8 rounded-full border border-slate-800"
                />
                <div className="text-left leading-tight">
                  <span className="block font-bold text-white">{reviews[active].name}</span>
                  <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                    {reviews[active].role} · {reviews[active].company}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center space-x-2">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${active === idx ? "bg-indigo-500 w-4" : "bg-slate-800"}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

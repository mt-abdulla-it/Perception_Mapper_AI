'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PricingToggle from './PricingToggle';

interface PricingHeroProps {
  isAnnual: boolean;
  onToggleChange: (val: boolean) => void;
}

export default function PricingHero({ isAnnual, onToggleChange }: PricingHeroProps) {
  return (
    <section className="relative text-center space-y-6 max-w-3xl mx-auto py-16 sm:py-24 select-none overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-500/10 rounded-full blur-[100px] sm:blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 space-y-5 px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="inline-block"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-semibold text-blue-400 tracking-wider uppercase mb-2 backdrop-blur-md shadow-xl shadow-blue-900/20">
            Pricing Plans
          </span>
        </motion.div>
        
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">transparent</span> pricing
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mt-4">
          Start free. Upgrade when you need multilingual power, advanced bias scopes, or team workspace collaboration.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="pt-8 sm:pt-10 relative z-10 flex justify-center"
      >
        <PricingToggle isAnnual={isAnnual} onChange={onToggleChange} />
      </motion.div>
    </section>
  );
}

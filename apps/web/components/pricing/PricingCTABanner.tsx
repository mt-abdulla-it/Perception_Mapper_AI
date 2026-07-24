import React from 'react';
import Link from 'next/link';

export default function PricingCTABanner() {
  return (
    <section className="py-12 select-none max-w-5xl mx-auto">
      <div className="rounded-3xl border border-indigo-500/20 bg-slate-900/40 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Background glow flares */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="space-y-2 z-10">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
            Ready to analyze smarter?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-lg leading-relaxed">
            Join 2,000+ analysts, editors, and teams using Perception Mapper AI to audit structural cognitive biases and emotions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 z-10 shrink-0">
          <Link
            href="/sign-up?plan=free"
            className="px-5 py-2.5 rounded-xl text-center bg-indigo-600 hover:bg-indigo-600 text-white font-bold uppercase tracking-wider text-xs border border-indigo-500 shadow-md transition"
            aria-label="Start for free"
          >
            Start for free
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl text-center bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold uppercase tracking-wider text-xs border border-slate-800 transition"
            aria-label="Talk to sales team"
          >
            Talk to sales
          </Link>
        </div>
      </div>
    </section>
  );
}

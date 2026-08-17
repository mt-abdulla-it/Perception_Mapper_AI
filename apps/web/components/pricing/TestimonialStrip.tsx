import React from 'react';
import { Star } from 'lucide-react';
import { testimonials } from './pricingData';

export default function TestimonialStrip() {
  return (
    <section className="space-y-8 py-12 select-none max-w-5xl mx-auto font-sans">
      <div className="text-center space-y-2.5">
        <span className="text-[9px] font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-500/25 rounded-md px-3 py-0.5 uppercase tracking-widest">
          Trusted Globally
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-450 bg-clip-text">
          What Our Clients Say
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => {
          const initials = t.author
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={t.id}
              className="p-6 rounded-2xl border border-slate-800/80 bg-slate-950/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-between space-y-5 hover:border-indigo-500/35 hover:scale-[1.025] hover:shadow-[0_0_30px_rgba(99,102,241,0.05)] transition-all duration-300 group shadow-lg"
            >
              {/* Blur Hover Spot */}
              <div className="absolute top-0 right-0 w-[100px] h-[100px] rounded-full bg-indigo-500/5 blur-[25px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="space-y-3 relative z-10">
                {/* Star Rating */}
                <div className="flex space-x-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-slate-900/60 relative z-10">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-300 font-mono shrink-0">
                  {initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide transition-colors group-hover:text-indigo-300 duration-300">
                    {t.author}
                  </h4>
                  <span className="text-[8px] text-slate-550 font-bold uppercase tracking-widest block mt-0.5">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


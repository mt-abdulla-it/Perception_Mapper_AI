"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqItems } from './pricingData';

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="space-y-8 py-12 select-none max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-md mx-auto">
          Everything you need to know about subscribing, payments, billing limits, and multilingual capabilities.
        </p>
      </div>

      <div className="grid gap-3">
        {faqItems.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/25 overflow-hidden transition-all duration-300 hover:border-slate-700/60"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(item.id)}
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
                id={`faq-btn-${item.id}`}
              >
                <span className="text-xs sm:text-sm font-bold text-slate-200 select-none">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-4.5 w-4.5 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>

              <div
                id={`faq-answer-${item.id}`}
                role="region"
                aria-labelledby={`faq-btn-${item.id}`}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[250px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4 text-xs text-slate-400 font-medium leading-relaxed border-t border-slate-800/50 pt-3">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

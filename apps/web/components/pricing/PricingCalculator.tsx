"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calculator, Users, Languages, FileText, Check, Sparkles, Layers, Zap, ArrowRight, Info } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { pricingPlans, PricingPlan } from "./pricingData";
import { motion, AnimatePresence } from "framer-motion";

interface PricingCalculatorProps {
  isAnnual: boolean;
  onSelectPlan?: (planId: "free" | "basic" | "pro", price: number, name: string) => void;
}

const iconMap = {
  Sparkles: <Sparkles className="h-5 w-5 text-indigo-400" />,
  Layers: <Layers className="h-5 w-5 text-blue-400" />,
  Zap: <Zap className="h-5 w-5 text-emerald-400" />,
};

export default function PricingCalculator({ isAnnual, onSelectPlan }: PricingCalculatorProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const [analyses, setAnalyses] = useState<number>(300);
  const [seats, setSeats] = useState<number>(1);
  const [needsMultilingual, setNeedsMultilingual] = useState<boolean>(true);
  const [needsAPI, setNeedsAPI] = useState<boolean>(false);
  const [recommendedPlan, setRecommendedPlan] = useState<PricingPlan>(pricingPlans[1]); // Default to Basic

  // Calculate percentages for sliders
  const analysesPercent = ((analyses - 10) / (2000 - 10)) * 100;
  const seatsPercent = ((seats - 1) / (30 - 1)) * 100;

  // Real-time plan recommendation algorithm
  useEffect(() => {
    let planId: "free" | "basic" | "pro" = "free";

    if (analyses > 500 || seats > 1 || needsAPI) {
      planId = "pro";
    } else if (analyses > 50 || needsMultilingual) {
      planId = "basic";
    } else {
      planId = "free";
    }

    const matchedPlan = pricingPlans.find((p) => p.id === planId);
    if (matchedPlan) {
      setRecommendedPlan(matchedPlan);
    }
  }, [analyses, seats, needsMultilingual, needsAPI]);

  const recommendedPrice = isAnnual ? recommendedPlan.priceAnnually : recommendedPlan.priceMonthly;

  const handleAction = () => {
    if (!isSignedIn) {
      router.push(`/sign-up?plan=${recommendedPlan.id}`);
      return;
    }

    if (recommendedPlan.id === "free") {
      router.push("/dashboard");
      return;
    }

    if (onSelectPlan) {
      onSelectPlan(recommendedPlan.id, recommendedPrice, recommendedPlan.name);
    }
  };

  return (
    <section className="space-y-6 py-6 select-none max-w-5xl mx-auto font-sans">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-950/40 border border-indigo-500/20 rounded-full text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
          <Calculator className="h-3 w-3" />
          <span>Interactive Resource Estimator</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
          Estimate Your Pipeline Costs
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-lg mx-auto">
          Adjust the sliders to simulate your active workspace capacity. We will dynamically match the most resource-efficient tier.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
        {/* Left Side: Estimator Sliders & Toggles */}
        <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800/80 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between space-y-6">
          
          {/* Monthly Analyses Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <FileText className="h-4.5 w-4.5 text-indigo-400 mr-2" />
                Monthly Analysis Scans
              </label>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={analyses}
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="text-xs font-mono font-bold text-indigo-400 bg-slate-950 px-2 py-0.5 border border-slate-800 rounded-lg inline-block"
                >
                  {analyses === 2000 ? "Unlimited Scans" : `${analyses} scans / mo`}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="relative">
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={analyses}
                onChange={(e) => setAnalyses(Number(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${analysesPercent}%, #020617 ${analysesPercent}%, #020617 100%)`
                }}
              />
              <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase pt-1 px-1">
                <span>Free (50 max)</span>
                <span>Basic (500 max)</span>
                <span>Pro / Unlimited</span>
              </div>
            </div>
          </div>

          {/* Seat Roster Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Users className="h-4.5 w-4.5 text-blue-400 mr-2" />
                Workspace Seat Allocations
              </label>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={seats}
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="text-xs font-mono font-bold text-blue-400 bg-slate-950 px-2 py-0.5 border border-slate-800 rounded-lg inline-block"
                >
                  {seats === 30 ? "Enterprise (30+ seats)" : `${seats} ${seats === 1 ? "seat" : "seats"}`}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${seatsPercent}%, #020617 ${seatsPercent}%, #020617 100%)`
                }}
              />
              <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase pt-1 px-1">
                <span>1 Seat (Free/Basic)</span>
                <span>Up to 20 Seats (Pro)</span>
                <span>30+ (Enterprise)</span>
              </div>
            </div>
          </div>

          {/* Grid of Toggle Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Languages Toggle */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3">
              <div className="flex items-start space-x-2.5">
                <Languages className="h-4.5 w-4.5 text-pink-400 shrink-0" />
                <div className="text-left space-y-0.5">
                  <span className="block text-[10px] font-bold text-slate-200 uppercase tracking-wider">Multi-locale NLP</span>
                  <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">English + Tamil + Sinhala language processing</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[8px] font-extrabold uppercase text-slate-400">Required</span>
                <button
                  type="button"
                  onClick={() => setNeedsMultilingual(!needsMultilingual)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                    needsMultilingual ? "bg-pink-600" : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      needsMultilingual ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* API Access Toggle */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3">
              <div className="flex items-start space-x-2.5">
                <Zap className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                <div className="text-left space-y-0.5">
                  <span className="block text-[10px] font-bold text-slate-200 uppercase tracking-wider">Developer Console</span>
                  <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">Programmatic X-API-Key query endpoints</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[8px] font-extrabold uppercase text-slate-400">Required</span>
                <button
                  type="button"
                  onClick={() => setNeedsAPI(!needsAPI)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                    needsAPI ? "bg-emerald-600" : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      needsAPI ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Recommendation Card Display */}
        <div className="lg:col-span-5 flex flex-col items-stretch">
          <AnimatePresence mode="wait">
            <motion.div
              key={recommendedPlan.id + (seats > 20 ? "-enterprise" : "")}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="flex-grow flex flex-col"
            >
              {seats > 20 ? (
                /* Enterprise Recommendation */
                <div className="flex-grow rounded-3xl border border-purple-500/50 ring-1 ring-purple-500/20 bg-slate-950/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-[0_0_25px_rgba(168,85,247,0.08)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 blur-[20px] pointer-events-none" />
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[9px] font-bold text-white bg-purple-600 border border-purple-500 rounded-full uppercase tracking-widest shadow-md">
                    Custom Setup
                  </span>

                  <div className="space-y-5 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <Zap className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white uppercase tracking-wider">Enterprise</h3>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Dedicated Scaled Clusters</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Your workload demands scaled workspace capacities and high-throughput dedicated nodes.
                    </p>

                    <div className="pt-2 flex items-baseline space-x-1 select-none">
                      <span className="text-2xl font-extrabold text-white tracking-tight">
                        Contact Sales
                      </span>
                    </div>

                    <div className="w-full h-px bg-slate-800/60" />

                    <ul className="space-y-3.5 text-xs text-slate-300 font-medium py-2">
                      <li className="flex items-center space-x-2.5">
                        <Check className="h-4 w-4 text-purple-400 shrink-0" />
                        <span>Dedicated compute containers</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="h-4 w-4 text-purple-400 shrink-0" />
                        <span>High throughput custom SLA limits</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <Check className="h-4 w-4 text-purple-400 shrink-0" />
                        <span>Custom SSO / SAML integrations</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6">
                    <a
                      href="/contact"
                      className="block w-full text-center py-2.5 bg-purple-600 hover:bg-purple-500 text-white border border-purple-500 hover:border-purple-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md"
                    >
                      Connect with Support
                    </a>
                  </div>
                </div>
              ) : (
                /* Standard Recommendations: Free, Basic, Pro */
                <div
                  className={`flex-grow rounded-3xl border p-6 flex flex-col justify-between glass-card transition-all duration-300 shadow-2xl relative overflow-hidden ${
                    recommendedPlan.id === "pro"
                      ? "border-emerald-500/50 ring-1 ring-emerald-500/20 bg-slate-950/40 shadow-[0_0_25px_rgba(16,185,129,0.08)]"
                      : recommendedPlan.id === "basic"
                      ? "border-blue-500/50 ring-1 ring-blue-500/20 bg-slate-950/40 shadow-[0_0_25px_rgba(59,130,246,0.08)]"
                      : "border-slate-800/80 bg-slate-950/20 shadow-indigo-950/10"
                  }`}
                >
                  {/* Glowing corner accent */}
                  <div className={`absolute top-0 right-0 w-[120px] h-[120px] rounded-full blur-[20px] pointer-events-none ${
                    recommendedPlan.id === "pro"
                      ? "bg-gradient-to-tr from-emerald-500/10 to-indigo-500/10"
                      : recommendedPlan.id === "basic"
                      ? "bg-gradient-to-tr from-blue-500/10 to-indigo-500/10"
                      : "bg-gradient-to-tr from-indigo-500/5 to-slate-500/5"
                  }`} />

                  {/* Recommendation Badge */}
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[9px] font-bold text-white border rounded-full uppercase tracking-widest shadow-md ${
                    recommendedPlan.id === "pro"
                      ? "bg-emerald-600 border-emerald-500"
                      : recommendedPlan.id === "basic"
                      ? "bg-blue-600 border-blue-500"
                      : "bg-slate-800 border-slate-700 text-slate-300"
                  }`}>
                    {recommendedPlan.id === "free" ? "Free Tier" : "Recommended plan"}
                  </span>

                  <div className="space-y-5 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        {iconMap[recommendedPlan.iconName] || <Sparkles className="h-5 w-5 text-slate-400" />}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white uppercase tracking-wider">{recommendedPlan.name} Plan</h3>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {recommendedPlan.id === "pro" ? "Enterprise Workspace" : "Individual Tier"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 font-medium leading-relaxed min-h-[36px]">
                      {recommendedPlan.description}
                    </p>

                    <div className="pt-2 flex items-baseline space-x-1 select-none">
                      <span className="text-3xl font-extrabold text-white tracking-tight">
                        ${recommendedPrice}
                      </span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        / mo
                      </span>
                      {isAnnual && recommendedPrice > 0 && (
                        <span className="text-[9px] text-slate-400 ml-2 font-semibold">
                          (billed annually)
                        </span>
                      )}
                      {isAnnual && recommendedPlan.id !== "free" && (
                        <span className="ml-3 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[9px] font-extrabold text-emerald-400 uppercase tracking-wide">
                          Save ${recommendedPlan.id === "pro" ? "144" : "48"}/yr
                        </span>
                      )}
                    </div>

                    <div className="w-full h-px bg-slate-800/60" />

                    <ul className="space-y-3.5 text-xs text-slate-300 font-medium py-2">
                      <li className="flex items-start space-x-2.5">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          {recommendedPlan.id === "free"
                            ? "50 scans / mo limit"
                            : recommendedPlan.id === "basic"
                            ? "500 scans / mo limit"
                            : "Unlimited monthly scans"}
                        </span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{needsMultilingual || recommendedPlan.id !== "free" ? "Multi-locale supported" : "English only"}</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{seats > 1 || recommendedPlan.id === "pro" ? "Up to 20 seats workspace" : "Single User setup"}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={handleAction}
                      className={`w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md border ${
                        recommendedPlan.id === "basic"
                          ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-500"
                          : recommendedPlan.id === "pro"
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      <span>{recommendedPlan.ctaLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

"use client";
import React, { useState, useEffect } from 'react';
import PricingHero from '../../components/pricing/PricingHero';
import PricingCard from '../../components/pricing/PricingCard';
import ComparisonTable from '../../components/pricing/ComparisonTable';
import PricingCalculator from '../../components/pricing/PricingCalculator';
import FAQAccordion from '../../components/pricing/FAQAccordion';
import TestimonialStrip from '../../components/pricing/TestimonialStrip';
import PricingCTABanner from '../../components/pricing/PricingCTABanner';
import StripeCheckoutModal from '../../components/pricing/StripeCheckoutModal';
import { pricingPlans } from '../../components/pricing/pricingData';
import { useAuth } from '../../hooks/useAuth';

export default function PricingPage() {
  const { user, setTier } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<{ id: 'free' | 'basic' | 'pro'; price: number; name: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      const searchParams = new URLSearchParams(window.location.search);
      const planParam = searchParams.get("plan");
      if (planParam === "free" || planParam === "basic" || planParam === "pro") {
        const selectedPlan = pricingPlans.find((p) => p.id === planParam);
        if (selectedPlan) {
          if (selectedPlan.id === "free") {
            setTier("FREE");
          } else {
            setCheckoutPlan({
              id: selectedPlan.id,
              price: isAnnual ? selectedPlan.priceAnnually : selectedPlan.priceMonthly,
              name: selectedPlan.name,
            });
          }
          // Clean search parameter so the modal doesn't open continuously on state changes
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);
        }
      }
    }
  }, [user, isAnnual, setTier]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans px-4 sm:px-6 lg:px-8 py-6 relative overflow-hidden">
      {/* Decorative premium radial glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        {/* Header Hero Section */}
        <PricingHero isAnnual={isAnnual} onToggleChange={setIsAnnual} />

        {/* 3-Plan Responsive Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isAnnual={isAnnual}
              onSelectPlan={(id, price, name) => setCheckoutPlan({ id, price, name })}
            />
          ))}
        </div>

        {/* Social Proof Strip */}
        <TestimonialStrip />

        {/* Dynamic Calculator Estimator */}
        <PricingCalculator
          isAnnual={isAnnual}
          onSelectPlan={(id, price, name) => setCheckoutPlan({ id, price, name })}
        />

        {/* Full Feature Comparison Grid */}
        <ComparisonTable />

        {/* Accordions FAQ Panel */}
        <FAQAccordion />

        {/* Bottom CTA conversions box */}
        <PricingCTABanner />
      </div>

      {/* Stripe Billing Modal */}
      {checkoutPlan && user && (
        <StripeCheckoutModal
          isOpen={checkoutPlan !== null}
          onClose={() => setCheckoutPlan(null)}
          planId={checkoutPlan.id}
          planName={checkoutPlan.name}
          planPrice={checkoutPlan.price}
          userEmail={user.email}
          onSuccess={(tier) => {
            setTier(tier);
          }}
        />
      )}
    </div>
  );
}

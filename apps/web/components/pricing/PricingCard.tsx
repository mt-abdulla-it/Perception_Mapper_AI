import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Layers, Zap, Check, Minus } from 'lucide-react';
import { PricingPlan } from './pricingData';
import { useAuth } from '../../hooks/useAuth';

interface PricingCardProps {
  plan: PricingPlan;
  isAnnual: boolean;
  onSelectPlan?: (planId: 'free' | 'basic' | 'pro', price: number, name: string) => void;
}

const iconMap = {
  Sparkles: <Sparkles className="h-5 w-5 text-indigo-400" />,
  Layers: <Layers className="h-5 w-5 text-blue-400" />,
  Zap: <Zap className="h-5 w-5 text-emerald-400" />,
};

export default function PricingCard({ plan, isAnnual, onSelectPlan }: PricingCardProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const currentPrice = isAnnual ? plan.priceAnnually : plan.priceMonthly;
  const planIcon = iconMap[plan.iconName] || <Sparkles className="h-5 w-5 text-slate-400" />;

  // Display only top core features inside the card checklist
  const displayFeaturesList = [
    { key: 'languages', label: plan.features.languages },
    { key: 'analyses', label: plan.features.analyses },
    { key: 'cognitiveBiases', label: plan.features.cognitiveBiases },
    { key: 'rephrasing', label: 'Objective rephrasing' },
    { key: 'apiKey', label: 'Developer API Console' },
    { key: 'workspace', label: 'Team workspace support' },
  ];

  const handleAction = () => {
    if (!isSignedIn) {
      router.push(`/sign-up?plan=${plan.id}`);
      return;
    }

    if (plan.id === 'free') {
      router.push('/dashboard');
      return;
    }

    if (onSelectPlan) {
      onSelectPlan(plan.id, currentPrice, plan.name);
    }
  };

  return (
    <div
      className={`relative rounded-3xl border p-6 flex flex-col justify-between glass-card transition-all duration-300 hover:scale-[1.02] shadow-xl ${
        plan.badge
          ? 'border-blue-500/60 ring-1 ring-blue-500/30 bg-slate-900/60'
          : 'border-slate-800/80 bg-slate-900/40'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[9px] font-bold text-white bg-blue-600 border border-blue-500 rounded-full uppercase tracking-widest shadow-md">
          {plan.badge}
        </span>
      )}

      <div className="space-y-5">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            {planIcon}
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">{plan.name}</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{plan.id === 'pro' ? 'Enterprise workspace' : 'Individual tier'}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-medium leading-relaxed min-h-[36px]">
          {plan.description}
        </p>

        <div className="pt-2 flex items-baseline space-x-1 select-none">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            ${currentPrice}
          </span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            / mo
          </span>
          {isAnnual && currentPrice > 0 && (
            <span className="text-[9px] text-slate-400 ml-2 font-semibold">
              (billed annually)
            </span>
          )}
        </div>

        <div className="w-full h-px bg-slate-800/60" />

        <ul className="space-y-3.5 text-xs text-slate-300 font-medium py-2">
          {displayFeaturesList.map((f, idx) => {
            const hasFeature = plan.features[f.key];
            const isTextVal = typeof hasFeature === 'string';

            return (
              <li key={idx} className="flex items-start space-x-2.5">
                {hasFeature ? (
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <Minus className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <span className={hasFeature ? 'text-slate-200' : 'text-slate-500 line-through'}>
                  {isTextVal ? (
                    <span className="font-bold text-slate-100">{f.label}</span>
                  ) : (
                    f.label
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pt-6">
        <button
          type="button"
          onClick={handleAction}
          className={`block w-full text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md border ${
            plan.id === 'basic'
              ? 'bg-blue-600 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-400'
              : plan.id === 'pro'
              ? 'bg-emerald-600 hover:bg-emerald-600 text-white border-emerald-500 hover:border-emerald-400'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
          }`}
          aria-label={`${plan.ctaLabel} subscription plan`}
        >
          {plan.ctaLabel}
        </button>
      </div>
    </div>
  );
}

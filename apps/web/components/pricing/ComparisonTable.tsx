import React from 'react';
import { Check, Minus } from 'lucide-react';
import { featureDefinitions, pricingPlans } from './pricingData';

export default function ComparisonTable() {
  const categories = [
    'Linguistic Scopes',
    'Capabilities',
    'Integrations & Telemetry',
  ];

  return (
    <section className="space-y-6 pt-12 select-none max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
          Compare All Features
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-lg mx-auto">
          Get a complete side-by-side functional breakdown of our sentiment, tone, and cognitive bias analyzer tiers.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-2xl">
        <table className="w-full text-xs text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/75 sticky top-0 backdrop-blur-lg z-10">
              <th className="py-4 px-6 font-bold text-slate-300 uppercase tracking-widest text-[9px] w-2/5">
                Features
              </th>
              {pricingPlans.map((p) => (
                <th
                  key={p.id}
                  className="py-4 px-6 font-bold text-center uppercase tracking-widest text-[9px] w-1/5"
                >
                  <span className={`px-2 py-0.5 rounded border ${
                    p.id === 'basic'
                      ? 'border-blue-500/30 text-blue-400 bg-blue-950/20'
                      : p.id === 'pro'
                      ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
                      : 'border-slate-800 text-slate-400 bg-slate-900'
                  }`}>
                    {p.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {categories.map((category) => (
              <React.Fragment key={category}>
                {/* Category Header Row */}
                <tr className="bg-slate-950/30">
                  <td
                    colSpan={4}
                    className="py-3 px-6 font-bold text-[9px] text-indigo-400 uppercase tracking-widest"
                  >
                    {category}
                  </td>
                </tr>

                {/* Feature Rows */}
                {featureDefinitions
                  .filter((f) => f.category === category)
                  .map((f, idx) => (
                    <tr
                      key={f.key}
                      className={`hover:bg-slate-800/20 transition-all duration-200 ${
                        idx % 2 === 0 ? 'bg-slate-900/10' : 'bg-transparent'
                      }`}
                    >
                      <td className="py-3.5 px-6 font-semibold text-slate-300">
                        {f.label}
                      </td>
                      {pricingPlans.map((p) => {
                        const val = p.features[f.key];
                        const isText = typeof val === 'string';

                        return (
                          <td
                            key={p.id}
                            className="py-3.5 px-6 text-center text-slate-200 font-medium"
                          >
                            {isText ? (
                              <span className="font-bold text-slate-100">{val}</span>
                            ) : val === true ? (
                              <div className="flex justify-center">
                                <Check className="h-4.5 w-4.5 text-emerald-400" />
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <Minus className="h-4.5 w-4.5 text-slate-650" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

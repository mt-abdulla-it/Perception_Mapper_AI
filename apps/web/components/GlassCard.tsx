import React from 'react';

export const GlassCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-white/10 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-xl p-6 max-w-md w-full mx-auto">
      {children}
    </div>
  );
};

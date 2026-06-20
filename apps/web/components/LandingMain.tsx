"use client";

import React from "react";

interface LandingMainProps {
  children: React.ReactNode;
}

export default function LandingMain({ children }: LandingMainProps) {
  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-24 space-y-20 relative z-10">
      {children}
    </main>
  );
}

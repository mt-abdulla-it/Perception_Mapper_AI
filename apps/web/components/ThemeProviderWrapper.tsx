// apps/web/components/ThemeProviderWrapper.tsx
"use client";

import { ThemeProvider } from "next-themes";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ThemeProviderWrapper({ children }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
}

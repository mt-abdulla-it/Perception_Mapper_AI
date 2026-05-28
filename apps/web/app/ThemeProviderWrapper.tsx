"use client";

import { ThemeProvider } from "next-themes";

// Wrapper that applies the theme provider.
// We rely on suppressHydrationWarning on the <html> tag (in root layout)
// instead of returning null during SSR, which caused a flash of blank content.
export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

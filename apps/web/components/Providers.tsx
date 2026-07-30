"use client";

import { ClerkProvider } from "../app/clerk-compat";
import { I18nProvider } from "../hooks/useTranslation";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder")
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : "pk_test_ZGV2ZWxvcG1lbnQtc3VwcG9ydC05OS5jbGVyay5hY2NvdW50cy5kZXYk";

  return (
    <I18nProvider>
      <ClerkProvider publishableKey={clerkKey}>
        {children}
      </ClerkProvider>
    </I18nProvider>
  );
}

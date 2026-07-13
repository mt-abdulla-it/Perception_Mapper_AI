import './globals.css';
import React from 'react';
import { Outfit } from "next/font/google";
import dynamic from "next/dynamic";

const Providers = dynamic(() => import("../components/Providers"), {
  ssr: false,
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Perception Mapper AI",
  description: "Linguistic sentiment, tone, and cognitive bias analyzer for digital channels.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.className} dark`} suppressHydrationWarning>
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

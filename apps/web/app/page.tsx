"use client";

import LandingLayout from "../components/LandingLayout";
import LandingRedirect from "../components/LandingRedirect";
import Navbar from "../components/Navbar";
import LandingMain from "../components/LandingMain";
import LandingHero from "../components/LandingHero";
import LandingStats from "../components/LandingStats";
import LandingFeatures from "../components/LandingFeatures";
import LandingHowItWorks from "../components/LandingHowItWorks";
import LandingShowcase from "../components/LandingShowcase";
import LandingPlayground from "../components/LandingPlayground";
import LandingTestimonials from "../components/LandingTestimonials";
import LandingPricing from "../components/LandingPricing";
import LandingCTA from "../components/LandingCTA";
import Footer from "../components/Footer";

export default function PerceptionLanding() {
  return (
    <LandingLayout>
      <LandingRedirect />
      <Navbar />
      <LandingMain>
        <LandingHero />
        <LandingStats />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingShowcase />
        <LandingPlayground />
        <LandingTestimonials />
        <LandingPricing />
        <LandingCTA />
      </LandingMain>
      <Footer />
    </LandingLayout>
  );
}

export const dynamic = "force-dynamic";

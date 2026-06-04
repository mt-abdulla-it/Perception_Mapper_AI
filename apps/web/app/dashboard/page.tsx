"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useDashboard } from "../../hooks/useDashboard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Preloader from "../../components/Preloader";
import BasicDashboard from "../../components/dashboard/BasicDashboard";
import ProDashboard from "../../components/dashboard/ProDashboard";
import EnterpriseDashboard from "../../components/dashboard/EnterpriseDashboard";
import StripeCheckoutModal from "../../components/pricing/StripeCheckoutModal";
import { SubscriptionTier } from "../../lib/auth";
import BiasNetworkGraph from "../../components/dashboard/BiasNetworkGraph";
import BatchProcessor from "../../components/dashboard/BatchProcessor";
import SentimentMetricsDashboard from "../../components/dashboard/SentimentMetricsDashboard";
import PromptSandbox from "../../components/dashboard/PromptSandbox";
import RephraseSandbox from "../../components/dashboard/RephraseSandbox";

export default function UserDashboard() {
  const router = useRouter();
  const { isSignedIn, user, mounted, setTier } = useAuth();
  const db = useDashboard();
  const [checkoutPlan, setCheckoutPlan] = useState<{ id: 'free' | 'basic' | 'pro'; price: number; name: string } | null>(null);
  const [rephraseQuote, setRephraseQuote] = useState<string | null>(null);

  useEffect(() => {
    if (mounted && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [mounted, isSignedIn, router]);

  if (!mounted || !isSignedIn || !user) {
    return <Preloader message="AUTHORIZING USER WORKSPACE..." />;
  }

  const handleUpgradeRequest = (targetTier: SubscriptionTier) => {
    if (targetTier === "FREE") {
      setTier("FREE");
      return;
    }
    const name = targetTier === "BASIC" ? "Basic Plan" : "Pro Plan";
    const price = targetTier === "BASIC" ? 19 : 59;
    setCheckoutPlan({ id: targetTier.toLowerCase() as any, price, name });
  };

  const renderDashboardContent = () => {
    switch (user.tier) {
      case "FREE":
        return <BasicDashboard db={db} onUpgrade={handleUpgradeRequest} onExploreRephrase={setRephraseQuote} />;
      case "BASIC":
        return <ProDashboard db={db} onUpgrade={handleUpgradeRequest} onExploreRephrase={setRephraseQuote} />;
      case "PRO":
        return <EnterpriseDashboard db={db} onExploreRephrase={setRephraseQuote} />;
      default:
        return <BasicDashboard db={db} onUpgrade={handleUpgradeRequest} onExploreRephrase={setRephraseQuote} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-25%] w-[80%] h-[80%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />
      <Navbar />

      <main className="flex-grow w-full max-w-[1600px] mx-auto px-6 py-24 space-y-8 relative z-10">
        <div className="flex items-center justify-between p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Security Session Context: <span className="text-indigo-400">USER WORKSPACE ACTIVE</span>
            </p>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">Node cluster: 200 OK</span>
        </div>


        <div id="workspace" className="space-y-8">
          {renderDashboardContent()}
        </div>
        <BatchProcessor />
        <BiasNetworkGraph 
          analysisResult={db.analysisResult}
          onApplyRephrase={(quote, rephrasedText) => {
            const cleanText = db.inputText.replace(quote, rephrasedText);
            db.setInputText(cleanText);
            db.appendTerminalLog(`💡 Applied Graph Rephrase: "${rephrasedText}"`);
            db.triggerAnalysis(cleanText);
          }}
        />
        <div id="telemetry">
          <SentimentMetricsDashboard />
        </div>
        <PromptSandbox />
      </main>

      <Footer />

      {/* Stripe Billing Modal */}
      {checkoutPlan && (
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

      {/* AI Rephrase Modal Sandbox */}
      {rephraseQuote && (
        <RephraseSandbox
          isOpen={rephraseQuote !== null}
          onClose={() => setRephraseQuote(null)}
          quote={rephraseQuote}
          language={db.selectedLanguage}
          onSelectRephrase={(rephrasedText) => {
            const cleanText = db.inputText.replace(rephraseQuote, rephrasedText);
            db.setInputText(cleanText);
            db.appendTerminalLog(`💡 Applied AI rephrased alternative: "${rephrasedText}"`);
            db.triggerAnalysis(cleanText);
          }}
        />
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useHistory } from "../../../hooks/useHistory";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Preloader from "../../../components/Preloader";
import HistoryTimeline from "../../../components/dashboard/HistoryTimeline";

export default function HistoryPage() {
  const router = useRouter();
  const { isSignedIn, user, mounted } = useAuth();
  const history = useHistory();

  React.useEffect(() => {
    if (mounted && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [mounted, isSignedIn, router]);

  if (!mounted || !isSignedIn || !user) {
    return <Preloader message="LOADING ANALYSIS TIMELINE..." />;
  }

  const handleReanalyze = (text: string) => {
    // Store text in sessionStorage so the dashboard can pick it up
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pm_reanalyze_text", text);
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Ambient Background Orbs */}
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-25%] w-[80%] h-[80%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      <Navbar />

      <main className="flex-grow w-full max-w-[1600px] mx-auto px-6 py-24 space-y-8 relative z-10">
        {/* Session Context Bar */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-purple-500/20 bg-purple-950/20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Timeline Context: <span className="text-purple-400">ANALYSIS HISTORY FEED</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">
              {history.total} records indexed
            </span>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Timeline Component */}
        <HistoryTimeline
          entries={history.entries}
          stats={history.stats}
          loading={history.loading}
          statsLoading={history.statsLoading}
          error={history.error}
          page={history.page}
          totalPages={history.totalPages}
          total={history.total}
          hasNext={history.hasNext}
          hasPrev={history.hasPrev}
          filters={history.filters}
          onApplyFilters={history.applyFilters}
          onNextPage={history.nextPage}
          onPrevPage={history.prevPage}
          onGoToPage={history.goToPage}
          onDelete={history.deleteEntry}
          onExport={history.exportCSV}
          onReanalyze={handleReanalyze}
        />
      </main>

      <Footer />
    </div>
  );
}

export const dynamic = "force-dynamic";

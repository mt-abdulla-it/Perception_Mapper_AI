"use client";

import React, { useEffect, useState, createContext, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { ShieldAlert, Users, Sliders, Cpu, ArrowLeft, LogOut, Lock } from "lucide-react";
import Preloader from "../../components/Preloader";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export const AdminTabContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({
  activeTab: "dashboard",
  setActiveTab: () => {},
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, user, signOut, mounted } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("dashboard");

  const isLoginPage = pathname.endsWith("/admin/sign-in");

  useEffect(() => {
    if (mounted && !isLoginPage) {
      const signedIn = localStorage.getItem("pm_mock_signed_in") === "true";
      const storedRole = localStorage.getItem("pm_mock_user_rbac_role");
      const isAdminSession = localStorage.getItem("pm_mock_admin_session") === "true";

      if (!signedIn || storedRole !== "ADMIN" || !isAdminSession) {
        router.replace("/admin/sign-in");
      }
    }
  }, [mounted, isLoginPage, router]);

  const handleSignOut = useCallback(() => {
    signOut();
    router.push("/admin/sign-in");
  }, [signOut, router]);

  if (!mounted) return <Preloader message="AUTHORIZING SYSTEM SECURITY..." />;
  if (isLoginPage) return <>{children}</>;

  if (isSignedIn && user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-8 text-center font-sans">
        <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-2xl max-w-md w-full space-y-6">
          <Lock className="h-10 w-10 text-rose-500 mx-auto animate-bounce" />
          <h2 className="text-lg font-bold text-white">403: Forbidden</h2>
          <p className="text-xs text-slate-400">Your profile does not possess admin privileges.</p>
          <button onClick={() => router.push("/")} className="w-full py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard Telemetry", icon: <Cpu className="h-4 w-4" /> },
    { id: "users", label: "Users Manager", icon: <Users className="h-4 w-4" /> },
    { id: "policies", label: "AI Engine Policies", icon: <Sliders className="h-4 w-4" /> }
  ];

  return (
    <AdminTabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
        <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col shrink-0 relative overflow-hidden">
          <div className="p-6 border-b border-slate-900/60 flex items-center space-x-3.5 z-10 select-none">
            <ShieldAlert className="h-5 w-5 text-purple-400" />
            <div>
              <h1 className="text-xs font-extrabold text-white">Perception Admin</h1>
              <span className="text-[8px] text-purple-400 font-bold uppercase tracking-wider">Control Panel v1.0</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 z-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition duration-200 text-xs font-bold uppercase tracking-wide ${activeTab === tab.id ? "bg-slate-900/60 text-indigo-400 border border-slate-800/40" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-900 space-y-3 z-10">
            <button onClick={() => router.push("/dashboard")} className="w-full flex items-center justify-center space-x-2 py-2 border border-slate-800 bg-slate-900/20 text-slate-400 hover:text-slate-200 rounded-xl text-[9px] font-bold uppercase transition">
              <ArrowLeft className="h-3 w-3 shrink-0" />
              <span>Go to User App</span>
            </button>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-900">
              <span className="text-[10px] font-bold text-white truncate max-w-[120px]">{user?.name}</span>
              <button onClick={handleSignOut} className="p-1 text-slate-500 hover:text-rose-400 rounded transition shrink-0" title="Terminate session">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
          <header className="h-16 border-b border-slate-900/60 px-6 sm:px-8 flex items-center justify-between z-10 shrink-0 select-none">
            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Admin Panel / {activeTab}</span>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[9px] font-bold text-purple-400 bg-purple-950/40 border border-purple-500/20 rounded-md uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>Secure Shell Active</span>
              </span>
            </div>
          </header>
          <main className="flex-1 p-6 sm:p-8 z-10 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </AdminTabContext.Provider>
  );
}

export const dynamic = "force-dynamic";

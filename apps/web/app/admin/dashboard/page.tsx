"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import { AdminTabContext } from "../layout";
import { useAuth } from "../../../hooks/useAuth";
import { UserProfile, PolicySettings, GlobalStats, AuditLog } from "../../../types";
import { fetchUsers, fetchGlobalAnalytics, fetchPolicies, updatePolicies, updateUserProfile, deleteUserProfile, fetchAuditLogs } from "../../../lib/api";
import Preloader from "../../../components/Preloader";
import AdminStats from "../../../components/admin/AdminStats";
import AdminUsersList from "../../../components/admin/AdminUsersList";
import AdminPoliciesForm from "../../../components/admin/AdminPoliciesForm";
import AdminAuditLogsList from "../../../components/admin/AdminAuditLogsList";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import TeamWorkspace from "../../../components/admin/team/TeamWorkspace";

export default function AdminDashboard() {
  const { activeTab } = useContext(AdminTabContext);
  const { user } = useAuth();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<GlobalStats>({ totalUsers: 0, activeUsers: 0, blockedUsers: 0, monthlyRevenue: 0, totalAnalyses: 0, reliabilityPercent: 99.9 });
  const [policies, setPolicies] = useState<PolicySettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string; confirmText: string; isDestructive: boolean; onConfirm: () => void } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const role = user?.role || "ADMIN";
      const [u, s, p, a] = await Promise.all([fetchUsers(role), fetchGlobalAnalytics(role), fetchPolicies(role), fetchAuditLogs(role)]);
      setUsers(u);
      setStats(s);
      setPolicies(p);
      setAuditLogs(a);
    } catch (err) {
      console.error("Failed to fetch administrative payloads:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData, activeTab]);

  const handleUpdateUserProfile = useCallback(async (id: string, payload: any) => {
    setActionLoading(id);
    try {
      await updateUserProfile(id, payload, user?.role || "ADMIN");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }, [user, loadData]);

  const handleExportCsv = useCallback(() => {
    let csv = "Log ID,Activity,Details,Latency,Tokens\n";
    auditLogs.forEach((l) => { csv += `${l.id},${l.activity},"${l.details?.replace(/"/g, '""') || ""}",${l.latencyMs},${l.tokensCount}\n`; });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8," });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `perception_mapper_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [auditLogs]);

  if (isLoading && users.length === 0) return <Preloader message="SYNCING SECURITY TELEMETRY DATA..." />;

  return (
    <div className="space-y-6">
      {modal && <ConfirmModal {...modal} onClose={() => setModal(null)} />}

      {activeTab === "dashboard" && ((user?.role as any) === "ADMIN" || (user?.role as any) === "SUPER_ADMIN") && (<>
        <AdminStats stats={stats} isLoading={isLoading} />
        <TeamWorkspace />
      </>)}
      {activeTab === "dashboard" && !((user?.role as any) === "ADMIN" || (user?.role as any) === "SUPER_ADMIN") && (
        <p className="text-slate-400">Access denied: insufficient permissions.</p>
      )}

      {activeTab === "users" && (
        <AdminUsersList
          users={users} isLoading={isLoading} actionLoading={actionLoading}
          onRefresh={loadData}
          onToggleBlock={(u) => setModal({ isOpen: true, title: u.isBlocked ? "Reactivate User Account" : "Block User Account", message: `Change block status for user ${u.email}?`, confirmText: "Confirm", isDestructive: !u.isBlocked, onConfirm: () => handleUpdateUserProfile(u.id, { status: u.isBlocked ? "ACTIVE" : "BLOCKED" }) })}
          onToggleRole={(u) => setModal({ isOpen: true, title: "Modify Access Level Role", message: `Change user role for ${u.email} to ${u.role === "ADMIN" ? "USER" : "ADMIN"}?`, confirmText: "Change Role", isDestructive: u.role === "ADMIN", onConfirm: () => handleUpdateUserProfile(u.id, { role: u.role === "ADMIN" ? "USER" : "ADMIN" }) })}
          onUpdatePlan={(id, email, plan) => setModal({ isOpen: true, title: "Modify Subscription plan", message: `Update plan tier for ${email} to ${plan}?`, confirmText: "Change Plan", isDestructive: false, onConfirm: () => handleUpdateUserProfile(id, { plan }) })}
          onDelete={(id, email) => setModal({ isOpen: true, title: "Purge Account Permanently", message: `Irreversibly delete profile ${email}?`, confirmText: "Purge", isDestructive: true, onConfirm: async () => { setActionLoading(id); try { await deleteUserProfile(id, user?.role || "ADMIN"); await loadData(); } catch (err) { console.error(err); } finally { setActionLoading(null); } } })}
        />
      )}

      {activeTab === "policies" && policies && (
        <AdminPoliciesForm
          policies={policies} isLoading={isLoading}
          onSave={async (updated) => { setIsLoading(true); try { await updatePolicies(updated, user?.role || "ADMIN"); await loadData(); } catch (err) { console.error(err); } finally { setIsLoading(false); } }}
        />
      )}

      {activeTab === "logs" && <AdminAuditLogsList logs={auditLogs} onExport={handleExportCsv} />}
    </div>
  );
}

export const dynamic = "force-dynamic";

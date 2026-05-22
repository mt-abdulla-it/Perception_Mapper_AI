import { UserProfile, GlobalStats, PolicySettings, AuditLog, WorkspaceTeam } from "../types";

const BASE_URL = "http://localhost:3001/api";

const getHeaders = (role = "ADMIN") => ({
  "Content-Type": "application/json",
  "x-mock-role": role,
  "Authorization": "Bearer mock_oauth_astraea_vance",
});

export const fetchUsers = async (role = "ADMIN"): Promise<UserProfile[]> => {
  const res = await fetch(`${BASE_URL}/users`, { headers: getHeaders(role) });
  if (!res.ok) throw new Error("Could not sync users database catalog");
  return res.json();
};

export const updateUserProfile = async (id: string, payload: any, role = "ADMIN") => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: getHeaders(role),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Could not update target user status");
  return res.json();
};

export const deleteUserProfile = async (id: string, role = "ADMIN") => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(role),
  });
  if (!res.ok) throw new Error("Could not delete user account from systems");
  return res.json();
};

export const fetchGlobalAnalytics = async (role = "ADMIN"): Promise<GlobalStats> => {
  const res = await fetch(`${BASE_URL}/admin/analytics`, { headers: getHeaders(role) });
  if (!res.ok) throw new Error("Could not fetch platform load telemetry");
  return res.json();
};

export const fetchAuditLogs = async (role = "ADMIN"): Promise<AuditLog[]> => {
  const res = await fetch(`${BASE_URL}/admin/audit-logs`, { headers: getHeaders(role) });
  if (!res.ok) throw new Error("Could not retrieve system security feeds");
  return res.json();
};

export const fetchPolicies = async (role = "ADMIN"): Promise<PolicySettings> => {
  const res = await fetch(`${BASE_URL}/admin/policies`, { headers: getHeaders(role) });
  if (!res.ok) throw new Error("Could not retrieve engine safety configuration");
  return res.json();
};

export const updatePolicies = async (payload: PolicySettings, role = "ADMIN") => {
  const res = await fetch(`${BASE_URL}/admin/policies`, {
    method: "POST",
    headers: getHeaders(role),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Could not sync policy controls");
  return res.json();
};

export const fetchAIRephrasings = async (text: string, language = "en", apiKey?: string) => {
  const res = await fetch(`${BASE_URL}/analyze/rephrase`, {
    method: "POST",
    headers: getHeaders("ADMIN"),
    body: JSON.stringify({ text, language, apiKey }),
  });
  if (!res.ok) throw new Error("Could not fetch AI rephrase suggestions");
  return res.json();
};

export const fetchAdminTeams = async (role = "ADMIN"): Promise<WorkspaceTeam[]> => {
  const res = await fetch(`${BASE_URL}/admin/teams`, { headers: getHeaders(role) });
  if (!res.ok) throw new Error("Could not retrieve workspace team catalogs");
  return res.json();
};

export const createAdminTeam = async (payload: Partial<WorkspaceTeam>, role = "ADMIN"): Promise<WorkspaceTeam> => {
  const res = await fetch(`${BASE_URL}/admin/teams`, {
    method: "POST",
    headers: getHeaders(role),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Could not create workspace team node");
  return res.json();
};

export const deleteAdminTeam = async (id: string, role = "ADMIN") => {
  const res = await fetch(`${BASE_URL}/admin/teams/${id}`, {
    method: "DELETE",
    headers: getHeaders(role),
  });
  if (!res.ok) throw new Error("Could not purge workspace team node");
  return res.json();
};



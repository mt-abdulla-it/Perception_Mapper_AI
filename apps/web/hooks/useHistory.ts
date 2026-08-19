import { useState, useEffect, useCallback } from "react";
import { HistoryEntry, HistoryStats } from "../types";

export interface HistoryFilters {
  lang: string;
  biasType: string;
  from: string;
  to: string;
  search: string;
}

export const useHistory = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const [filters, setFilters] = useState<HistoryFilters>({
    lang: "all",
    biasType: "all",
    from: "",
    to: "",
    search: "",
  });

  const fetchTimeline = useCallback(async (pageNum: number, currentFilters: HistoryFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pageNum));
      params.set("limit", "15");
      if (currentFilters.lang && currentFilters.lang !== "all") params.set("lang", currentFilters.lang);
      if (currentFilters.biasType && currentFilters.biasType !== "all") params.set("biasType", currentFilters.biasType);
      if (currentFilters.from) params.set("from", currentFilters.from);
      if (currentFilters.to) params.set("to", currentFilters.to);
      if (currentFilters.search) params.set("search", currentFilters.search);

      const response = await fetch(`/api/history/timeline?${params.toString()}`);
      if (!response.ok) throw new Error(`API returned status ${response.status}`);

      const data = await response.json();
      setEntries(data.entries || []);
      setPage(data.pagination?.page || 1);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
      setHasNext(data.pagination?.hasNext || false);
      setHasPrev(data.pagination?.hasPrev || false);
    } catch (err: any) {
      setError(err.message || "Failed to load history");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await fetch("/api/history/stats");
      if (!response.ok) throw new Error(`API returned status ${response.status}`);
      const data = await response.json();
      setStats({
        totalAnalyses: data.totalAnalyses || 0,
        avgBiasIndex: data.avgBiasIndex || 0,
        topBiasType: data.topBiasType || "None",
        topBiasCount: data.topBiasCount || 0,
        languageDistribution: data.languageDistribution || [],
      });
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTimeline(1, filters);
    fetchStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch when filters change
  const applyFilters = useCallback((newFilters: HistoryFilters) => {
    setFilters(newFilters);
    setPage(1);
    fetchTimeline(1, newFilters);
  }, [fetchTimeline]);

  const goToPage = useCallback((pageNum: number) => {
    setPage(pageNum);
    fetchTimeline(pageNum, filters);
  }, [fetchTimeline, filters]);

  const nextPage = useCallback(() => {
    if (hasNext) goToPage(page + 1);
  }, [hasNext, page, goToPage]);

  const prevPage = useCallback(() => {
    if (hasPrev) goToPage(page - 1);
  }, [hasPrev, page, goToPage]);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      // Remove from local state immediately
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      // Refresh stats
      fetchStats();
      return true;
    } catch {
      return false;
    }
  }, [fetchStats]);

  const exportCSV = useCallback(() => {
    if (entries.length === 0) return;

    const headers = ["Date", "Language", "Text Preview", "Sentiment", "Bias Index", "Objectivity", "Bias Types", "Tones"];
    const rows = entries.map((e) => [
      new Date(e.createdAt).toLocaleString(),
      e.detectedLanguage,
      `"${e.inputText.slice(0, 100).replace(/"/g, '""')}"`,
      String(e.sentimentScore),
      String(e.biasIndex),
      String(e.objectivity),
      `"${e.biases.map((b) => b.type).join(", ")}"`,
      `"${e.tones.map((t) => `${t.name}:${t.score}`).join(", ")}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `perception_mapper_history_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [entries]);

  const refresh = useCallback(() => {
    fetchTimeline(page, filters);
    fetchStats();
  }, [page, filters, fetchTimeline, fetchStats]);

  return {
    entries,
    stats,
    loading,
    statsLoading,
    error,
    page,
    totalPages,
    total,
    hasNext,
    hasPrev,
    filters,
    applyFilters,
    goToPage,
    nextPage,
    prevPage,
    deleteEntry,
    exportCSV,
    refresh,
  };
};

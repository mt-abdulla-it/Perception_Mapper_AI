// TeamStats component – displays overview cards
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle, Clock, BarChart2 } from "lucide-react";
import { useTranslation } from "../../../hooks/useTranslation";

interface StatsData {
  totalTeams: number;
  activeMembers: number;
  pendingInvites: number;
  activity: number;
}

interface TeamStatsProps {
  refreshKey?: number;
  stats?: StatsData;
}

export default function TeamStats({ refreshKey = 0, stats: initialStats }: TeamStatsProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<StatsData>(
    initialStats || {
      totalTeams: 0,
      activeMembers: 0,
      pendingInvites: 0,
      activity: 0,
    }
  );

  useEffect(() => {
    if (initialStats) {
      setStats(initialStats);
      return;
    }
    // Fetch the teams and calculate counters
    fetch("/api/admin/teams")
      .then((r) => r.json())
      .then((teams) => {
        const totalTeams = teams.length;
        const activeMembers = teams.reduce((c, t) => c + (t.members?.length || 0), 0);
        // placeholders for pending invites and activity
        const pendingInvites = 0;
        const activity = 0;
        setStats({ totalTeams, activeMembers, pendingInvites, activity });
      })
      .catch(() => console.error("Failed to load team stats"));
  }, [refreshKey, initialStats]);

  const cards = [
    { title: t("team.stats.total"), value: stats.totalTeams, icon: <Users className="h-5 w-5 text-indigo-400" /> },
    { title: t("team.stats.active"), value: stats.activeMembers, icon: <CheckCircle className="h-5 w-5 text-green-400" /> },
    { title: t("team.stats.pending"), value: stats.pendingInvites, icon: <Clock className="h-5 w-5 text-yellow-400" /> },
    { title: t("team.stats.activity"), value: stats.activity, icon: <BarChart2 className="h-5 w-5 text-pink-400" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <motion.div
          key={c.title}
          className="glass-card p-4 rounded-xl flex flex-col items-center"
          whileHover={{ scale: 1.03 }}
        >
          {c.icon}
          <h4 className="text-xs font-medium text-slate-400 mt-2">{c.title}</h4>
          <p className="text-lg font-bold text-slate-200 mt-1">{c.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

// TeamTable component – shows teams list with actions
"use client";
import { useEffect, useState } from "react";
import { Card, Button } from "@perception-mapper/ui";
import { Edit, Trash2, Users as UsersIcon, PauseCircle } from "lucide-react";
import { useTranslation } from "../../../hooks/useTranslation";

interface Team {
  id: string;
  name: string;
  leadEmail?: string;
  members?: any[];
  tier: string;
  status: string;
  createdAt: string;
}

interface TeamTableProps {
  refreshKey?: number;
  onTeamDeleted?: () => void;
}

export default function TeamTable({ refreshKey = 0, onTeamDeleted }: TeamTableProps) {
  const { t } = useTranslation();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/teams")
      .then((r) => r.json())
      .then((data) => {
        setTeams(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    if (confirm(t("team.table.deleteConfirm"))) {
      await fetch(`/api/admin/teams/${id}`, { method: "DELETE" });
      setTeams((t) => t.filter((x) => x.id !== id));
      onTeamDeleted?.();
    }
  };

  if (loading) return <p className="text-slate-400">Loading teams…</p>;

  return (
    <Card className="glassmorphism">
      <h3 className="text-sm font-semibold text-slate-200 mb-3">{t("team.title")}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-slate-500 uppercase text-[8px] font-bold">
            <tr>
              <th className="pb-2">{t("team.table.name")}</th>
              <th className="pb-2">{t("team.table.lead")}</th>
              <th className="pb-2">{t("team.table.members")}</th>
              <th className="pb-2">{t("team.table.tier")}</th>
              <th className="pb-2">{t("team.table.status")}</th>
              <th className="pb-2">{t("team.table.created")}</th>
              <th className="pb-2 text-right">{t("team.table.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {teams.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/30 transition">
                <td className="py-2 font-medium text-slate-300">{t.name}</td>
                <td className="py-2">{t.leadEmail || "—"}</td>
                <td className="py-2 text-center">{t.members?.length ?? 0}</td>
                <td className="py-2">{t.tier}</td>
                <td className="py-2">{t.status}</td>
                <td className="py-2">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 text-right space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => {/* edit modal */}} aria-label="Edit team">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(t.id)} aria-label="Delete team">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => {/* view members */}} aria-label="View team members">
                    <UsersIcon className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => {/* suspend */}} aria-label="Suspend team">
                    <PauseCircle className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

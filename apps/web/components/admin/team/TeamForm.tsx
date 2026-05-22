import { useState, useEffect } from "react";
import { Card, Button, Input } from "@perception-mapper/ui";
import { useTranslation } from "../../../hooks/useTranslation";
import { fetchUsers, createAdminTeam } from "../../../lib/api";

interface TeamFormProps {
  onTeamCreated?: () => void;
}

export default function TeamForm({ onTeamCreated }: TeamFormProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    description: "",
    leadId: "",
    tier: "FREE",
    maxMembers: 5,
    status: "ACTIVE",
  });
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // fetch available users for lead selector using standardized api helper
    fetchUsers()
      .then((res) => {
        // Map user profiles to selector schema
        setUsers(res.map(u => ({ id: u.id, email: u.email })));
      })
      .catch(() => console.error("Failed to load admin users"));
  }, []);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createAdminTeam(form);
      
      // Refresh parent sibling list & stats
      onTeamCreated?.();

      // Show success feedback
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setForm({
        name: "",
        description: "",
        leadId: "",
        tier: "FREE",
        maxMembers: 5,
        status: "ACTIVE",
      });
    } catch (err) {
      console.error("Failed to create team:", err);
    }
  };

  const selectClassName = "w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 outline-none transition focus:ring-4 focus:ring-indigo-500/10 cursor-pointer font-sans appearance-none";

  return (
    <Card className="glassmorphism p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-200">{t("team.form.create")}</h3>
      {success && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold text-center animate-in fade-in duration-300">
          Team created successfully! Workspace node initialized.
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4.5">
        <Input name="name" placeholder={t("team.form.namePlaceholder")} value={form.name} onChange={handleChange} required className="text-xs" />
        <Input name="description" placeholder={t("team.form.descPlaceholder")} value={form.description} onChange={handleChange} className="text-xs" />
        
        <div className="relative">
          <select
            name="leadId"
            value={form.leadId}
            onChange={handleChange}
            className={selectClassName}
          >
            <option value="" className="bg-slate-950 text-slate-400">{t("team.form.leadPlaceholder")}</option>
            {users.map((u) => (
              <option key={u.id} value={u.id} className="bg-slate-950 text-slate-350">
                {u.email}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <select
            name="tier"
            value={form.tier}
            onChange={handleChange}
            className={selectClassName}
          >
            <option value="FREE" className="bg-slate-950 text-slate-350">FREE</option>
            <option value="PRO" className="bg-slate-950 text-slate-350">PRO</option>
            <option value="ENTERPRISE" className="bg-slate-950 text-slate-350">ENTERPRISE</option>
          </select>
        </div>

        <Input name="maxMembers" type="number" min={1} placeholder={t("team.form.maxPlaceholder")} value={form.maxMembers} onChange={handleChange} className="text-xs" />
        
        <div className="relative">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={selectClassName}
          >
            <option value="ACTIVE" className="bg-slate-950 text-slate-350">ACTIVE</option>
            <option value="SUSPENDED" className="bg-slate-950 text-slate-350">SUSPENDED</option>
          </select>
        </div>

        <div className="flex space-x-2.5 pt-1.5">
          <Button type="submit" variant="primary" size="sm" className="px-4 py-2 text-xs font-bold font-sans uppercase">
            {t("team.form.submit")}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => setForm({ name: "", description: "", leadId: "", tier: "FREE", maxMembers: 5, status: "ACTIVE" })} className="px-4 py-2 text-xs font-bold font-sans uppercase">
            {t("team.form.reset")}
          </Button>
        </div>
      </form>
    </Card>
  );
}


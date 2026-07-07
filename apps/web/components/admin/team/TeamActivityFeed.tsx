import { useEffect, useState } from "react";
import { useTranslation } from "../../../hooks/useTranslation";

interface Activity {
  timestamp: string;
  message: string;
}

export default function TeamActivityFeed() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Activity[]>([]);

  useEffect(() => {
    const source = new EventSource("/api/admin/teams/activity-stream");

    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as Activity;
        setEvents((prev) => [...prev, data]);
      } catch (err) {
        console.error("Failed to parse activity event", err);
      }
    };

    source.onerror = () => {
      console.error("SSE connection error, closing stream");
      source.close();
    };

    return () => {
      source.close();
    };
  }, []);

  return (
    <div className="glass-card h-full overflow-y-auto p-3">
      <h4 className="text-sm font-medium text-slate-200 mb-2">{t("team.activity.title")}</h4>
      {events.length === 0 ? (
        <p className="text-xs text-slate-500 italic p-2">{t("team.activity.empty")}</p>
      ) : (
        <ul className="space-y-1 text-xs text-slate-300">
          {events.map((a, i) => (
            <li key={i}>
              <span className="font-mono text-slate-500">[{new Date(a.timestamp).toLocaleTimeString()}]</span>{" "}
              {a.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

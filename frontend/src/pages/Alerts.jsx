import { useEffect, useState } from "react";
import { AlertTriangle, AlertCircle, TrendingUp, Cloud, Database } from "lucide-react";
import api from "../api/app";
import { Card, CardBody, Badge } from "../components/Card";

const filters = ["All Alerts", "High Priority", "Moderate", "Low"];
const iconFor = (t) => {
  if (t.includes("Weather")) return Cloud;
  if (t.includes("Data")) return Database;
  if (t.includes("Growth")) return TrendingUp;
  return t.includes("High") ? AlertTriangle : AlertCircle;
};

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("All Alerts");

  useEffect(() => { api.getAlerts().then(setAlerts); }, []);

  const filtered = alerts.filter(a => {
    if (filter === "All Alerts") return true;
    if (filter === "High Priority") return a.severity === "High";
    return a.severity === filter;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl">Alerts & Notifications</h2>
        <p className="text-sm text-muted-foreground">Stay updated with important alerts for your fields</p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
            {f}
          </button>
        ))}
        <select className="ml-auto px-3 py-2 text-sm border border-border rounded-lg bg-card"><option>All Fields</option></select>
      </div>

      <div className="space-y-3">
        {filtered.map(a => {
          const Icon = iconFor(a.title);
          const tone = a.severity === "High" ? "high" : a.severity === "Moderate" ? "moderate" : "low";
          const colors = a.severity === "High" ? "bg-destructive/10 border-destructive/30" : a.severity === "Moderate" ? "bg-warning/10 border-warning/30" : "bg-success/10 border-success/30";
          const iconCol = a.severity === "High" ? "text-destructive" : a.severity === "Moderate" ? "text-amber-600" : "text-success";
          return (
            <div key={a.id} className={`flex gap-4 p-4 rounded-2xl border ${colors}`}>
              <div className={`w-10 h-10 shrink-0 rounded-xl bg-card grid place-items-center ${iconCol}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{a.title}</p>
                  <Badge tone={tone}>{a.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Field ID: {a.fieldId ?? "—"} • {a.crop ?? "All fields"}</p>
                <p className="text-sm mt-1">{a.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

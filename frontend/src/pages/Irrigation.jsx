import { useEffect, useState } from "react";
import api from "../api/app";
import { Card, CardBody, Badge } from "../components/Card";
import { toast } from "sonner";
import { Check } from "lucide-react";

export default function Irrigation() {
  const [rows, setRows] = useState([]);
  const [done, setDone] = useState(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("kshetra_irr_done") || "[]"); } catch { return []; }
  });

  useEffect(() => { api.getIrrigationRecommendations().then(setRows); }, []);

  const markDone = async (id) => {
    await api.markIrrigationDone(id);
    setDone(d => d.includes(id) ? d : [...d, id]);
    toast.success(`Field ${id} marked as irrigated`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl">Irrigation Recommendations</h2>
        <p className="text-sm text-muted-foreground">AI based irrigation suggestions for your fields</p>
      </div>

      <Card>
        <CardBody className="pt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                {["Field ID", "Crop", "Stress Level", "Recommendation", "Suggested Date", "Status"].map(h => (
                  <th key={h} className="py-3 px-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const isDone = done.includes(r.fieldId);
                return (
                  <tr key={r.id} className={`border-b border-border last:border-0 ${isDone ? "opacity-60" : ""}`}>
                    <td className="py-3 px-2 font-medium">{r.fieldId}</td>
                    <td className="py-3 px-2">{r.crop}</td>
                    <td className="py-3 px-2"><Badge tone={r.stress === "High" ? "high" : r.stress === "Moderate" ? "moderate" : "low"}>{r.stress}</Badge></td>
                    <td className="py-3 px-2">{r.recommendation}</td>
                    <td className="py-3 px-2 text-muted-foreground">{r.date}</td>
                    <td className="py-3 px-2">
                      {isDone ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-success/15 text-success rounded-md font-medium">
                          <Check className="w-3.5 h-3.5" /> Done
                        </span>
                      ) : (
                        <button onClick={() => markDone(r.fieldId)} className="px-3 py-1.5 text-xs bg-success text-white rounded-md font-medium hover:opacity-90">
                          Mark Done
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Waves, CloudRain, Droplets, Sprout, Download } from "lucide-react";
import { Card, CardHeader, CardBody, Badge } from "../components/Card";
import StatCard from "../components/StatCard";
import SatelliteMap from "../components/SatelliteMap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, CartesianGrid, Cell } from "recharts";
import { toast } from "sonner";

const POLY_KEY = "kshetra_user_fields";
const loadPolys = () => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(POLY_KEY) || "[]"); } catch { return []; }
};

// Crop coefficient (Kc) — FAO-56 indicative values for mid-season
const KC = { Cotton: 1.15, Soybean: 1.10, Wheat: 1.15, Rice: 1.20, Sugarcane: 1.25, Maize: 1.20, Tur: 1.05, Groundnut: 1.05 };

// Generate 8-day (weekly) water balance for a field.
// Methodology: ETc = ETo * Kc.  Deficit = ETc - (Rainfall + Effective Irrigation).
// Numbers are illustrative until the backend supplies real ETo/rainfall.
function buildWeeklyBalance(crop = "Cotton", seed = 1) {
  const kc = KC[crop] ?? 1.0;
  const weeks = ["W-3", "W-2", "W-1", "Current", "W+1", "W+2"];
  const rand = (i) => Math.abs(Math.sin((seed + i) * 9.13)) ;
  return weeks.map((w, i) => {
    const eto = 32 + rand(i) * 18;           // mm / 8 days
    const etc = +(eto * kc).toFixed(1);
    const rain = +(rand(i + 2) * 28).toFixed(1);
    const irrig = i < 3 ? +(rand(i + 5) * 22).toFixed(1) : 0;
    const deficit = +(etc - rain - irrig).toFixed(1);
    return { week: w, ETc: etc, Rainfall: rain, Irrigation: irrig, Deficit: Math.max(0, deficit) };
  });
}

const statusFor = (deficit) =>
  deficit >= 25 ? { label: "Critical", tone: "high",     color: "#ef4444", advice: "Irrigate within 24h (≈ 30–40 mm)" }
  : deficit >= 12 ? { label: "Moderate", tone: "moderate", color: "#f59e0b", advice: "Irrigate within 2–3 days (≈ 20 mm)" }
  : deficit >= 4  ? { label: "Mild",     tone: "low",      color: "#84cc16", advice: "Monitor; light irrigation optional" }
  :                 { label: "Adequate", tone: "low",      color: "#22c55e", advice: "No irrigation needed this week" };

export default function WaterAdvisory() {
  const [polygons, setPolygons] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setPolygons(loadPolys());
    const on = () => setPolygons(loadPolys());
    window.addEventListener("kshetra-fields", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("kshetra-fields", on);
      window.removeEventListener("storage", on);
    };
  }, []);

  // Compute weekly balance + current-week deficit per field
  const fields = useMemo(() => polygons.map((p, i) => {
    const series = buildWeeklyBalance(p.crop, p.id || i + 1);
    const current = series[3];
    const status = statusFor(current.Deficit);
    return { ...p, series, current, status };
  }), [polygons]);

  const selected = fields.find(f => f.id === selectedId) || fields[0];

  // Decorate polygons for the map with status colour
  const mapPolys = fields.map(f => ({ ...f, _statusColor: f.status.color }));

  const summary = {
    total: fields.length,
    critical: fields.filter(f => f.status.label === "Critical").length,
    moderate: fields.filter(f => f.status.label === "Moderate").length,
    adequate: fields.filter(f => f.status.label === "Adequate" || f.status.label === "Mild").length,
  };

  const exportCsv = () => {
    if (!fields.length) return toast.error("No fields to export");
    const rows = [["Field", "Crop", "ETc (mm/8d)", "Rainfall (mm)", "Irrigation (mm)", "Deficit (mm)", "Status", "Advisory"]];
    fields.forEach(f => rows.push([f.name, f.crop, f.current.ETc, f.current.Rainfall, f.current.Irrigation, f.current.Deficit, f.status.label, f.status.advice]));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = `water-advisory-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Advisory exported");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-xl">Water Deficit & Irrigation Advisory</h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Weekly (8-day) crop water demand (ETc = ETo × Kc) balanced against rainfall and applied irrigation.
            Deficit drives the irrigation status map and per-field advisory.
          </p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg text-sm font-medium">
          <Download className="w-4 h-4" /> Export Advisory
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Sprout}   label="Monitored Fields" value={summary.total} tint="info" />
        <StatCard icon={Droplets} label="Critical Deficit"  value={summary.critical} sub="Irrigate now" tint="danger" />
        <StatCard icon={CloudRain}label="Moderate Deficit"  value={summary.moderate} sub="Within 2–3 days" tint="warning" />
        <StatCard icon={Waves}    label="Adequate"          value={summary.adequate} sub="No action" tint="success" />
      </div>

      <Card>
        <CardHeader title="Irrigation Status Map" sub="Polygon colour = current-week irrigation status" />
        <CardBody>
          {fields.length === 0 ? (
            <div className="h-[340px] rounded-xl border border-dashed border-border grid place-items-center text-sm text-muted-foreground text-center px-6">
              No fields yet. Draw your fields in <span className="font-medium text-foreground mx-1">Field Map</span> to generate an advisory.
            </div>
          ) : (
            <SatelliteMap polygons={mapPolys} height={380} />
          )}
        </CardBody>
      </Card>

      {fields.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-2">
            <CardHeader
              title={`Weekly Water Balance — ${selected?.name || "—"}`}
              sub={`Crop: ${selected?.crop || "—"} · Kc ≈ ${KC[selected?.crop] ?? "—"}`}
              action={
                <select
                  value={selected?.id ?? ""}
                  onChange={e => setSelectedId(Number(e.target.value))}
                  className="px-3 py-1.5 text-sm border border-border rounded-md bg-background"
                >
                  {fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              }
            />
            <CardBody>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={selected?.series || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="week" fontSize={12} />
                  <YAxis fontSize={12} label={{ value: "mm / 8d", angle: -90, position: "insideLeft", fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Rainfall" stackId="in" fill="#3b82f6" />
                  <Bar dataKey="Irrigation" stackId="in" fill="#06b6d4" />
                  <Bar dataKey="ETc" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={selected?.series || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="week" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="Deficit" stroke="#ef4444" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Per-Field Advisory" sub="Current 8-day window" />
            <CardBody className="space-y-2 max-h-[520px] overflow-y-auto">
              {fields.map(f => (
                <button key={f.id} onClick={() => setSelectedId(f.id)}
                  className={`w-full text-left p-3 rounded-xl border transition ${selected?.id === f.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.crop} · Deficit {f.current.Deficit} mm</p>
                    </div>
                    <Badge tone={f.status.tone}>{f.status.label}</Badge>
                  </div>
                  <p className="text-xs mt-1.5 text-muted-foreground">{f.status.advice}</p>
                </button>
              ))}
            </CardBody>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader title="Methodology" />
        <CardBody className="text-sm text-muted-foreground space-y-2">
          <p><b className="text-foreground">Crop water demand (ETc)</b> is estimated using the FAO-56 single crop coefficient method: <code className="px-1 bg-muted rounded">ETc = ETo × Kc</code>, where ETo is the reference evapotranspiration for the week and Kc is the crop coefficient for the current growth stage.</p>
          <p><b className="text-foreground">Water deficit</b> for the 8-day window is computed as <code className="px-1 bg-muted rounded">Deficit = ETc − (Effective Rainfall + Applied Irrigation)</code>.</p>
          <p><b className="text-foreground">Irrigation status</b> classes: Adequate (&lt; 4 mm), Mild (4–12 mm), Moderate (12–25 mm), Critical (≥ 25 mm). The map polygon colour reflects the field's current class; per-field advisory recommends the next irrigation window and approximate depth.</p>
        </CardBody>
      </Card>
    </div>
  );
}

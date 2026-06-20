import { useEffect, useState } from "react";
import { Leaf, Sprout, Droplets, Tractor, AlertTriangle, AlertCircle, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import api from "../api/app";
import StatCard from "../components/StatCard";
import { Card, CardHeader, CardBody, Badge } from "../components/Card";
import SatelliteMap from "../components/SatelliteMap";

const sevTone = (s) => (s === "High" ? "high" : s === "Moderate" ? "moderate" : "low");
const sevIcon = (s) => (s === "High" ? AlertTriangle : s === "Moderate" ? AlertCircle : TrendingUp);

const POLY_KEY = "kshetra_user_fields";
const loadPolys = () => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(POLY_KEY) || "[]"); } catch { return []; }
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [crops, setCrops] = useState([]);
  const [moisture, setMoisture] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [irrig, setIrrig] = useState([]);
  const [polygons, setPolygons] = useState([]);

  useEffect(() => {
    api.getDashboardStats().then(setStats);
    api.getCropDistribution().then(setCrops);
    api.getMoistureOverview().then(setMoisture);
    api.getAlerts().then((a) => setAlerts(a.slice(0, 3)));
    api.getIrrigationRecommendations().then((r) => setIrrig(r.slice(0, 3)));
    setPolygons(loadPolys());
    const onChange = () => setPolygons(loadPolys());
    window.addEventListener("kshetra-fields", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("kshetra-fields", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Leaf} label="Total Fields" value={stats?.totalFields ?? "—"} sub={`+${stats?.weeklyChange ?? 0} this week`} tint="success" />
        <StatCard icon={Sprout} label="Healthy Fields" value={stats?.healthyFields ?? "—"} sub="72% of total" tint="info" />
        <StatCard icon={Droplets} label="Stress Detected" value={stats?.stressDetected ?? "—"} sub="16% of total" tint="warning" />
        <StatCard icon={Tractor} label="Need Irrigation" value={stats?.needIrrigation ?? "—"} sub="11% of total" tint="danger" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader title="Field Health Map" sub="Live satellite view of monitored plots" />
          <CardBody>
            {polygons.length === 0 ? (
              <div className="h-[340px] rounded-xl border border-dashed border-border grid place-items-center text-sm text-muted-foreground text-center px-6">
                No fields yet. Go to <span className="font-medium text-foreground mx-1">Field Map</span> and draw your field boundaries to see them here.
              </div>
            ) : (
              <SatelliteMap polygons={polygons} height={340} />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent Alerts" action={<button className="text-xs text-primary font-medium">View All</button>} />
          <CardBody className="space-y-3">
            {alerts.map((a) => {
              const Icon = sevIcon(a.severity);
              return (
                <div key={a.id} className="flex gap-3 p-3 rounded-xl bg-muted/40">
                  <div className={`w-9 h-9 shrink-0 rounded-lg grid place-items-center ${a.severity === "High" ? "bg-destructive/15 text-destructive" : a.severity === "Moderate" ? "bg-warning/20 text-amber-700" : "bg-success/15 text-success"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground">Field ID: {a.fieldId ?? "—"} • {a.crop ?? "All"}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Crop Distribution" />
          <CardBody>
            <div className="h-56 flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie data={crops} dataKey="value" innerRadius={40} outerRadius={70} paddingAngle={2}>
                    {crops.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ul className="flex-1 text-sm space-y-1.5">
                {crops.map((c) => (
                  <li key={c.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c.color }} />
                    <span className="flex-1">{c.name}</span>
                    <span className="text-muted-foreground">{c.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Moisture Stress Overview" sub="Fields by stress level" />
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={moisture}>
                <XAxis dataKey="level" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {moisture.map((m, i) => <Cell key={i} fill={m.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Irrigation Recommendations" action={<button className="text-xs text-primary font-medium">View All</button>} />
          <CardBody className="space-y-3">
            {irrig.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Field ID: {r.fieldId} • {r.crop}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.recommendation}</p>
                </div>
                <Badge tone={sevTone(r.stress)}>{r.action}</Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-900 to-emerald-700">
        <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=70" alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative h-full flex flex-col justify-center p-6 text-white">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            <h3 className="font-display text-xl font-bold">Kshetra AI</h3>
          </div>
          <p className="text-sm text-white/85 mt-1 max-w-lg">Harnessing Satellite Intelligence and AI for Climate-Resilient Agriculture</p>
        </div>
      </div>
    </div>
  );
}

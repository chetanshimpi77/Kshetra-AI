import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, ShieldCheck, AlertTriangle, Leaf } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Area, AreaChart } from "recharts";
import api from "../api/app";
import { Card, CardHeader, CardBody, Badge } from "../components/Card";
import StatCard from "../components/StatCard";

const crops = ["Cotton", "Soybean", "Wheat", "Rice", "Sugarcane", "Maize"];

export default function YieldForecast() {
  const [crop, setCrop] = useState("Cotton");
  const [field, setField] = useState("101");
  const [season, setSeason] = useState("Kharif 2024");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const res = await api.getYieldForecast({ crop, field, season });
    setData(res);
    setLoading(false);
  };

  useEffect(() => { run(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-success grid place-items-center text-white">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl">AI Crop Yield Forecast</h2>
          <p className="text-sm text-muted-foreground">Predict harvest yield using satellite, weather & soil intelligence</p>
        </div>
      </div>

      <Card>
        <CardBody className="pt-5 grid grid-cols-1 md:grid-cols-4 gap-3">
          <label className="block">
            <span className="text-xs text-muted-foreground">Crop</span>
            <select value={crop} onChange={(e) => setCrop(e.target.value)} className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-lg bg-background">
              {crops.map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">Field ID</span>
            <input value={field} onChange={(e) => setField(e.target.value)} className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-lg bg-background" />
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">Season</span>
            <select value={season} onChange={(e) => setSeason(e.target.value)} className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-lg bg-background">
              <option>Kharif 2024</option><option>Rabi 2024</option><option>Zaid 2025</option>
            </select>
          </label>
          <div className="flex items-end">
            <button onClick={run} disabled={loading} className="w-full px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-60">
              {loading ? "Analyzing…" : "Generate Forecast"}
            </button>
          </div>
        </CardBody>
      </Card>

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Leaf} label="Expected Yield" value={`${data.expectedYield}`} sub={data.unit} tint="success" />
            <StatCard icon={TrendingUp} label="vs Last Year" value={`+${data.changeVsLastYear}%`} sub="Year over year" tint="info" />
            <StatCard icon={ShieldCheck} label="Model Confidence" value={`${data.confidence}%`} sub="AI prediction" tint="primary" />
            <StatCard icon={AlertTriangle} label="Risk Level" value="Low" sub="Stable forecast" tint="warning" />
          </div>

          <Card>
            <CardHeader title={`Yield Trend — ${data.crop}`} sub="Predicted vs last season (quintal/acre)" />
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.trend}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="predicted" stroke="#16a34a" strokeWidth={3} fill="url(#g1)" name="Predicted" />
                  <Line type="monotone" dataKey="lastYear" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 4" dot={false} name="Last Year" />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Key Influencing Factors" />
              <CardBody className="space-y-4">
                {data.factors.map(f => (
                  <div key={f.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{f.name}</span>
                      <Badge tone={f.impact === "Positive" ? "low" : f.impact === "Neutral" ? "moderate" : "high"}>{f.impact}</Badge>
                    </div>
                    <div className="mt-1.5 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-success" style={{ width: `${f.score}%` }} />
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="AI Recommendations" sub="Actions to maximize your yield" />
              <CardBody className="space-y-3">
                {data.recommendations.map((r, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/40">
                    <div className="w-7 h-7 shrink-0 rounded-full bg-success/15 text-success grid place-items-center text-xs font-bold">{i + 1}</div>
                    <p className="text-sm">{r}</p>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

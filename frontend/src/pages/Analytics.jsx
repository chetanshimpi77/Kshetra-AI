import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import api from "../api/app";
import StatCard from "../components/StatCard";
import { Card, CardHeader, CardBody } from "../components/Card";
import { TrendingUp, Droplets, Leaf, Bell } from "lucide-react";

export default function Analytics() {
  const [ov, setOv] = useState(null);
  const [ndvi, setNdvi] = useState([]);
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    api.getAnalyticsOverview().then(setOv);
    api.getNdviTrend().then(setNdvi);
    api.getCropDistribution().then(setCrops);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-xl">Analytics</h2>
          <p className="text-sm text-muted-foreground">Insights and trends from your fields</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 text-sm border border-border rounded-lg bg-card"><option>This Season</option></select>
          <select className="px-3 py-2 text-sm border border-border rounded-lg bg-card"><option>All Crops</option></select>
          <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium">Export Report</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Leaf} label="Average NDVI" value={ov?.avgNdvi ?? "—"} tint="success" />
        <StatCard icon={Droplets} label="Average NDWI" value={ov?.avgNdwi ?? "—"} tint="info" />
        <StatCard icon={TrendingUp} label="Total Fields" value={ov?.totalFields ?? "—"} tint="primary" />
        <StatCard icon={Bell} label="Alerts Generated" value={ov?.alertsGenerated ?? "—"} tint="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="NDVI Trend" />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={ndvi}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} domain={[0, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={3} dot={{ r: 5, fill: "#16a34a" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Crop Distribution" />
          <CardBody>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="55%" height="100%">
                <PieChart>
                  <Pie data={crops} dataKey="value" innerRadius={45} outerRadius={85} paddingAngle={2}>
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
      </div>
    </div>
  );
}

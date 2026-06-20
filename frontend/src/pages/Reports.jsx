import { useEffect, useState } from "react";
import { FileText, BarChart3, Bell, Download } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import api from "../api/app";
import StatCard from "../components/StatCard";
import { Card, CardHeader, CardBody } from "../components/Card";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [list, setList] = useState([]);
  const [ov, setOv] = useState([]);
  const [top, setTop] = useState([]);

  useEffect(() => {
    api.getReportsStats().then(setStats);
    api.getReports().then(setList);
    api.getReportsOverview().then(setOv);
    api.getTopFieldsInReports().then(setTop);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-xl">Reports</h2>
          <p className="text-sm text-muted-foreground">View and download reports for your fields</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 text-sm border border-border rounded-lg bg-card"><option>This Season</option></select>
          <select className="px-3 py-2 text-sm border border-border rounded-lg bg-card"><option>All Crops</option></select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Reports" value={stats?.totalReports ?? "—"} sub="Generated" tint="primary" />
        <StatCard icon={BarChart3} label="Fields Analyzed" value={stats?.fieldsAnalyzed ?? "—"} sub="This Season" tint="success" />
        <StatCard icon={Bell} label="Alerts Generated" value={stats?.alertsGenerated ?? "—"} sub="This Season" tint="warning" />
        <StatCard icon={Download} label="Downloads" value={stats?.downloads ?? "—"} sub="This Season" tint="info" />
      </div>

      <Card>
        <CardHeader title="Available Reports" />
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                {["Report Name", "Description", "Fields", "Generated On", "Action"].map(h => (
                  <th key={h} className="py-3 px-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map(r => (
                <tr key={r.name} className="border-b border-border last:border-0">
                  <td className="py-3 px-2 font-medium">{r.name}</td>
                  <td className="py-3 px-2 text-muted-foreground">{r.description}</td>
                  <td className="py-3 px-2">{r.fields}</td>
                  <td className="py-3 px-2 text-muted-foreground">{r.date}</td>
                  <td className="py-3 px-2 flex gap-2">
                    <button onClick={() => api.downloadReport(r.name)} className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted">View</button>
                    <button onClick={() => api.downloadReport(r.name)} className="px-3 py-1.5 text-xs bg-success text-white rounded-md hover:opacity-90">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Reports Overview" sub="Reports Generated Over Time" />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ov}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Top Fields in Reports" />
          <CardBody>
            <div className="h-60 flex items-center">
              <ResponsiveContainer width="55%" height="100%">
                <PieChart>
                  <Pie data={top} dataKey="value" innerRadius={45} outerRadius={85}>
                    {top.map((t, i) => <Cell key={i} fill={t.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ul className="flex-1 text-sm space-y-1.5">
                {top.map(t => (
                  <li key={t.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: t.color }} />
                    <span className="flex-1">{t.name}</span>
                    <span className="text-muted-foreground">{t.value}%</span>
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

import { Users, Sprout, Database, Activity, ShieldCheck } from "lucide-react";
import StatCard from "../components/StatCard";
import { Card, CardHeader, CardBody, Badge } from "../components/Card";
import { useEffect, useState } from "react";
import { getAllUsers } from "../lib/auth";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  useEffect(() => { setUsers(getAllUsers()); }, []);
  const farmers = users.filter(u => u.role === "farmer").length;
  const admins = users.filter(u => u.role === "admin").length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage the platform, users, and system health</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={users.length} tint="info" />
        <StatCard icon={Sprout} label="Farmers" value={farmers} tint="success" />
        <StatCard icon={ShieldCheck} label="Admins" value={admins} tint="warning" />
        <StatCard icon={Database} label="Total Fields" value="250" tint="danger" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="System Health" subtitle="All services operational" />
          <CardBody>
            {[
              { name: "API Gateway", status: "Operational" },
              { name: "Database", status: "Operational" },
              { name: "AI Inference", status: "Operational" },
              { name: "Satellite Feed", status: "Operational" },
            ].map(s => (
              <div key={s.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-success" /> <span className="text-sm">{s.name}</span></div>
                <Badge tone="low">{s.status}</Badge>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Recent Activity" />
          <CardBody>
            {[
              "New farmer registered: priya.sharma@gmail.com",
              "Yield forecast model retrained (v2.4)",
              "12 alerts dispatched to farmers",
              "Satellite imagery synced for 250 fields",
            ].map((t, i) => (
              <div key={i} className="py-2 text-sm border-b border-border last:border-0">• {t}</div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Droplets } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import api from "../api/app";
import { Card, CardHeader, CardBody, Badge } from "../components/Card";
import StatCard from "../components/StatCard";

export default function MoistureStress() {
  const [dist, setDist] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    api.getMoistureDistribution().then(setDist);
    api.getFields().then(setFields);
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl">Moisture Stress</h2>
        <p className="text-sm text-muted-foreground">Monitor moisture stress levels in your fields</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Droplets} label="Low Stress" value="180" sub="72%" tint="success" />
        <StatCard icon={Droplets} label="Moderate Stress" value="42" sub="16%" tint="warning" />
        <StatCard icon={Droplets} label="High Stress" value="28" sub="11%" tint="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Moisture Stress Distribution" />
          <CardBody>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="55%" height="100%">
                <PieChart>
                  <Pie data={dist} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {dist.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ul className="flex-1 text-sm space-y-2">
                {dist.map(d => (
                  <li key={d.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ background: d.color }} />
                    <span className="flex-1">{d.name}</span>
                    <span className="text-muted-foreground">{d.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Field Wise Moisture Stress" />
          <CardBody className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  {["Field ID", "Crop", "Stress Level", "NDWI Value", "Last Updated"].map(h => (
                    <th key={h} className="py-2 px-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map(f => (
                  <tr key={f.id} className="border-b border-border last:border-0">
                    <td className="py-2 px-2">{f.id}</td>
                    <td className="py-2 px-2">{f.crop}</td>
                    <td className="py-2 px-2"><Badge tone={f.stress === "High" ? "high" : f.stress === "Moderate" ? "moderate" : "low"}>{f.stress}</Badge></td>
                    <td className="py-2 px-2">{f.ndwi}</td>
                    <td className="py-2 px-2 text-muted-foreground">{f.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

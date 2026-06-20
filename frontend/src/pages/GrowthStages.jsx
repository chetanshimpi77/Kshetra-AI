import { useEffect, useState } from "react";
import api from "../api/app";
import { Card, CardBody } from "../components/Card";

export default function GrowthStages() {
  const [stages, setStages] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    api.getGrowthStages().then(setStages);
    api.getFields().then(setFields);
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl">Growth Stages</h2>
        <p className="text-sm text-muted-foreground">Monitor growth stages of your crops</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((s) => (
          <div key={s.stage} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-3 shadow-sm">
            <div className="text-3xl">{s.icon}</div>
            <div>
              <p className="font-semibold">{s.stage}</p>
              <p className="text-sm text-muted-foreground">{s.count} Fields</p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardBody className="pt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                {["Field ID", "Crop", "Current Stage", "Progress", "Last Updated", "Action"].map(h => (
                  <th key={h} className="py-3 px-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map(f => {
                const progress = { Vegetative: 40, Flowering: 65, Fruiting: 60, Maturity: 90 }[f.stage] || 50;
                return (
                  <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="py-3 px-2 font-medium">{f.id}</td>
                    <td className="py-3 px-2">{f.crop}</td>
                    <td className="py-3 px-2">{f.stage}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-success" style={{ width: `${progress}%` }} />
                        </div>
                        <span>{progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{f.updated}</td>
                    <td className="py-3 px-2"><button className="text-primary font-medium">View</button></td>
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

import { useEffect, useState } from "react";
import api from "../api/app";
import { Card, CardHeader, CardBody } from "../components/Card";

export default function CropClassification() {
  const [rows, setRows] = useState([]);
  useEffect(() => { api.getCropClassifications().then(setRows); }, []);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-xl">Crop Classification</h2>
          <p className="text-sm text-muted-foreground">AI detected crop types in your fields</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 text-sm border border-border rounded-lg bg-card"><option>All Crops</option></select>
          <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium">Export Report</button>
        </div>
      </div>

      <Card>
        <CardBody className="pt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                {["Field ID", "Location", "Crop Type", "Confidence", "Area (Acres)", "Last Updated", "Action"].map(h => (
                  <th key={h} className="py-3 px-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="py-3 px-2 font-medium">{r.id}</td>
                  <td className="py-3 px-2">{r.location}</td>
                  <td className="py-3 px-2">{r.crop}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-success" style={{ width: `${r.confidence}%` }} />
                      </div>
                      <span>{r.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">{r.area}</td>
                  <td className="py-3 px-2 text-muted-foreground">{r.updated}</td>
                  <td className="py-3 px-2"><button className="text-primary font-medium">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

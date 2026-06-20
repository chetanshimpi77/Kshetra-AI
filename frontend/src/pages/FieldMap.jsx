import { useEffect, useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { Card, CardBody } from "../components/Card";
import StatCard from "../components/StatCard";
import { Leaf, Sprout, Droplets, Tractor } from "lucide-react";
import SatelliteMap from "../components/SatelliteMap";
import { toast } from "sonner";

const POLY_KEY = "kshetra_user_fields";

const loadPolys = () => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(POLY_KEY) || "[]"); } catch { return []; }
};
const savePolys = (list) => {
  localStorage.setItem(POLY_KEY, JSON.stringify(list));
  if (typeof window !== "undefined") window.dispatchEvent(new Event("kshetra-fields"));
};
const normalized = (value) => String(value || "").trim().toLowerCase();

export default function FieldMap() {
  const [polygons, setPolygons] = useState([]);
  const [search, setSearch] = useState("");
  const [focusedId, setFocusedId] = useState(null);
  const [pendingCoords, setPendingCoords] = useState(null);
  const [form, setForm] = useState({ name: "", crop: "Cotton" });

  useEffect(() => {
    setPolygons(loadPolys());
  }, []);

  const filteredPolygons = polygons.filter((p) => {
    const q = normalized(search);
    if (!q) return true;
    return [p.id, p.name, p.crop, p.location].some((value) => normalized(value).includes(q));
  });

  const runSearch = () => {
    const q = normalized(search);
    if (!q) {
      setFocusedId(null);
      return;
    }
    const match = polygons.find((p) => [p.id, p.name, p.crop, p.location].some((value) => normalized(value).includes(q)));
    if (match) {
      setFocusedId(match.id);
      toast.success(`${match.name || "Field"} shown on map`);
    } else {
      setFocusedId(null);
      toast.error("No saved field found");
    }
  };

  const handlePolygon = (coords) => {
    setPendingCoords(coords);
    setForm({ name: `Field ${polygons.length + 1}`, crop: "Cotton" });
  };

  const savePolygon = () => {
    if (!pendingCoords) return;
    const nextField = { id: Date.now(), name: form.name || "Field", crop: form.crop, coords: pendingCoords };
    const next = [...polygons, nextField];
    setPolygons(next); savePolys(next);
    setFocusedId(nextField.id);
    setPendingCoords(null);
    toast.success("Field boundary saved");
  };

  const removePolygon = (id) => {
    const next = polygons.filter(p => p.id !== id);
    setPolygons(next); savePolys(next);
    if (focusedId === id) setFocusedId(null);
    toast.success("Field removed");
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl">Field Map (Satellite View)</h2>
        <p className="text-sm text-muted-foreground">Draw boundaries to add your own fields on satellite imagery</p>
      </div>

      <Card>
        <CardBody className="pt-5">
          <div className="flex flex-wrap gap-3 mb-4">
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-background"><option>All Crops</option></select>
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-background"><option>All Stages</option></select>
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-background"><option>All Stress Levels</option></select>
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
                placeholder="Search Field ID / Name / Crop"
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background"
              />
            </div>
            <button onClick={runSearch} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Search</button>
          </div>

          <SatelliteMap
            fields={[]}
            polygons={filteredPolygons}
            height={520}
            drawingEnabled
            onPolygonComplete={handlePolygon}
            focusedPolygonId={focusedId}
          />

          {pendingCoords && (
            <div className="mt-4 p-4 border border-border rounded-xl bg-muted/30">
              <p className="text-sm font-semibold mb-3">Save New Field ({pendingCoords.length} vertices)</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Field name" className="px-3 py-2 text-sm border border-border rounded-lg bg-background" />
                <select value={form.crop} onChange={e => setForm({ ...form, crop: e.target.value })}
                  className="px-3 py-2 text-sm border border-border rounded-lg bg-background">
                  {["Cotton", "Soybean", "Wheat", "Rice", "Sugarcane", "Maize", "Tur", "Groundnut"].map(c => <option key={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <button onClick={savePolygon} className="flex-1 px-3 py-2 bg-success text-white rounded-lg text-sm font-medium">Save Field</button>
                  <button onClick={() => setPendingCoords(null)} className="px-3 py-2 border border-border rounded-lg text-sm">Discard</button>
                </div>
              </div>
            </div>
          )}

          {polygons.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2 flex items-center gap-2"><Plus className="w-4 h-4" /> My Fields ({polygons.length})</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredPolygons.map(p => (
                  <div key={p.id} className={`flex items-center justify-between px-3 py-2 border rounded-lg text-sm ${focusedId === p.id ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.crop} • {p.coords.length} pts</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setFocusedId(p.id)} className="px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded">Show</button>
                      <button onClick={() => removePolygon(p.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Leaf} label="Total Fields" value="250" tint="success" />
        <StatCard icon={Sprout} label="Healthy Fields" value="180" sub="72%" tint="info" />
        <StatCard icon={Droplets} label="Moderate Stress" value="42" sub="16%" tint="warning" />
        <StatCard icon={Tractor} label="High Stress" value="28" sub="11%" tint="danger" />
      </div>
    </div>
  );
}

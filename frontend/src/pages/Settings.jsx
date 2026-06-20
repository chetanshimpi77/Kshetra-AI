import { useEffect, useState } from "react";
import api from "../api/app";
import { Card, CardHeader, CardBody } from "../components/Card";
import { toast } from "sonner";

const tabs = ["General", "Units & Measurements", "Data Preferences", "Account"];

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full p-0.5 transition ${checked ? "bg-success" : "bg-muted"}`}>
      <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}

export default function Settings() {
  const [tab, setTab] = useState("General");
  const [s, setS] = useState(null);

  useEffect(() => { api.getSettings().then(setS); }, []);
  if (!s) return null;
  const upd = (k, v) => setS({ ...s, [k]: v });
  const save = async () => { await api.updateSettings(s); toast.success("Settings saved"); };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl">Settings</h2>
        <p className="text-sm text-muted-foreground">Customize your preferences and application settings</p>
      </div>

      <div className="flex gap-2 border-b border-border">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="General Settings" />
          <CardBody>
            <Row label="Language">
              <select className="px-3 py-1.5 text-sm border border-border rounded-md bg-background" value={s.language} onChange={e => upd("language", e.target.value)}>
                <option>English</option><option>हिन्दी</option><option>मराठी</option>
              </select>
            </Row>
            <Row label="Theme">
              <select className="px-3 py-1.5 text-sm border border-border rounded-md bg-background" value={s.theme} onChange={e => upd("theme", e.target.value)}>
                <option>Light</option><option>Dark</option>
              </select>
            </Row>
            <Row label="Date Format">
              <select className="px-3 py-1.5 text-sm border border-border rounded-md bg-background" value={s.dateFormat} onChange={e => upd("dateFormat", e.target.value)}>
                <option>DD MMM YYYY</option><option>YYYY-MM-DD</option>
              </select>
            </Row>
            <Row label="Time Format">
              <select className="px-3 py-1.5 text-sm border border-border rounded-md bg-background" value={s.timeFormat} onChange={e => upd("timeFormat", e.target.value)}>
                <option>12 Hour</option><option>24 Hour</option>
              </select>
            </Row>
            <Row label="Notifications"><Toggle checked={s.notifications} onChange={v => upd("notifications", v)} /></Row>
            <Row label="Auto Refresh Data"><Toggle checked={s.autoRefresh} onChange={v => upd("autoRefresh", v)} /></Row>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Map Settings" />
          <CardBody>
            <Row label="Default Map View">
              <select className="px-3 py-1.5 text-sm border border-border rounded-md bg-background" value={s.mapView} onChange={e => upd("mapView", e.target.value)}>
                <option>Satellite</option><option>Terrain</option>
              </select>
            </Row>
            <Row label="Show Field Boundaries"><Toggle checked={s.fieldBoundaries} onChange={v => upd("fieldBoundaries", v)} /></Row>
            <Row label="Show Weather Layer"><Toggle checked={s.weatherLayer} onChange={v => upd("weatherLayer", v)} /></Row>
            <Row label="Show Soil Moisture Layer"><Toggle checked={s.soilLayer} onChange={v => upd("soilLayer", v)} /></Row>
            <Row label="Default Zoom Level">
              <input type="range" min={1} max={20} value={s.zoom} onChange={e => upd("zoom", +e.target.value)} className="w-32 accent-success" />
            </Row>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Data Settings" />
          <CardBody>
            <Row label="Data Update Frequency">
              <select className="px-3 py-1.5 text-sm border border-border rounded-md bg-background" value={s.updateFrequency} onChange={e => upd("updateFrequency", e.target.value)}>
                <option>Daily</option><option>Weekly</option>
              </select>
            </Row>
            <Row label="Satellite Data Source">
              <select className="px-3 py-1.5 text-sm border border-border rounded-md bg-background" value={s.satelliteSource} onChange={e => upd("satelliteSource", e.target.value)}>
                <option>Sentinel-2</option><option>Landsat-8</option>
              </select>
            </Row>
            <Row label="Weather Data Source">
              <select className="px-3 py-1.5 text-sm border border-border rounded-md bg-background" value={s.weatherSource} onChange={e => upd("weatherSource", e.target.value)}>
                <option>IMD</option><option>OpenWeather</option>
              </select>
            </Row>
          </CardBody>
        </Card>
      </div>

      <button onClick={save} className="px-5 py-2.5 bg-success text-white rounded-lg text-sm font-medium">Save Changes</button>
    </div>
  );
}

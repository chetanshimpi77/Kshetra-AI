import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import api from "../api/app";
import { Card, CardHeader, CardBody } from "../components/Card";
import { toast } from "sonner";

function Field({ label, ...rest }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-lg bg-background" {...rest} />
    </label>
  );
}

export default function Profile() {
  const [p, setP] = useState(null);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => { api.getProfile().then(setP); }, []);
  if (!p) return null;
  const upd = (k, v) => setP({ ...p, [k]: v });

  const saveProfile = async () => { await api.updateProfile(p); toast.success("Profile updated"); };
  const savePw = async () => {
    if (pw.next !== pw.confirm) return toast.error("Passwords don't match");
    await api.updatePassword(pw);
    toast.success("Password updated");
    setPw({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl">Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardBody className="pt-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-success grid place-items-center text-white font-display font-bold text-3xl">RP</div>
            <h3 className="font-display font-semibold text-lg mt-3">{p.name}</h3>
            <p className="text-sm text-muted-foreground">{p.role}</p>
            <div className="text-left mt-5 space-y-2.5 text-sm">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" />{p.email}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" />{p.phone}</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" />{p.location}</p>
              <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" />Member Since: {p.memberSince}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 text-center">
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total Fields</p>
                <p className="font-display font-bold text-lg">{p.totalFields}</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Crops Grown</p>
                <p className="font-display font-bold text-lg">{p.cropsGrown}</p>
              </div>
            </div>
            <button className="mt-5 w-full py-2 bg-success text-white rounded-lg text-sm font-medium">Edit Profile</button>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Personal Information" />
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={p.name} onChange={e => upd("name", e.target.value)} />
            <Field label="Email Address" value={p.email} onChange={e => upd("email", e.target.value)} />
            <Field label="Phone Number" value={p.phone} onChange={e => upd("phone", e.target.value)} />
            <Field label="Location" value={p.location} onChange={e => upd("location", e.target.value)} />
            <Field label="Land Area (Acres)" type="number" value={p.landArea} onChange={e => upd("landArea", +e.target.value)} />
            <label className="block">
              <span className="text-xs text-muted-foreground">Preferred Language</span>
              <select className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-lg bg-background" value={p.language} onChange={e => upd("language", e.target.value)}>
                <option>English</option><option>हिन्दी</option><option>मराठी</option>
              </select>
            </label>
            <div className="sm:col-span-2">
              <button onClick={saveProfile} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Save Changes</button>
            </div>
          </CardBody>

          <CardHeader title="Change Password" />
          <CardBody className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Current Password" type="password" value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} />
            <Field label="New Password" type="password" value={pw.next} onChange={e => setPw({ ...pw, next: e.target.value })} />
            <Field label="Confirm New Password" type="password" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} />
            <div className="sm:col-span-3">
              <button onClick={savePw} className="px-5 py-2 bg-success text-white rounded-lg text-sm font-medium">Update Password</button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

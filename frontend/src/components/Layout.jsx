import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Map, Sprout, TrendingUp, Droplets, CloudRain,
  BarChart3, Bell, FileText, Settings, User, LogOut, Menu, ChevronDown,
  Leaf, MessageSquare, LineChart, ShieldCheck, Users, X, Waves,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth, logout } from "../lib/auth";
import api from "../api/app";
import { useT } from "../lib/i18n";

const farmerNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/field-map", label: "Field Map", icon: Map },
  { to: "/crop-classification", label: "Crop Classification", icon: Sprout },
  { to: "/growth-stages", label: "Growth Stages", icon: TrendingUp },
  { to: "/moisture-stress", label: "Moisture Stress", icon: Droplets },
  { to: "/irrigation", label: "Irrigation Recommendations", icon: CloudRain },
  { to: "/water-advisory", label: "Water Advisory", icon: Waves },
  { to: "/yield-forecast", label: "AI Yield Forecast", icon: LineChart },
  { to: "/chatbot", label: "AI Assistant", icon: MessageSquare },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/alerts", label: "Alerts & Notifications", icon: Bell },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: User },
];

const adminNav = [
  { to: "/admin", label: "Admin Dashboard", icon: ShieldCheck },
  { to: "/admin/users", label: "User Management", icon: Users },
  { to: "/", label: "Farmer Dashboard", icon: LayoutDashboard },
  { to: "/field-map", label: "Field Map", icon: Map },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Layout({ children, title, adminOnly = false }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const user = useAuth();
  const tr = useT();
  const [open, setOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => { api.getAlerts().then((a) => setAlerts(a || [])); }, []);
  useEffect(() => { api.getSettings().then((s) => api.updateSettings(s)); }, []);

  // Auth gate (client-only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!user) navigate({ to: "/auth", replace: true });
    else if (adminOnly && user.role !== "admin") navigate({ to: "/", replace: true });
  }, [user, adminOnly, navigate]);

  if (!user) return null;
  if (adminOnly && user.role !== "admin") return null;

  const nav = user.role === "admin" ? adminNav : farmerNav;
  const initials = (user.name || "U").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const unread = alerts.filter(a => a.severity === "High").length;

  const handleLogout = () => { logout(); navigate({ to: "/auth", replace: true }); };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform`}>
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-success grid place-items-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none">Kshetra AI</h1>
            <p className="text-[10px] text-white/60 mt-1">Smart Fields. Better Future.</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");
            return (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-white/75 hover:bg-white/5 hover:text-white"
                }`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tr(label)}</span>
              </Link>
            );
          })}
          <button onClick={handleLogout} className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/75 hover:bg-white/5 hover:text-white">
            <LogOut className="w-4 h-4" /> {tr("Logout")}
          </button>
        </nav>
        <div className="m-3 p-3 rounded-xl bg-gradient-to-br from-primary/30 to-success/20 border border-white/10">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-success" />
            <p className="text-xs font-medium">Empowering Farmers with AI & Satellite Intelligence</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-md hover:bg-muted">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-display font-semibold text-lg">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Bell */}
            <div className="relative">
              <button onClick={() => { setBellOpen(!bellOpen); setMenuOpen(false); }} className="relative p-2 rounded-full hover:bg-muted">
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 grid place-items-center rounded-full bg-destructive text-[10px] text-white font-bold">{unread}</span>
                )}
              </button>
              {bellOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b border-border">
                    <p className="font-semibold text-sm">{tr("Notifications")}</p>
                    <button onClick={() => setBellOpen(false)} className="p-1 hover:bg-muted rounded"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {alerts.slice(0, 6).map(a => {
                      const tone = a.severity === "High" ? "bg-destructive" : a.severity === "Moderate" ? "bg-warning" : "bg-success";
                      return (
                        <div key={a.id} className="p-3 border-b border-border last:border-0 hover:bg-muted/40">
                          <div className="flex items-start gap-2">
                            <span className={`w-2 h-2 mt-1.5 rounded-full ${tone}`} />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{a.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{a.detail}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{a.time}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Link to="/alerts" onClick={() => setBellOpen(false)} className="block text-center text-xs text-primary font-medium py-2 border-t border-border hover:bg-muted">
                    {tr("View all alerts →")}
                  </Link>
                </div>
              )}
            </div>

            {/* Profile menu */}
            <div className="relative pl-2 border-l border-border">
              <button onClick={() => { setMenuOpen(!menuOpen); setBellOpen(false); }} className="flex items-center gap-2 hover:bg-muted rounded-lg p-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-success grid place-items-center text-white font-semibold text-sm">{initials}</div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium leading-tight">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><User className="w-4 h-4" /> {tr("Profile")}</Link>
                  <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Settings className="w-4 h-4" /> {tr("Settings")}</Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-destructive border-t border-border">
                    <LogOut className="w-4 h-4" /> {tr("Logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 z-30 lg:hidden" />}
    </div>
  );
}

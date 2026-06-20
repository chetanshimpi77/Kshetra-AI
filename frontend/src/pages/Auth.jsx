import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Leaf, Mail, Lock, User, Phone, MapPin, ShieldCheck, Sprout } from "lucide-react";
import { login, signup, loginWithGoogle } from "../lib/auth";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | signup
  const [role, setRole] = useState("farmer"); // farmer | admin
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", location: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const user = mode === "login"
        ? login({ email: form.email, password: form.password })
        : signup({ ...form, role });
      navigate({ to: user.role === "admin" ? "/admin" : "/" });
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const google = () => {
    const user = loginWithGoogle({ role });
    navigate({ to: user.role === "admin" ? "/admin" : "/" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Hero */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-amber-800 text-white p-12 flex-col justify-between">
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=70" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur grid place-items-center"><Leaf className="w-7 h-7" /></div>
            <div>
              <h1 className="font-display font-bold text-2xl">Kshetra AI</h1>
              <p className="text-xs text-white/70">Smart Fields. Better Future.</p>
            </div>
          </div>
        </div>
        <div className="relative space-y-4">
          <h2 className="font-display text-4xl font-bold leading-tight">Empowering farmers with AI & satellite intelligence.</h2>
          <p className="text-white/80 max-w-md">Monitor crop health, predict yields, optimize irrigation — all in one place.</p>
        </div>
        <div className="relative text-xs text-white/60">© {new Date().getFullYear()} Kshetra AI</div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-success grid place-items-center"><Leaf className="w-5 h-5 text-white" /></div>
            <div>
              <h1 className="font-display font-bold text-lg">Kshetra AI</h1>
              <p className="text-[10px] text-muted-foreground">Smart Fields. Better Future.</p>
            </div>
          </div>

          <h2 className="font-display font-bold text-2xl">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{mode === "login" ? "Sign in to continue to your dashboard" : "Join Kshetra AI to manage your fields"}</p>

          {/* Role tabs */}
          <div className="mt-5 grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            <button type="button" onClick={() => setRole("farmer")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${role==="farmer" ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}>
              <Sprout className="w-4 h-4" /> Farmer
            </button>
            <button type="button" onClick={() => setRole("admin")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${role==="admin" ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}>
              <ShieldCheck className="w-4 h-4" /> Admin
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3 mt-5">
            {mode === "signup" && (
              <Field icon={User} placeholder="Full name" value={form.name} onChange={update("name")} required />
            )}
            <Field icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={update("email")} required />
            <Field icon={Lock} type="password" placeholder="Password" value={form.password} onChange={update("password")} required />
            {mode === "signup" && (
              <>
                <Field icon={Phone} placeholder="Phone (optional)" value={form.phone} onChange={update("phone")} />
                <Field icon={MapPin} placeholder="Location (optional)" value={form.location} onChange={update("location")} />
              </>
            )}

            {err && <p className="text-xs text-destructive">{err}</p>}

            <button disabled={loading} className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-60">
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">or continue with</span></div>
          </div>

          <button onClick={google} type="button" className="w-full h-11 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center gap-3 font-medium">
            <GoogleIcon /> Continue with Google
          </button>

          <p className="text-sm text-center mt-6 text-muted-foreground">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErr(""); }}
              className="text-primary font-medium hover:underline">
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>

          {mode === "login" && (
            <div className="mt-5 p-3 rounded-lg bg-muted/60 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Demo accounts</p>
              <p>Farmer — rajesh.patil@gmail.com / farmer123</p>
              <p>Admin — admin@kshetra.ai / admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input {...props} className="w-full h-11 pl-10 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 16.3 3 9.6 7.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 36 24 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 40.5 16.2 45 24 45z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C41 35.5 45 30.3 45 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}

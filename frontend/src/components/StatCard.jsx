export default function StatCard({ icon: Icon, label, value, sub, tint = "primary" }) {
  const tints = {
    primary: "bg-primary/10 text-primary",
    info: "bg-info/10 text-info",
    warning: "bg-warning/15 text-warning",
    danger: "bg-destructive/10 text-destructive",
    success: "bg-success/10 text-success",
  };
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-xl grid place-items-center ${tints[tint]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-display font-bold leading-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

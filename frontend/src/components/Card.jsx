export function Card({ children, className = "" }) {
  return <div className={`bg-card border border-border rounded-2xl shadow-sm ${className}`}>{children}</div>;
}
export function CardHeader({ title, action, sub }) {
  return (
    <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-4">
      <div>
        <h3 className="font-display font-semibold text-base">{title}</h3>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
export function CardBody({ children, className = "" }) {
  return <div className={`px-5 pb-5 ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "default" }) {
  const tones = {
    default: "bg-muted text-muted-foreground",
    high: "bg-destructive/15 text-destructive",
    moderate: "bg-warning/20 text-amber-700",
    low: "bg-success/15 text-success",
    info: "bg-info/15 text-info",
  };
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${tones[tone] || tones.default}`}>{children}</span>;
}

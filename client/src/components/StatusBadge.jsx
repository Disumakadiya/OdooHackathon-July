const statusStyles = {
  "in progress": "bg-primary/10 text-primary border-primary/20",
  scheduled: "bg-tertiary-container/20 text-tertiary border-tertiary/20",
  completed: "bg-secondary/10 text-secondary border-secondary/20",
  pending: "bg-outline-variant/40 text-on-surface-variant border-outline-variant",
  verified: "bg-secondary/10 text-secondary border-secondary/20",
  flagged: "bg-error/10 text-error border-error/20",
  open: "bg-error/10 text-error border-error/20",
  "in review": "bg-primary/10 text-primary border-primary/20",
  resolved: "bg-secondary/10 text-secondary border-secondary/20",
  missing: "bg-error/10 text-error border-error/20",
  damaged: "bg-tertiary-container/20 text-tertiary border-tertiary/20",
  lost: "bg-error/10 text-error border-error/20",
  available: "bg-secondary/10 text-secondary border-secondary/20",
  allocated: "bg-primary/10 text-primary border-primary/20",
  reserved: "bg-tertiary-container/20 text-tertiary border-tertiary/20",
  "under maintenance": "bg-error/10 text-error border-error/20",
  retired: "bg-outline-variant/30 text-on-surface-variant border-outline-variant",
  disposed: "bg-surface-container text-on-surface-variant border-outline-variant",
};

export default function StatusBadge({ status = "Pending", className = "" }) {
  const key = String(status).toLowerCase();
  const colorClass = statusStyles[key] ?? "bg-surface-container text-on-surface border-outline-variant";

  return (
    <span className={`inline-flex items-center rounded-full border px-sm py-1 font-label-sm text-label-sm font-bold ${colorClass} ${className}`}>
      {status}
    </span>
  );
}

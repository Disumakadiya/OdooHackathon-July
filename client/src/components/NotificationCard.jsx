import StatusBadge from "./StatusBadge";

export default function NotificationCard({ title, message, time, type = "info" }) {
  const typeToStatus = {
    info: "In Review",
    success: "Resolved",
    warning: "Pending",
    critical: "Open",
  };

  return (
    <article className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md soft-elevation">
      <div className="mb-sm flex items-start justify-between gap-sm">
        <h4 className="font-label-md text-label-md text-on-surface">{title}</h4>
        <StatusBadge status={typeToStatus[type] ?? "Pending"} />
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant">{message}</p>
      <p className="mt-sm font-label-sm text-label-sm text-on-surface-variant">{time}</p>
    </article>
  );
}

export default function StatsCard({ title, value, trend, trendType, icon }) {
  return (
    <Card className="border-white transition-transform hover:-translate-y-[2px]">
      <div className="mb-md flex items-center justify-between">
        <span className="material-symbols-outlined rounded-lg bg-surface-container p-sm text-primary">
          {icon}
        </span>
        <span
          className={`rounded-full px-sm py-1 font-label-sm text-label-sm ${
            trendType === "positive"
              ? "bg-secondary/10 text-secondary"
              : trendType === "warning"
              ? "bg-tertiary-container/20 text-tertiary"
              : "bg-surface-container text-on-surface-variant"
          }`}
        >
          {trend}
        </span>
      </div>
      <p className="font-label-md text-label-md text-on-surface-variant">{title}</p>
      <p className="mt-xs font-headline-lg text-headline-lg text-primary">{value.toLocaleString()}</p>
    </Card>
  );
}
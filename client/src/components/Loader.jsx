export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-sm text-on-surface-variant">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
      <span className="font-label-md text-label-md">{label}</span>
    </div>
  );
}

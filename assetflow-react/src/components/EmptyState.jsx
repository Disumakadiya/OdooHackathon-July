export default function EmptyState({ icon = "inventory_2", title = "No assets found", message = "There are no assets to display." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">{icon}</span>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">{message}</p>
    </div>
  );
}

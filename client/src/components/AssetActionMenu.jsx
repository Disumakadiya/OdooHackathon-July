export default function AssetActionMenu({ onView, onEdit, onDelete }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        className="rounded-lg border border-outline-variant px-3 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-surface-container"
        onClick={onView}
        type="button"
      >
        View
      </button>
      <button
        className="rounded-lg border border-outline-variant px-3 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-surface-container"
        onClick={onEdit}
        type="button"
      >
        Edit
      </button>
      <button
        className="rounded-lg border border-error/30 px-3 py-1.5 text-sm font-bold text-error transition-colors hover:bg-error/10"
        onClick={onDelete}
        type="button"
      >
        Delete
      </button>
    </div>
  );
}
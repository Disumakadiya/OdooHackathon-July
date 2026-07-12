export default function AssetActionMenu({ onView, onEdit, onDelete }) {
  return (
    <div className="relative inline-flex group">
      <button
        className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
        type="button"
      >
        <span className="material-symbols-outlined text-[20px]">more_vert</span>
      </button>
      <div className="absolute right-0 top-full z-20 mt-2 hidden min-w-36 overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-xl group-hover:block">
        <button className="block w-full px-4 py-2 text-left text-label-md text-on-surface hover:bg-surface-container-low" onClick={onView} type="button">
          View
        </button>
        <button className="block w-full px-4 py-2 text-left text-label-md text-on-surface hover:bg-surface-container-low" onClick={onEdit} type="button">
          Edit
        </button>
        <button className="block w-full px-4 py-2 text-left text-label-md text-error hover:bg-surface-container-low" onClick={onDelete} type="button">
          Delete
        </button>
      </div>
    </div>
  );
}

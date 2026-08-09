import { Eye, Pencil, Trash2 } from "lucide-react";

export default function AssetActionMenu({ onView, onEdit, onDelete }) {
  const actions = [
    { label: "View", icon: Eye, onClick: onView, className: "text-primary hover:bg-primary/10" },
    { label: "Edit", icon: Pencil, onClick: onEdit, className: "text-on-surface-variant hover:bg-surface-container" },
    { label: "Delete", icon: Trash2, onClick: onDelete, className: "text-error hover:bg-error/10" },
  ];

  return (
    <div className="inline-flex items-center gap-1">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            aria-label={action.label}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${action.className}`}
            key={action.label}
            onClick={(event) => {
              event.stopPropagation();
              action.onClick?.();
            }}
            title={action.label}
            type="button"
          >
            <Icon size={17} strokeWidth={2.2} />
          </button>
        );
      })}
    </div>
  );
}

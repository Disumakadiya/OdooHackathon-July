export default function Modal({ open, title, children, onClose, size = "lg" }) {
  if (!open) {
    return null;
  }

  const sizeClass = {
    sm: "max-w-lg",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  }[size] ?? "max-w-4xl";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <button
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />
      <div className={`relative z-10 w-full ${sizeClass} overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-5 py-4">
          <h2 className="font-headline-md text-headline-md text-primary">{title}</h2>
          <button
            aria-label="Close modal"
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

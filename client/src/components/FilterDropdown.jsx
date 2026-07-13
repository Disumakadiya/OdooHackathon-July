export default function FilterDropdown({ label, options = [], value, onChange, className = "" }) {
  return (
    <label className={`flex items-center gap-sm ${className}`}>
      {label ? <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span> : null}
      <select
        className="rounded-lg border border-outline-variant bg-surface-container-low px-md py-2 font-label-md text-label-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-secondary/20"
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

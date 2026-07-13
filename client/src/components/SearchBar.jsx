export default function SearchBar({ placeholder = "Search", value, onChange }) {
  return (
    <label className="relative block w-full">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
      <input
        className="w-full rounded-full border border-outline-variant bg-surface-container-low py-2 pl-10 pr-lg font-label-md text-label-md outline-none transition-all focus:border-primary focus:ring-2 focus:ring-secondary/20"
        onChange={onChange}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  );
}

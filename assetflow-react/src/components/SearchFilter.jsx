import React from 'react';

export default function SearchFilter({ search, setSearch, status, setStatus, onCreate }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      <div className="relative w-full md:w-80">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories..." className="w-full pl-10 pr-3 py-2 rounded-full border border-outline-variant bg-surface-container focus:ring-2 focus:ring-primary/20 outline-none" />
      </div>

      <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-lg border border-outline-variant px-3 py-2 bg-surface-container">
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <div className="ml-auto">
        <button onClick={onCreate} className="bg-primary text-on-primary px-4 py-2 rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined">add</span> Create New Category
        </button>
      </div>
    </div>
  );
}

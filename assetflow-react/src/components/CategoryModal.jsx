import React from 'react';

export default function CategoryModal({ open, onClose, onSave, initial = {} }) {
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSubmit} className="bg-surface rounded-lg p-lg w-full max-w-md">
        <h3 className="font-headline-md mb-md">Create / Edit Category</h3>
        <div className="space-y-md">
          <div>
            <label className="text-label-sm">Name</label>
            <input defaultValue={initial.name || ''} name="name" className="w-full mt-1 p-2 rounded border border-outline-variant" />
          </div>
          <div>
            <label className="text-label-sm">Description</label>
            <textarea defaultValue={initial.desc || ''} name="desc" className="w-full mt-1 p-2 rounded border border-outline-variant" />
          </div>
        </div>
        <div className="mt-md flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-primary text-on-primary">Save</button>
        </div>
      </form>
    </div>
  );
}

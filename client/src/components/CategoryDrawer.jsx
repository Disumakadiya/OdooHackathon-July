import React from 'react';

export default function CategoryDrawer({ open, onClose, category }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex">
      <div className="flex-1" onClick={onClose} />
      <aside className="w-full md:w-96 bg-surface p-lg border-l border-outline-variant overflow-auto">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-label-sm text-on-surface-variant">Category</p>
            <h3 className="font-headline-md text-primary">{category?.name}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-on-surface-variant">Close</button>
        </div>

        <div className="mt-md space-y-md">
          <p className="text-body-md text-on-surface-variant">{category?.desc}</p>

          <div className="bg-surface-container-lowest rounded-lg p-md border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant">Total Assets</p>
            <h4 className="font-headline-md text-primary">{category?.total}</h4>
          </div>

          <div className="bg-surface-container-lowest rounded-lg p-md border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant">Last Audit</p>
            <h4 className="font-label-md">{category?.lastAudit}</h4>
          </div>

          <div>
            <p className="text-label-sm text-on-surface-variant">Asset Distribution</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="bg-primary/10 rounded p-2 text-center">Laptops<br/><strong>420</strong></div>
              <div className="bg-secondary/10 rounded p-2 text-center">Monitors<br/><strong>320</strong></div>
              <div className="bg-tertiary/10 rounded p-2 text-center">Peripherals<br/><strong>508</strong></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

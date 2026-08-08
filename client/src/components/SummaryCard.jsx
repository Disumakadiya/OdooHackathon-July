import React from 'react';

export default function SummaryCard({ title, value, hint }) {
  return (
    <div className="bg-surface-container-lowest rounded-lg p-md border border-outline-variant ambient-shadow">
      <p className="text-label-sm text-on-surface-variant">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <h3 className="font-headline-md text-headline-md text-primary">{value}</h3>
        {hint && <span className="text-label-sm text-on-surface-variant">{hint}</span>}
      </div>
    </div>
  );
}

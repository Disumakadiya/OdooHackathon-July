export default function AssetCard({ asset, onView, onAllocate, onTransfer, onReturn }) {
  return (
    <div className="h-full rounded-lg border border-outline-variant bg-surface p-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-outline">{asset.assetTag}</p>
          <h3 className="mt-1 text-2xl font-bold text-primary">{asset.name}</h3>
          <p className="mt-1 text-on-surface-variant">{asset.category}</p>
        </div>
        <StatusBadge status={asset.status} />
      </div>
      <p className="mt-4 text-sm text-on-surface-variant">{asset.description}</p>
      <div className="mt-5 space-y-2 text-sm text-on-surface">
        <p><span className="font-bold">Location:</span> {asset.location}</p>
        <p><span className="font-bold">Assigned:</span> {asset.assignedEmployee}</p>
        <p><span className="font-bold">Updated:</span> {asset.lastUpdated}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary" type="button" onClick={() => onView(asset)}>
          View Details
        </button>
        <button className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-primary" type="button" onClick={() => onAllocate(asset)}>
          Allocate Asset
        </button>
        <button className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-primary" type="button" onClick={() => onTransfer(asset)}>
          Transfer Asset
        </button>
        <button className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-on-surface" type="button" onClick={() => onReturn(asset)}>
          Return Asset
        </button>
      </div>
    </div>
  );
}
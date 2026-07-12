import Modal from "./Modal";
import StatusBadge from "./StatusBadge";

export default function AssetDetailDrawer({ asset, open, onClose, onAllocate, onTransfer, onReturn, onTransferRequest }) {
  if (!asset) {
    return null;
  }

  const hasAllocation = asset.status === "Allocated";

  return (
    <Modal open={open} onClose={onClose} size="xl" title={`Asset Details • ${asset.assetTag}`}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-outline">{asset.category}</p>
                <h3 className="mt-1 font-headline-lg text-headline-lg text-primary">{asset.name}</h3>
                <p className="mt-1 text-on-surface-variant">{asset.description}</p>
              </div>
              <StatusBadge status={asset.status} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Asset Tag", asset.assetTag],
                ["Serial Number", asset.serialNumber],
                ["QR Code", asset.qrCode],
                ["Assigned Employee", asset.assignedEmployee],
                ["Department", asset.department],
                ["Location", asset.location],
                ["Last Updated", asset.lastUpdated],
                ["Condition", asset.condition],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-outline-variant bg-surface p-4">
                  <p className="text-xs uppercase tracking-wide text-outline">{label}</p>
                  <p className="mt-1 font-label-md text-label-md text-on-surface">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <h4 className="font-headline-md text-headline-md text-primary">Asset History</h4>
            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-2 text-sm font-bold text-on-surface">Allocation History</p>
                <div className="space-y-3">
                  {asset.allocationHistory.map((entry) => (
                    <div key={entry.id} className="rounded-xl border border-outline-variant bg-surface p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-label-md text-label-md text-on-surface">{entry.action}</p>
                        <span className="text-xs text-outline">{entry.date}</span>
                      </div>
                      <p className="mt-1 text-sm text-on-surface-variant">{entry.details}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-on-surface">Maintenance History</p>
                <div className="space-y-3">
                  {asset.maintenanceHistory.map((entry) => (
                    <div key={entry.id} className="rounded-xl border border-outline-variant bg-surface p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-label-md text-label-md text-on-surface">{entry.action}</p>
                        <StatusBadge status={entry.status} />
                      </div>
                      <p className="mt-1 text-sm text-on-surface-variant">{entry.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {hasAllocation ? (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
              <p className="font-bold">This asset is already allocated.</p>
              <p className="mt-1 text-sm">Use transfer request instead of allocation to keep the ownership history intact.</p>
              <button
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 font-label-md text-white transition-colors hover:bg-amber-700"
                onClick={onTransferRequest}
                type="button"
              >
                Transfer Request
              </button>
            </div>
          ) : null}

          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
            <h4 className="font-headline-md text-headline-md text-primary">Asset Statistics</h4>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Usage Days", asset.stats.usageDays],
                ["Moves", asset.stats.moves],
                ["Maintenance", asset.stats.maintenance],
                ["Open Issues", asset.stats.openIssues],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-outline-variant bg-surface p-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-outline">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface p-5">
            <h4 className="font-headline-md text-headline-md text-primary">Quick Actions</h4>
            <div className="mt-4 grid gap-3">
              <button className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-2 font-label-md text-label-md font-bold text-on-secondary transition-colors hover:opacity-90" onClick={() => onAllocate(asset)} type="button">
                Allocate Asset
              </button>
              <button className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-label-md text-label-md font-bold text-on-primary transition-colors hover:opacity-90" onClick={() => onTransfer(asset)} type="button">
                Transfer Asset
              </button>
              <button className="inline-flex items-center justify-center rounded-lg border border-outline-variant px-4 py-2 font-label-md text-label-md text-primary transition-colors hover:bg-surface-container-low" onClick={() => onReturn(asset)} type="button">
                Return Asset
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AssetTable from "../../components/AssetTable";
import Button from "../../components/Button";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import { useAssets } from "../../context/AssetContext";

const statuses = ["All", "Available", "Allocated", "Under Maintenance", "Retired"];

export default function AssetflowAssetDirectory() {
  const { assets, loading, error, editAsset, removeAsset, refreshAssets } = useAssets();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    document.title = "AssetFlow | Asset Directory";
  }, []);

  const filteredAssets = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesStatus = status === "All" || asset.status === status;
      const matchesSearch = !keyword || [
        asset.asset_tag,
        asset.asset_name,
        asset.category_name,
        asset.location,
      ].filter(Boolean).join(" ").toLowerCase().includes(keyword);
      return matchesStatus && matchesSearch;
    });
  }, [assets, search, status]);

  const startEdit = (asset) => {
    setActionError("");
    setEditingId(asset.id);
    setEditForm({
      asset_name: asset.asset_name || "",
      status: asset.status || "Available",
      location: asset.location || "",
      cost: asset.cost ?? "",
      purchase_date: asset.purchase_date ? String(asset.purchase_date).slice(0, 10) : "",
    });
  };

  const saveEdit = async (id) => {
    setActionError("");
    try {
      await editAsset(id, {
        ...editForm,
        cost: editForm.cost === "" ? null : Number(editForm.cost),
      });
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setActionError(err.message || "Failed to update asset.");
    }
  };

  const deleteAsset = async (asset) => {
    setActionError("");
    const confirmed = window.confirm(`Delete ${asset.asset_tag} - ${asset.asset_name}?`);
    if (!confirmed) return;
    try {
      await removeAsset(asset.id);
    } catch (err) {
      setActionError(err.message || "Failed to delete asset.");
    }
  };

  const fieldClass = "w-full min-w-32 rounded-lg border border-outline-variant bg-surface px-3 py-2 text-on-surface outline-none focus:border-primary";

  const columns = [
    { key: "asset_tag", label: "Tag" },
    {
      key: "asset_name",
      label: "Asset",
      render: (asset) => editingId === asset.id ? (
        <input className={fieldClass} value={editForm.asset_name} onChange={(event) => setEditForm((current) => ({ ...current, asset_name: event.target.value }))} />
      ) : asset.asset_name,
    },
    { key: "category_name", label: "Category", render: (asset) => asset.category_name || "Uncategorized" },
    {
      key: "status",
      label: "Status",
      render: (asset) => editingId === asset.id ? (
        <select className={fieldClass} value={editForm.status} onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value }))}>
          {statuses.filter((item) => item !== "All").map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      ) : <StatusBadge status={asset.status} />,
    },
    {
      key: "location",
      label: "Location",
      render: (asset) => editingId === asset.id ? (
        <input className={fieldClass} value={editForm.location} onChange={(event) => setEditForm((current) => ({ ...current, location: event.target.value }))} />
      ) : asset.location || "-",
    },
    {
      key: "cost",
      label: "Cost",
      render: (asset) => editingId === asset.id ? (
        <input className={fieldClass} min="0" step="0.01" type="number" value={editForm.cost} onChange={(event) => setEditForm((current) => ({ ...current, cost: event.target.value }))} />
      ) : asset.cost ?? "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (asset) => editingId === asset.id ? (
        <div className="flex gap-xs">
          <button className="rounded-lg bg-primary px-3 py-2 font-label-sm text-label-sm font-bold text-white" type="button" onClick={() => saveEdit(asset.id)}>Save</button>
          <button className="rounded-lg border border-outline-variant px-3 py-2 font-label-sm text-label-sm font-bold text-on-surface" type="button" onClick={() => setEditingId(null)}>Cancel</button>
        </div>
      ) : (
        <div className="flex gap-xs">
          <button className="rounded-lg border border-outline-variant px-3 py-2 font-label-sm text-label-sm font-bold text-primary" type="button" onClick={() => startEdit(asset)}>Edit</button>
          <button className="rounded-lg border border-error/40 px-3 py-2 font-label-sm text-label-sm font-bold text-error" type="button" onClick={() => deleteAsset(asset)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-surface-container-low px-lg py-xl">
      <div className="mx-auto max-w-max-width space-y-lg">
        <header className="flex flex-col gap-md lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Assets</p>
            <h1 className="font-headline-lg text-headline-lg text-primary">Asset Directory</h1>
          </div>
          <div className="flex flex-wrap gap-sm">
            <button className="rounded-lg border border-outline-variant bg-surface px-md py-sm font-label-md text-label-md font-bold text-primary" type="button" onClick={refreshAssets}>
              Refresh
            </button>
            <Link to="/assetflow_asset_registration">
              <Button>
                <span className="material-symbols-outlined mr-sm text-[18px]">add</span>
                Register Asset
              </Button>
            </Link>
          </div>
        </header>

        <Card>
          <div className="grid gap-md lg:grid-cols-[1fr_220px]">
            <input
              className="rounded-lg border border-outline-variant bg-surface px-4 py-3 text-on-surface outline-none focus:border-primary"
              placeholder="Search by tag, name, category, or location"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select className="rounded-lg border border-outline-variant bg-surface px-4 py-3 text-on-surface outline-none focus:border-primary" value={status} onChange={(event) => setStatus(event.target.value)}>
              {statuses.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </Card>

        {error ? <p className="rounded-lg border border-error/30 bg-error/10 px-md py-sm text-error">{error}</p> : null}
        {actionError ? <p className="rounded-lg border border-error/30 bg-error/10 px-md py-sm text-error">{actionError}</p> : null}

        <Card title="Assets" subtitle={`${filteredAssets.length} visible of ${assets.length} total`}>
          {loading ? (
            <p className="py-lg text-center text-on-surface-variant">Loading assets...</p>
          ) : (
            <AssetTable columns={columns} rows={filteredAssets} emptyMessage="No assets found." />
          )}
        </Card>
      </div>
    </main>
  );
}

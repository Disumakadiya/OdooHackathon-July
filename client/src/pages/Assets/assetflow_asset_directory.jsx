import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import StatusBadge from "../../components/StatusBadge";
import { useAssets } from "../../context/AssetContext";

const inputClass = "w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const editableFields = ["name", "serialNumber", "category", "department", "location", "assignedEmployee", "condition", "description"];

export default function AssetflowAssetDirectory() {
  const navigate = useNavigate();
  const { assets, loading, error, refreshAssets, editAsset, removeAsset, allocate, transfer, doReturn } = useAssets();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [editing, setEditing] = useState(null);
  const [actionAsset, setActionAsset] = useState(null);
  const [actionType, setActionType] = useState("");
  const [actionValue, setActionValue] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredAssets = useMemo(() => {
    const term = search.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesStatus = status === "All" || asset.status === status;
      const matchesTerm = !term || [asset.assetTag, asset.name, asset.serialNumber, asset.category, asset.department, asset.location, asset.assignedEmployee]
        .some((value) => String(value || "").toLowerCase().includes(term));
      return matchesStatus && matchesTerm;
    });
  }, [assets, search, status]);

  const openEdit = (asset) => {
    setEditing({ ...asset });
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await editAsset(editing.id, editing);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const deleteSelected = async (asset) => {
    if (!window.confirm(`Delete ${asset.assetTag}?`)) return;
    await removeAsset(asset.id);
  };

  const openAction = (asset, type) => {
    setActionAsset(asset);
    setActionType(type);
    setActionValue("");
  };

  const runAction = async () => {
    if (!actionAsset) return;
    setSaving(true);
    try {
      if (actionType === "allocate") await allocate(actionAsset.id, { assignedEmployee: actionValue });
      if (actionType === "transfer") await transfer(actionAsset.id, { department: actionValue });
      if (actionType === "return") await doReturn(actionAsset.id, { condition: actionValue || "Good" });
      if (actionType === "maintenance") await editAsset(actionAsset.id, { ...actionAsset, status: "Under Maintenance" });
      setActionAsset(null);
      setActionType("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-container-low px-4 py-6 text-on-surface sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-label-md text-label-md text-primary">Assets</p>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Asset Directory</h1>
            <p className="mt-1 text-on-surface-variant">Manage asset records, lifecycle states, and inventory search.</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-surface text-primary ring-1 ring-outline-variant hover:bg-surface-container" onClick={refreshAssets}>Refresh</Button>
            <Button onClick={() => navigate("/assetflow_asset_registration")}>Register Asset</Button>
          </div>
        </div>

        <section className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className={`${inputClass} pl-10`}
              placeholder="Search by tag, name, serial, category, department, location, or assignee"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
            {["All", "Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </section>

        <section className="rounded-lg border border-outline-variant bg-surface shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">Loading assets...</div>
          ) : error ? (
            <div className="p-8 text-center text-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    {["Tag", "Asset", "Status", "Department", "Location", "Assigned", "Actions"].map((heading) => (
                      <th className="px-4 py-3 text-left font-label-md text-label-md text-on-surface-variant" key={heading}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low" key={asset.id}>
                      <td className="px-4 py-3 font-label-md text-label-md text-primary">{asset.assetTag}</td>
                      <td className="px-4 py-3">
                        <p className="font-label-md text-label-md text-on-surface">{asset.name}</p>
                        <p className="text-sm text-on-surface-variant">{asset.category} {asset.serialNumber ? `• ${asset.serialNumber}` : ""}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={asset.status} /></td>
                      <td className="px-4 py-3 text-on-surface">{asset.department}</td>
                      <td className="px-4 py-3 text-on-surface">{asset.location}</td>
                      <td className="px-4 py-3 text-on-surface">{asset.assignedEmployee}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <SmallButton onClick={() => openEdit(asset)}>Edit</SmallButton>
                          <SmallButton onClick={() => openAction(asset, "allocate")}>Allocate</SmallButton>
                          <SmallButton onClick={() => openAction(asset, "maintenance")}>Maintenance</SmallButton>
                          <SmallButton onClick={() => openAction(asset, "return")}>Return</SmallButton>
                          <SmallButton danger onClick={() => deleteSelected(asset)}>Delete</SmallButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td className="px-4 py-8 text-center text-on-surface-variant" colSpan={7}>No assets match the current filters.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <Modal open={Boolean(editing)} title="Edit Asset" onClose={() => setEditing(null)}>
        {editing ? (
          <div className="grid gap-4 md:grid-cols-2">
            {editableFields.map((field) => (
              <label className={field === "description" ? "md:col-span-2" : ""} key={field}>
                <span className="mb-1 block font-label-md text-label-md capitalize text-on-surface">{field.replace(/([A-Z])/g, " $1")}</span>
                {field === "condition" ? (
                  <select className={inputClass} value={editing[field]} onChange={(event) => setEditing((prev) => ({ ...prev, [field]: event.target.value }))}>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Damaged</option>
                  </select>
                ) : field === "description" ? (
                  <textarea className={`${inputClass} min-h-24`} value={editing[field] || ""} onChange={(event) => setEditing((prev) => ({ ...prev, [field]: event.target.value }))} />
                ) : (
                  <input className={inputClass} value={editing[field] || ""} onChange={(event) => setEditing((prev) => ({ ...prev, [field]: event.target.value }))} />
                )}
              </label>
            ))}
            <div className="flex justify-end gap-3 md:col-span-2">
              <Button className="bg-surface text-primary ring-1 ring-outline-variant hover:bg-surface-container" onClick={() => setEditing(null)}>Cancel</Button>
              <Button disabled={saving} onClick={saveEdit}>Save Changes</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal open={Boolean(actionAsset)} title="Lifecycle Action" onClose={() => setActionAsset(null)} size="md">
        {actionAsset ? (
          <div className="space-y-4">
            <div>
              <p className="font-label-md text-label-md text-on-surface">{actionAsset.assetTag} • {actionAsset.name}</p>
              <p className="text-sm text-on-surface-variant">Current status: {actionAsset.status}</p>
            </div>
            {actionType === "allocate" ? <ActionInput label="Assigned employee" value={actionValue} onChange={setActionValue} /> : null}
            {actionType === "transfer" ? <ActionInput label="New department" value={actionValue} onChange={setActionValue} /> : null}
            {actionType === "return" ? (
              <label>
                <span className="mb-1 block font-label-md text-label-md text-on-surface">Return condition</span>
                <select className={inputClass} value={actionValue} onChange={(event) => setActionValue(event.target.value)}>
                  <option value="">Good</option>
                  <option>Fair</option>
                  <option>Damaged</option>
                </select>
              </label>
            ) : null}
            {actionType === "maintenance" ? <p className="text-on-surface-variant">Move this asset to Under Maintenance?</p> : null}
            <div className="flex justify-end gap-3">
              <Button className="bg-surface text-primary ring-1 ring-outline-variant hover:bg-surface-container" onClick={() => setActionAsset(null)}>Cancel</Button>
              <Button disabled={saving} onClick={runAction}>Confirm</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </main>
  );
}

function SmallButton({ children, danger = false, ...props }) {
  return (
    <button
      className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${danger ? "border-error/30 text-error hover:bg-error/10" : "border-outline-variant text-primary hover:bg-surface-container"}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

function ActionInput({ label, value, onChange }) {
  return (
    <label>
      <span className="mb-1 block font-label-md text-label-md text-on-surface">{label}</span>
      <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

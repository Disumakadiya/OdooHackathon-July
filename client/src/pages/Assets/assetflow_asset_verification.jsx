import { useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../components/StatusBadge";
import Table from "../../components/Table";
import AssetActionMenu from "../../components/AssetActionMenu";
import AssetDetailDrawer from "../../components/AssetDetailDrawer";
import { useAssets } from "../../context/AssetContext";

const statusOptions = ["All", "Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"];
const departmentOptions = ["All", "IT", "HR", "Finance", "Operations", "Sales"];
const locationOptions = ["All", "Head Office", "HQ-IT", "HQ-Sales", "Warehouse A", "Warehouse B", "Branch Office", "Repair Center"];
const conditionOptions = ["Good", "Fair", "Damaged"];

const emptyForm = {
  name: "",
  serialNumber: "",
  qrCode: "",
  category: "",
  status: "Available",
  department: "",
  location: "",
  assignedEmployee: "",
  condition: "Good",
  description: "",
};

export default function AssetflowAssetVerification() {
  const { assets, loading, error, addAsset, editAsset, removeAsset, allocate, transfer, doReturn } = useAssets();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "All", status: "All", department: "All", location: "All" });

  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);

  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [actionAssetId, setActionAssetId] = useState(null);
  const [actionType, setActionType] = useState("");
  const [actionValue, setActionValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    document.title = "AssetFlow | Asset Verification";
  }, []);

  const selectedAsset = useMemo(
    () => (selectedAssetId ? assets.find((a) => a.id === selectedAssetId) || null : null),
    [assets, selectedAssetId],
  );
  const actionAsset = useMemo(
    () => (actionAssetId ? assets.find((a) => a.id === actionAssetId) || null : null),
    [assets, actionAssetId],
  );

  const categoryOptions = useMemo(() => {
    const fromData = [...new Set(assets.map((a) => a.category).filter(Boolean))];
    return ["All", ...fromData.sort((a, b) => a.localeCompare(b))];
  }, [assets]);

  const filteredAssets = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesSearch =
        !keyword ||
        [asset.assetTag, asset.name, asset.serialNumber, asset.qrCode, asset.assignedEmployee].join(" ").toLowerCase().includes(keyword);
      const matchesCategory = filters.category === "All" || asset.category === filters.category;
      const matchesStatus = filters.status === "All" || asset.status === filters.status;
      const matchesDepartment = filters.department === "All" || asset.department === filters.department;
      const matchesLocation = filters.location === "All" || asset.location === filters.location;
      return matchesSearch && matchesCategory && matchesStatus && matchesDepartment && matchesLocation;
    });
  }, [assets, filters, search]);

  const summary = useMemo(
    () => ({
      totalCategories: new Set(assets.map((asset) => asset.category)).size,
      totalAssets: assets.length,
      active: assets.filter((asset) => ["Available", "Allocated", "Reserved"].includes(asset.status)).length,
      inactive: assets.filter((asset) => ["Under Maintenance", "Lost", "Retired", "Disposed"].includes(asset.status)).length,
    }),
    [assets],
  );

  const openView = (asset) => {
    setSelectedAssetId(asset.id);
    setViewOpen(true);
  };

  const openCreateModal = () => {
    setForm({ ...emptyForm });
    setFormError("");
    setCreateOpen(true);
  };

  const openEditModal = (asset) => {
    setForm({ ...asset });
    setFormError("");
    setEditOpen(true);
  };

  const openDeleteModal = (asset) => {
    setSelectedAssetId(asset.id);
    setFormError("");
    setDeleteOpen(true);
  };

  const openAction = (asset, type) => {
    setActionAssetId(asset.id);
    setActionType(type);
    setActionValue(type === "return" ? "Good" : "");
    setFormError("");
    setActionOpen(true);
  };

  const saveForm = async () => {
    if (!form.name.trim() || !form.category.trim() || !form.department.trim() || !form.location.trim()) {
      setFormError("Asset name, category, department, and location are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (form.id && assets.some((a) => a.id === form.id)) {
        await editAsset(form.id, form);
      } else {
        await addAsset({ ...form, status: "Available" });
      }
      setCreateOpen(false);
      setEditOpen(false);
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.message || "Failed to save asset");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedAsset) return;
    setSaving(true);
    setFormError("");
    try {
      await removeAsset(selectedAsset.id);
      setDeleteOpen(false);
      setSelectedAssetId(null);
    } catch (err) {
      setFormError(err.message || "Failed to delete asset");
    } finally {
      setSaving(false);
    }
  };

  const runAction = async () => {
    if (!actionAsset) return;
    setSaving(true);
    setFormError("");
    try {
      if (actionType === "allocate") {
        if (!actionValue.trim()) {
          setFormError("An employee name is required to allocate the asset.");
          return;
        }
        await allocate(actionAsset.id, { assignedEmployee: actionValue });
      } else if (actionType === "transfer") {
        await transfer(actionAsset.id, { department: actionValue });
      } else if (actionType === "return") {
        await doReturn(actionAsset.id, { condition: actionValue || "Good" });
      }
      setActionOpen(false);
      setActionAssetId(null);
      setActionType("");
    } catch (err) {
      setFormError(err.message || "Action failed");
    } finally {
      setSaving(false);
    }
  };

  const updateFormField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formError) setFormError("");
  };

  const modalField = "w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 font-label-md text-label-md outline-none transition-colors focus:border-primary";

  return (
    <div className="min-h-screen bg-surface-container-low px-4 py-6 text-on-surface sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Asset Verification</h2>
            <p className="mt-xs font-label-md text-label-md text-on-surface-variant">Search, verify, and manage enterprise assets.</p>
          </div>
          <Button onClick={openCreateModal}>
            <span className="material-symbols-outlined mr-sm text-[18px]">add</span>
            Register Asset
          </Button>
        </header>

        <section className="grid grid-cols-1 gap-md sm:grid-cols-2 xl:grid-cols-4">
          <Card><p className="text-label-sm text-on-surface-variant">Total Categories</p><p className="mt-2 text-3xl font-bold text-primary">{summary.totalCategories}</p></Card>
          <Card><p className="text-label-sm text-on-surface-variant">Total Assets</p><p className="mt-2 text-3xl font-bold text-primary">{summary.totalAssets}</p></Card>
          <Card><p className="text-label-sm text-on-surface-variant">Active</p><p className="mt-2 text-3xl font-bold text-secondary">{summary.active}</p></Card>
          <Card><p className="text-label-sm text-on-surface-variant">Inactive</p><p className="mt-2 text-3xl font-bold text-error">{summary.inactive}</p></Card>
        </section>

        <section>
          <Card title="Asset Registry" subtitle="Search by asset tag, name, serial number, or assignee">
            <SearchBar placeholder="Search assets" value={search} onChange={(event) => setSearch(event.target.value)} />
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ["category", categoryOptions],
                ["status", statusOptions],
                ["department", departmentOptions],
                ["location", locationOptions],
              ].map(([key, options]) => (
                <select
                  key={key}
                  className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-label-md text-label-md text-on-surface outline-none transition-colors focus:border-primary"
                  value={filters[key]}
                  onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </Card>
        </section>

        <section>
          <Card title="Asset Table" subtitle="Create, view, edit, and delete assets">
            {loading ? (
              <div className="p-8 text-center text-on-surface-variant">Loading assets...</div>
            ) : error ? (
              <div className="p-8 text-center text-error">{error}</div>
            ) : (
              <Table
                columns={[
                  {
                    key: "assetTag",
                    label: "Asset Tag",
                    render: (asset) => (
                      <button className="font-bold text-primary hover:underline" onClick={() => openView(asset)} type="button">
                        {asset.assetTag}
                      </button>
                    ),
                  },
                  { key: "name", label: "Name" },
                  { key: "category", label: "Category" },
                  { key: "status", label: "Status", render: (asset) => <StatusBadge status={asset.status} /> },
                  { key: "location", label: "Location" },
                  { key: "assignedEmployee", label: "Assigned Employee" },
                  { key: "lastUpdated", label: "Last Updated" },
                  {
                    key: "actions",
                    label: "Actions",
                    render: (asset) => (
                      <AssetActionMenu
                        onView={() => openView(asset)}
                        onEdit={() => openEditModal(asset)}
                        onDelete={() => openDeleteModal(asset)}
                      />
                    ),
                  },
                ]}
                rows={filteredAssets}
                emptyMessage="No assets match the selected filters."
              />
            )}
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-md xl:grid-cols-3">
          {filteredAssets.slice(0, 3).map((asset) => (
            <Card key={asset.id} className="h-full">
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
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary" type="button" onClick={() => openView(asset)}>
                  View Details
                </button>
                <button className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-primary" type="button" onClick={() => openAction(asset, "allocate")}>
                  Allocate Asset
                </button>
                <button className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-primary" type="button" onClick={() => openAction(asset, "transfer")}>
                  Transfer Asset
                </button>
                <button className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-on-surface" type="button" onClick={() => openAction(asset, "return")}>
                  Return Asset
                </button>
              </div>
            </Card>
          ))}
        </section>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Register Asset" size="lg">
        <AssetForm form={form} onChange={updateFormField} isEdit={false} error={formError} />
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-lg border border-outline-variant px-4 py-2 font-bold text-on-surface" onClick={() => setCreateOpen(false)} type="button">Cancel</button>
          <Button disabled={saving} onClick={saveForm}>{saving ? "Saving..." : "Save Asset"}</Button>
        </div>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Asset" size="lg">
        <AssetForm form={form} onChange={updateFormField} isEdit error={formError} />
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-lg border border-outline-variant px-4 py-2 font-bold text-on-surface" onClick={() => setEditOpen(false)} type="button">Cancel</button>
          <Button disabled={saving} onClick={saveForm}>{saving ? "Saving..." : "Update Asset"}</Button>
        </div>
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Asset" size="sm">
        <p className="text-on-surface-variant">
          This will permanently remove <span className="font-bold text-on-surface">{selectedAsset?.name}</span> ({selectedAsset?.assetTag}) and its history.
        </p>
        {formError ? <p className="mt-3 text-sm text-error">{formError}</p> : null}
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-lg border border-outline-variant px-4 py-2 font-bold text-on-surface" onClick={() => setDeleteOpen(false)} type="button">Cancel</button>
          <button className="rounded-lg bg-error px-4 py-2 font-bold text-white disabled:opacity-50" disabled={saving} onClick={confirmDelete} type="button">
            {saving ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>

      <Modal open={actionOpen} onClose={() => setActionOpen(false)} title="Lifecycle Action" size="md">
        {actionAsset ? (
          <div className="space-y-4">
            <div>
              <p className="font-label-md text-label-md text-on-surface">{actionAsset.assetTag} • {actionAsset.name}</p>
              <p className="text-sm text-on-surface-variant">Current status: {actionAsset.status}</p>
            </div>
            {actionType === "allocate" ? (
              <label className="block">
                <span className="mb-1 block font-label-md text-label-md text-on-surface">Assigned employee</span>
                <input className={modalField} value={actionValue} onChange={(event) => { setActionValue(event.target.value); if (formError) setFormError(""); }} />
              </label>
            ) : null}
            {actionType === "transfer" ? (
              <label className="block">
                <span className="mb-1 block font-label-md text-label-md text-on-surface">New department</span>
                <input className={modalField} value={actionValue} onChange={(event) => { setActionValue(event.target.value); if (formError) setFormError(""); }} />
              </label>
            ) : null}
            {actionType === "return" ? (
              <label className="block">
                <span className="mb-1 block font-label-md text-label-md text-on-surface">Return condition</span>
                <select className={modalField} value={actionValue} onChange={(event) => { setActionValue(event.target.value); if (formError) setFormError(""); }}>
                  {conditionOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            ) : null}
            {formError ? <p className="text-sm text-error">{formError}</p> : null}
            <div className="flex justify-end gap-3">
              <button className="rounded-lg border border-outline-variant px-4 py-2 font-bold text-on-surface" onClick={() => setActionOpen(false)} type="button">Cancel</button>
              <Button disabled={saving} onClick={runAction}>{saving ? "Working..." : "Confirm"}</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <AssetDetailDrawer
        asset={selectedAsset}
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        onTransferRequest={() => openAction(selectedAsset, "transfer")}
        onAllocate={() => openAction(selectedAsset, "allocate")}
        onTransfer={() => openAction(selectedAsset, "transfer")}
        onReturn={() => openAction(selectedAsset, "return")}
      />
    </div>
  );
}

function AssetForm({ form, onChange, isEdit = false, error = "" }) {
  const inputClass = "w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-3 font-heading text-heading outline-none transition-colors focus:border-primary";
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {isEdit ? (
        <FormField label="Asset Tag">
          <input className={inputClass} value={form.assetTag || ""} disabled />
        </FormField>
      ) : null}
      <FormField label="Asset Name" error={error.includes("name") ? error : ""}>
        <input className={inputClass} value={form.name || ""} onChange={(e) => onChange("name", e.target.value)} />
      </FormField>
      <FormField label="Serial Number">
        <input className={inputClass} value={form.serialNumber || ""} onChange={(e) => onChange("serialNumber", e.target.value)} />
      </FormField>
      <FormField label="Category" error={error.includes("category") ? error : ""}>
        <input className={inputClass} value={form.category || ""} onChange={(e) => onChange("category", e.target.value)} />
      </FormField>
      <FormField label="QR Code">
        <input className={inputClass} value={form.qrCode || ""} onChange={(e) => onChange("qrCode", e.target.value)} />
      </FormField>
      <FormField label="Department" error={error.includes("department") ? error : ""}>
        <input className={inputClass} value={form.department || ""} onChange={(e) => onChange("department", e.target.value)} />
      </FormField>
      <FormField label="Location" error={error.includes("location") ? error : ""}>
        <input className={inputClass} value={form.location || ""} onChange={(e) => onChange("location", e.target.value)} />
      </FormField>
      <FormField label="Status">
        <select className={inputClass} value={form.status || "Available"} onChange={(e) => onChange("status", e.target.value)}>
          {statusOptions.slice(1).map((option) => <option key={option}>{option}</option>)}
        </select>
      </FormField>
      <FormField label="Condition">
        <select className={inputClass} value={form.condition || "Good"} onChange={(e) => onChange("condition", e.target.value)}>
          {conditionOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </FormField>
      <FormField label="Assigned Employee">
        <input className={inputClass} value={form.assignedEmployee || ""} onChange={(e) => onChange("assignedEmployee", e.target.value)} />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Description">
          <textarea className={`${inputClass} min-h-24`} value={form.description || ""} onChange={(e) => onChange("description", e.target.value)} />
        </FormField>
      </div>
    </div>
  );
}

function FormField({ label, error = "", children }) {
  return (
    <label className="block">
      <span className="mb-1 block font-label-md text-label-md text-on-surface">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-sm text-error">{error}</span> : null}
    </label>
  );
}
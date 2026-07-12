import { useEffect, useMemo, useState } from "react";
import { assetVerificationData } from "../../assets/assetVerificationData";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import SearchBar from "../../components/SearchBar";
import Sidebar from "../../components/Sidebar";
import StatusBadge from "../../components/StatusBadge";
import Table from "../../components/Table";
import AssetActionMenu from "../../components/AssetActionMenu";
import AssetDetailDrawer from "../../components/AssetDetailDrawer";

const categoryOptions = ["All", "IT Equipment", "Furniture", "Vehicles", "Industrial Tools", "Office Equipment"];
const statusOptions = ["All", "Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"];
const departmentOptions = ["All", "IT", "HR", "Finance", "Operations"];
const locationOptions = ["All", "Head Office", "Warehouse A", "Warehouse B", "Branch Office"];

const initialForm = {
  assetTag: "",
  name: "",
  serialNumber: "",
  qrCode: "",
  category: "IT Equipment",
  status: "Available",
  department: "IT",
  location: "Head Office",
  assignedEmployee: "",
  lastUpdated: "Jul 12, 2026",
  condition: "Good",
  description: "",
};

export default function assetflow_asset_verification() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "All", status: "All", department: "All", location: "All" });
  const [assets, setAssets] = useState(assetVerificationData);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    document.title = "AssetFlow | Asset Verification";
  }, []);

  const filteredAssets = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesSearch =
        !keyword ||
        [asset.assetTag, asset.name, asset.serialNumber, asset.qrCode].join(" ").toLowerCase().includes(keyword);
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

  const openCreateModal = () => {
    setSelectedAsset(null);
    setForm(initialForm);
    setCreateOpen(true);
  };

  const openViewModal = (asset) => {
    setSelectedAsset(asset);
    setViewOpen(true);
  };

  const openEditModal = (asset) => {
    setSelectedAsset(asset);
    setForm({ ...asset });
    setEditOpen(true);
  };

  const openDeleteModal = (asset) => {
    setSelectedAsset(asset);
    setDeleteOpen(true);
  };

  const handleSaveAsset = () => {
    const nextAsset = {
      ...form,
      id: selectedAsset?.id ?? `ASSET-${Date.now()}`,
      allocationHistory: selectedAsset?.allocationHistory ?? [
        { id: 1, action: "Registered in system", date: "Jul 12, 2026", details: "Dummy registration created from the verification screen." },
      ],
      maintenanceHistory: selectedAsset?.maintenanceHistory ?? [
        { id: 1, action: "Initial setup", date: "Jul 12, 2026", status: "Completed", details: "No backend integration. Dummy data only." },
      ],
      stats: selectedAsset?.stats ?? { usageDays: 0, moves: 0, maintenance: 0, openIssues: 0 },
    };

    setAssets((current) => {
      const existingIndex = current.findIndex((asset) => asset.id === nextAsset.id);
      if (existingIndex >= 0) {
        const updated = [...current];
        updated[existingIndex] = nextAsset;
        return updated;
      }
      return [nextAsset, ...current];
    });

    setCreateOpen(false);
    setEditOpen(false);
    setSelectedAsset(null);
    setForm(initialForm);
  };

  const handleDeleteAsset = () => {
    setAssets((current) => current.filter((asset) => asset.id !== selectedAsset?.id));
    setDeleteOpen(false);
    setSelectedAsset(null);
  };

  const updateSelectedAsset = (status, actionLabel) => {
    if (!selectedAsset) {
      return;
    }

    const nextHistory = {
      id: Date.now(),
      action: actionLabel,
      date: "Jul 12, 2026",
      details: `Dummy ${actionLabel.toLowerCase()} recorded from Asset Verification.`,
    };

    setAssets((current) =>
      current.map((asset) => {
        if (asset.id !== selectedAsset.id) {
          return asset;
        }
        return {
          ...asset,
          status,
          lastUpdated: "Jul 12, 2026",
          allocationHistory: [nextHistory, ...asset.allocationHistory],
        };
      }),
    );
  };

  const handleTransferRequest = () => {
    updateSelectedAsset("Reserved", "Transfer Request Raised");
  };

  const columns = [
    {
      key: "assetTag",
      label: "Asset Tag",
      render: (asset) => (
        <button className="font-bold text-primary hover:underline" onClick={() => openViewModal(asset)} type="button">
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
          onView={() => openViewModal(asset)}
          onEdit={() => openEditModal(asset)}
          onDelete={() => openDeleteModal(asset)}
        />
      ),
    },
  ];

  const modalField = "w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 font-label-md text-label-md outline-none transition-colors focus:border-primary";

  return (
    <div className="font-body-md text-body-md">
      <Sidebar />

      <main className="min-h-screen md:ml-64">
        <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface/90 px-lg py-sm backdrop-blur">
          <div className="flex flex-col gap-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary">Asset Verification</h2>
              <p className="mt-xs font-label-md text-label-md text-on-surface-variant">Search, verify, and manage enterprise assets.</p>
            </div>
            <div className="flex items-center gap-sm">
              <button className="inline-flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container px-md py-sm font-label-md text-label-md text-primary transition-colors hover:bg-surface-container-high" type="button">
                <span className="material-symbols-outlined mr-sm text-[18px]">qr_code_scanner</span>
                Scan Asset
              </button>
              <Button onClick={openCreateModal}>
                <span className="material-symbols-outlined mr-sm text-[18px]">add</span>
                Register Asset
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-max-width space-y-xl p-lg pb-2xl">
          <section className="grid grid-cols-1 gap-md sm:grid-cols-2 xl:grid-cols-4">
            <Card><p className="text-label-sm text-on-surface-variant">Total Categories</p><p className="mt-2 text-3xl font-bold text-primary">{summary.totalCategories}</p></Card>
            <Card><p className="text-label-sm text-on-surface-variant">Total Assets</p><p className="mt-2 text-3xl font-bold text-primary">{summary.totalAssets}</p></Card>
            <Card><p className="text-label-sm text-on-surface-variant">Active</p><p className="mt-2 text-3xl font-bold text-secondary">{summary.active}</p></Card>
            <Card><p className="text-label-sm text-on-surface-variant">Inactive</p><p className="mt-2 text-3xl font-bold text-error">{summary.inactive}</p></Card>
          </section>

          <section>
            <Card title="Asset Registry" subtitle="Search by asset tag, name, serial number, or QR code">
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
            <Card title="Asset Table" subtitle="Responsive dummy data for the hackathon build">
              <Table columns={columns} rows={filteredAssets} emptyMessage="No assets match the selected filters." />
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
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary" type="button" onClick={() => openViewModal(asset)}>
                    View Details
                  </button>
                  <button className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-primary" type="button" onClick={() => { setSelectedAsset(asset); updateSelectedAsset("Allocated", "Allocate Asset"); }}>
                    Allocate Asset
                  </button>
                  <button className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-primary" type="button" onClick={() => { setSelectedAsset(asset); updateSelectedAsset("Reserved", "Transfer Asset"); }}>
                    Transfer Asset
                  </button>
                  <button className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-on-surface" type="button" onClick={() => { setSelectedAsset(asset); updateSelectedAsset("Available", "Return Asset"); }}>
                    Return Asset
                  </button>
                </div>
              </Card>
            ))}
          </section>
        </div>
      </main>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Register Asset" size="lg">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["assetTag", "Asset Tag"],
            ["name", "Asset Name"],
            ["serialNumber", "Serial Number"],
            ["qrCode", "QR Code"],
            ["assignedEmployee", "Assigned Employee"],
            ["lastUpdated", "Last Updated"],
          ].map(([key, label]) => (
            <label key={key} className="space-y-2">
              <span className="text-sm font-bold text-on-surface">{label}</span>
              <input className={modalField} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
            </label>
          ))}
          {[
            ["category", categoryOptions.slice(1)],
            ["status", statusOptions.slice(1)],
            ["department", departmentOptions.slice(1)],
            ["location", locationOptions.slice(1)],
            ["condition", ["Good", "Fair", "Damaged"]],
          ].map(([key, options]) => (
            <label key={key} className="space-y-2">
              <span className="text-sm font-bold text-on-surface">{key}</span>
              <select className={modalField} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold text-on-surface">Description</span>
            <textarea className={`${modalField} min-h-28`} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-lg border border-outline-variant px-4 py-2 font-bold text-on-surface" onClick={() => setCreateOpen(false)} type="button">
            Cancel
          </button>
          <Button onClick={handleSaveAsset}>Save Asset</Button>
        </div>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Asset" size="lg">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["assetTag", "Asset Tag"],
            ["name", "Asset Name"],
            ["serialNumber", "Serial Number"],
            ["qrCode", "QR Code"],
            ["assignedEmployee", "Assigned Employee"],
            ["lastUpdated", "Last Updated"],
          ].map(([key, label]) => (
            <label key={key} className="space-y-2">
              <span className="text-sm font-bold text-on-surface">{label}</span>
              <input className={modalField} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
            </label>
          ))}
          {[
            ["category", categoryOptions.slice(1)],
            ["status", statusOptions.slice(1)],
            ["department", departmentOptions.slice(1)],
            ["location", locationOptions.slice(1)],
            ["condition", ["Good", "Fair", "Damaged"]],
          ].map(([key, options]) => (
            <label key={key} className="space-y-2">
              <span className="text-sm font-bold text-on-surface">{key}</span>
              <select className={modalField} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold text-on-surface">Description</span>
            <textarea className={`${modalField} min-h-28`} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-lg border border-outline-variant px-4 py-2 font-bold text-on-surface" onClick={() => setEditOpen(false)} type="button">
            Cancel
          </button>
          <Button onClick={handleSaveAsset}>Update Asset</Button>
        </div>
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Asset" size="sm">
        <p className="text-on-surface-variant">
          This will remove <span className="font-bold text-on-surface">{selectedAsset?.name}</span> from the dummy dataset.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-lg border border-outline-variant px-4 py-2 font-bold text-on-surface" onClick={() => setDeleteOpen(false)} type="button">
            Cancel
          </button>
          <button className="rounded-lg bg-error px-4 py-2 font-bold text-white" onClick={handleDeleteAsset} type="button">
            Delete
          </button>
        </div>
      </Modal>

      <AssetDetailDrawer
        asset={selectedAsset}
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        onAllocate={(asset) => {
          setSelectedAsset(asset);
          updateSelectedAsset("Allocated", "Allocate Asset");
        }}
        onTransfer={(asset) => {
          setSelectedAsset(asset);
          updateSelectedAsset("Reserved", "Transfer Asset");
        }}
        onReturn={(asset) => {
          setSelectedAsset(asset);
          updateSelectedAsset("Available", "Return Asset");
        }}
        onTransferRequest={handleTransferRequest}
      />
    </div>
  );
}

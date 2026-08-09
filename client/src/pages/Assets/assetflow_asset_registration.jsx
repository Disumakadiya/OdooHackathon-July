import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { useAssets } from "../../context/AssetContext";

const initialForm = {
  asset_name: "",
  category_id: "",
  status: "Available",
  location: "",
  purchase_date: "",
  cost: "",
};

const statuses = ["Available", "Allocated", "Under Maintenance", "Retired"];

export default function AssetflowAssetRegistration() {
  const { addAsset } = useAssets();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "AssetFlow | Asset Registration";
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.asset_name.trim()) {
      setError("Asset name is required.");
      return;
    }

    if (form.cost !== "" && Number(form.cost) < 0) {
      setError("Cost cannot be negative.");
      return;
    }

    setSaving(true);
    try {
      await addAsset({
        ...form,
        asset_name: form.asset_name.trim(),
        category_id: form.category_id || null,
        location: form.location.trim(),
        cost: form.cost === "" ? 0 : Number(form.cost),
      });
      setForm(initialForm);
      navigate("/assetflow_asset_directory");
    } catch (err) {
      setError(err.message || "Failed to register asset.");
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = "w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary";

  return (
    <main className="min-h-screen bg-surface-container-low px-lg py-xl">
      <div className="mx-auto max-w-4xl space-y-lg">
        <header className="flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Assets</p>
            <h1 className="font-headline-lg text-headline-lg text-primary">Asset Registration</h1>
          </div>
          <Link className="inline-flex items-center justify-center rounded-lg border border-outline-variant bg-surface px-md py-sm font-label-md text-label-md font-bold text-primary" to="/assetflow_asset_directory">
            View Directory
          </Link>
        </header>

        <Card title="Register Asset" subtitle="Asset tags are generated automatically in AF-0001 format.">
          <form className="grid gap-md sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="space-y-xs sm:col-span-2">
              <span className="font-label-md text-label-md font-bold text-on-surface">Asset Name</span>
              <input className={fieldClass} value={form.asset_name} onChange={(event) => updateField("asset_name", event.target.value)} placeholder="Dell Latitude 7440" />
            </label>

            <label className="space-y-xs">
              <span className="font-label-md text-label-md font-bold text-on-surface">Category ID</span>
              <input className={fieldClass} inputMode="numeric" value={form.category_id} onChange={(event) => updateField("category_id", event.target.value)} placeholder="Optional" />
            </label>

            <label className="space-y-xs">
              <span className="font-label-md text-label-md font-bold text-on-surface">Status</span>
              <select className={fieldClass} value={form.status} onChange={(event) => updateField("status", event.target.value)}>
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>

            <label className="space-y-xs">
              <span className="font-label-md text-label-md font-bold text-on-surface">Location</span>
              <input className={fieldClass} value={form.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Head Office" />
            </label>

            <label className="space-y-xs">
              <span className="font-label-md text-label-md font-bold text-on-surface">Purchase Date</span>
              <input className={fieldClass} type="date" value={form.purchase_date} onChange={(event) => updateField("purchase_date", event.target.value)} />
            </label>

            <label className="space-y-xs">
              <span className="font-label-md text-label-md font-bold text-on-surface">Cost</span>
              <input className={fieldClass} min="0" step="0.01" type="number" value={form.cost} onChange={(event) => updateField("cost", event.target.value)} placeholder="0.00" />
            </label>

            {error ? <p className="rounded-lg border border-error/30 bg-error/10 px-md py-sm text-error sm:col-span-2">{error}</p> : null}

            <div className="flex justify-end gap-sm sm:col-span-2">
              <button className="rounded-lg border border-outline-variant px-md py-sm font-label-md text-label-md font-bold text-on-surface" type="button" onClick={() => setForm(initialForm)}>
                Reset
              </button>
              <Button disabled={saving} type="submit">{saving ? "Saving..." : "Register Asset"}</Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}

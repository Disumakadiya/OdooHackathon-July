import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAssets } from "../../context/AssetContext";

const initialForm = {
  name: "",
  serialNumber: "",
  qrCode: "",
  category: "",
  department: "",
  location: "",
  assignedEmployee: "",
  condition: "Good",
  description: "",
};
const inputClass = "w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function AssetflowAssetRegistration() {
  const { addAsset } = useAssets();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const requiredComplete = useMemo(
    () => ["name", "category", "department", "location"].every((field) => form[field].trim()),
    [form],
  );

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (submitError) setSubmitError("");
  };

  const validate = () => {
    const nextErrors = {};
    for (const field of ["name", "category", "department", "location"]) {
      if (!form[field].trim()) nextErrors[field] = "Required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await addAsset({ ...form, status: "Available" });
      setForm(initialForm);
      navigate("/assetflow_asset_directory");
    } catch (err) {
      setSubmitError(err.message || "Failed to register asset");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-container-low px-4 py-6 text-on-surface sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-label-md text-label-md text-primary">Assets</p>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Register Asset</h1>
            <p className="mt-1 text-on-surface-variant">Asset tags are generated automatically in AF-0001 format.</p>
          </div>
          <Button className="bg-surface text-primary ring-1 ring-outline-variant hover:bg-surface-container" onClick={() => navigate("/assetflow_asset_directory")}>
            View Directory
          </Button>
        </div>

        <form className="rounded-lg border border-outline-variant bg-surface p-5 shadow-sm" onSubmit={handleSubmit}>
          {submitError ? (
            <div className="mb-4 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{submitError}</div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Asset Name" error={errors.name}>
              <input className={inputClass} value={form.name} onChange={(e) => updateField("name", e.target.value)} />
            </Field>
            <Field label="Serial Number">
              <input className={inputClass} value={form.serialNumber} onChange={(e) => updateField("serialNumber", e.target.value)} />
            </Field>
            <Field label="Category" error={errors.category}>
              <input className={inputClass} value={form.category} onChange={(e) => updateField("category", e.target.value)} />
            </Field>
            <Field label="Department" error={errors.department}>
              <input className={inputClass} value={form.department} onChange={(e) => updateField("department", e.target.value)} />
            </Field>
            <Field label="Location" error={errors.location}>
              <input className={inputClass} value={form.location} onChange={(e) => updateField("location", e.target.value)} />
            </Field>
            <Field label="QR Code">
              <input className={inputClass} value={form.qrCode} onChange={(e) => updateField("qrCode", e.target.value)} />
            </Field>
            <Field label="Assigned Employee">
              <input className={inputClass} value={form.assignedEmployee} onChange={(e) => updateField("assignedEmployee", e.target.value)} />
            </Field>
            <Field label="Condition">
              <select className={inputClass} value={form.condition} onChange={(e) => updateField("condition", e.target.value)}>
                <option>Good</option>
                <option>Fair</option>
                <option>Damaged</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea className={`${inputClass} min-h-28`} value={form.description} onChange={(e) => updateField("description", e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button className="bg-surface text-primary ring-1 ring-outline-variant hover:bg-surface-container" onClick={() => { setForm(initialForm); setSubmitError(""); }}>
              Clear
            </Button>
            <Button disabled={!requiredComplete || submitting} className="disabled:cursor-not-allowed disabled:opacity-50" type="submit">
              {submitting ? "Registering..." : "Register Asset"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block font-label-md text-label-md text-on-surface">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-sm text-error">{error}</span> : null}
    </label>
  );
}

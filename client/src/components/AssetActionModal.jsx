import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";

const fieldClass =
  "w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 font-label-md text-label-md text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary focus:bg-surface";

export default function AssetActionModal({ action, asset, open, onClose, onConfirm }) {
  const [form, setForm] = useState({
    employee_id: "",
    to_employee_id: "",
    location: "",
    to_department: "",
    expected_return_date: "",
    condition: "Good",
    notes: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        employee_id: "",
        to_employee_id: "",
        location: asset?.location === "-" ? "" : asset?.location || "",
        to_department: asset?.department === "-" ? "" : asset?.department || "",
        expected_return_date: "",
        condition: "Good",
        notes: "",
      });
    }
  }, [asset, open]);

  const title = useMemo(() => ({
    allocate: "Allocate Asset",
    transfer: "Transfer Location",
    return: "Return Asset",
  }[action] || "Asset Action"), [action]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (action === "allocate") {
      onConfirm({
        employee_id: form.employee_id,
        expected_return_date: form.expected_return_date || null,
        location: form.location.trim(),
      });
      return;
    }

    if (action === "transfer") {
      onConfirm({
        to_employee_id: form.to_employee_id,
        location: form.location.trim(),
        to_department: form.to_department.trim(),
      });
      return;
    }

    onConfirm({
      condition: form.condition,
      notes: form.notes.trim(),
    });
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
          <motion.button
            aria-label="Close asset action modal"
            className="absolute inset-0 bg-surface/65 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={onClose}
            type="button"
          />

          <motion.form
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onSubmit={handleSubmit}
          >
            <div className="border-b border-outline-variant bg-surface-container-low px-6 py-5">
              <h2 className="font-headline-md text-headline-md text-primary">{title}</h2>
              <p className="mt-1 font-label-md text-label-md text-on-surface-variant">
                {asset?.assetTag} {asset?.name ? `- ${asset.name}` : ""}
              </p>
            </div>

            <div className="space-y-5 px-6 py-5">
              {action === "allocate" ? (
                <>
                  <label className="block space-y-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">Employee ID</span>
                    <input autoFocus className={fieldClass} required value={form.employee_id} onChange={(event) => setForm((current) => ({ ...current, employee_id: event.target.value }))} />
                  </label>
                  <label className="block space-y-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">Location</span>
                    <input className={fieldClass} value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} />
                  </label>
                  <label className="block space-y-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">Expected Return Date</span>
                    <input className={fieldClass} type="date" value={form.expected_return_date} onChange={(event) => setForm((current) => ({ ...current, expected_return_date: event.target.value }))} />
                  </label>
                </>
              ) : null}

              {action === "transfer" ? (
                <>
                  <label className="block space-y-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">New Location</span>
                    <input autoFocus className={fieldClass} required value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} />
                  </label>
                  <label className="block space-y-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">To Department</span>
                    <input className={fieldClass} placeholder="e.g. IT, Sales, Operations" value={form.to_department} onChange={(event) => setForm((current) => ({ ...current, to_department: event.target.value }))} />
                  </label>
                  <label className="block space-y-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">To Employee ID</span>
                    <input className={fieldClass} placeholder="Optional" value={form.to_employee_id} onChange={(event) => setForm((current) => ({ ...current, to_employee_id: event.target.value }))} />
                  </label>
                </>
              ) : null}

              {action === "return" ? (
                <>
                  <label className="block space-y-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">Condition</span>
                    <select autoFocus className={fieldClass} value={form.condition} onChange={(event) => setForm((current) => ({ ...current, condition: event.target.value }))}>
                      {["Good", "Damaged", "Needs Maintenance"].map((condition) => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">Notes</span>
                    <textarea className={`${fieldClass} min-h-28`} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
                  </label>
                </>
              ) : null}

              <div className="flex justify-end gap-3">
                <button className="rounded-lg border border-outline-variant px-4 py-2 font-label-md text-label-md font-bold text-on-surface transition-colors hover:bg-surface-container-low" onClick={onClose} type="button">
                  Cancel
                </button>
                <Button type="submit">Confirm</Button>
              </div>
            </div>
          </motion.form>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

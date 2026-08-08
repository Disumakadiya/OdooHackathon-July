import { useEffect, useMemo, useState } from "react";
import { auditDepartments, discrepancyReportRows } from "../../assets/auditData";
import Card from "../../components/Card";
import FilterDropdown from "../../components/FilterDropdown";
import Sidebar from "../../components/Sidebar";
import StatusBadge from "../../components/StatusBadge";
import Table from "../../components/Table";

export default function assetflow_discrepancy_report() {
  const [departmentFilter, setDepartmentFilter] = useState("All");

  useEffect(() => {
    document.title = "Discrepancy Report | AssetFlow";
  }, []);

  const filteredRows = useMemo(() => {
    return discrepancyReportRows.filter((row) => {
      return departmentFilter === "All" || row.department === departmentFilter;
    });
  }, [departmentFilter]);

  const summary = useMemo(() => {
    return {
      missing: discrepancyReportRows.filter((row) => row.issue === "Missing").length,
      damaged: discrepancyReportRows.filter((row) => row.issue === "Damaged").length,
      lost: discrepancyReportRows.filter((row) => row.issue === "Lost").length,
    };
  }, []);

  const columns = [
    { key: "asset", label: "Asset" },
    { key: "department", label: "Department" },
    {
      key: "issue",
      label: "Issue",
      render: (row) => <StatusBadge status={row.issue} />,
    },
    { key: "assignedTo", label: "Assigned To" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="font-body-md text-body-md min-h-screen bg-surface-container-low">
      <Sidebar />

      <main className="min-h-screen md:ml-64">
        <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface px-lg py-sm">
          <div className="flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-headline-md text-headline-md text-primary">Discrepancy Report</h2>
            <button className="inline-flex items-center justify-center rounded-lg bg-primary px-md py-sm font-label-md text-label-md font-bold text-on-primary hover:opacity-90">
              <span className="material-symbols-outlined mr-sm text-[18px]">file_download</span>
              Export Button
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-max-width space-y-xl p-lg pb-2xl">
          <section className="grid grid-cols-1 gap-md sm:grid-cols-3">
            <Card>
              <p className="font-label-md text-label-md text-on-surface-variant">Missing Assets</p>
              <p className="font-headline-lg text-headline-lg text-error">{summary.missing}</p>
            </Card>
            <Card>
              <p className="font-label-md text-label-md text-on-surface-variant">Damaged Assets</p>
              <p className="font-headline-lg text-headline-lg text-tertiary">{summary.damaged}</p>
            </Card>
            <Card>
              <p className="font-label-md text-label-md text-on-surface-variant">Lost Assets</p>
              <p className="font-headline-lg text-headline-lg text-error">{summary.lost}</p>
            </Card>
          </section>

          <section>
            <Card
              title="Report Table"
              subtitle="Department wise discrepancy tracking"
              headerAction={
                <FilterDropdown
                  label="Department"
                  options={auditDepartments}
                  value={departmentFilter}
                  onChange={(event) => setDepartmentFilter(event.target.value)}
                />
              }
            >
              <Table columns={columns} rows={filteredRows} emptyMessage="No discrepancies found for selected department." />
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

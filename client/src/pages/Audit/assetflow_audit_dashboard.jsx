import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { auditDepartments, auditStatuses, auditSummaryCards, completedAudits, activeAudits } from "../../assets/auditData";
import Card from "../../components/Card";
import FilterDropdown from "../../components/FilterDropdown";
import SearchBar from "../../components/SearchBar";
import Sidebar from "../../components/Sidebar";
import StatusBadge from "../../components/StatusBadge";
import Table from "../../components/Table";

export default function assetflow_audit_dashboard() {
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    document.title = "AssetFlow | Audit Dashboard";
  }, []);

  const combinedRows = useMemo(() => {
    return [...activeAudits, ...completedAudits];
  }, []);

  const filteredRows = useMemo(() => {
    return combinedRows.filter((row) => {
      const keyword = searchText.trim().toLowerCase();
      const matchesSearch =
        !keyword || `${row.id} ${row.department} ${row.auditor} ${row.status}`.toLowerCase().includes(keyword);
      const matchesDepartment = departmentFilter === "All" || row.department === departmentFilter;
      const matchesStatus = statusFilter === "All" || row.status === statusFilter;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [combinedRows, departmentFilter, searchText, statusFilter]);

  const columns = [
    { key: "id", label: "Audit ID" },
    { key: "department", label: "Department" },
    { key: "auditor", label: "Auditor" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: "date", label: "Date" },
    {
      key: "action",
      label: "Action",
      render: () => (
        <button className="rounded-lg border border-outline-variant px-sm py-1 font-label-sm text-label-sm text-primary hover:bg-surface-container-low">
          View
        </button>
      ),
    },
  ];

  return (
    <div className="font-body-md text-body-md">
      <Sidebar />

      <main className="min-h-screen md:ml-64">
        <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface px-lg py-sm">
          <div className="flex flex-col gap-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-xl">
              <SearchBar
                placeholder="Search by audit ID, auditor, department..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>
            <Link
              to="/audit"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-md py-sm font-label-md text-label-md font-bold text-on-primary hover:opacity-90"
            >
              Create Audit
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-max-width space-y-xl p-lg pb-2xl">
          <section>
            <h2 className="font-headline-lg text-headline-lg text-primary">Audit Dashboard</h2>
            <p className="mt-xs font-label-md text-label-md text-on-surface-variant">
              Monitor active and completed audits with department-wise filtering and quick actions.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-md sm:grid-cols-2 xl:grid-cols-4">
            {auditSummaryCards.map((item) => (
              <Card key={item.id} className="border-white">
                <div className="mb-sm flex items-center justify-between">
                  <p className="font-label-md text-label-md text-on-surface-variant">{item.title}</p>
                  <span className="material-symbols-outlined text-primary">{item.icon}</span>
                </div>
                <p className="font-headline-lg text-headline-lg text-primary">{item.value}</p>
                <p className="mt-xs font-label-sm text-label-sm text-on-surface-variant">{item.helper}</p>
              </Card>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-lg xl:grid-cols-2">
            <Card title="Active Audits" subtitle="Current ongoing and scheduled cycles">
              <div className="space-y-sm">
                {activeAudits.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-outline-variant p-sm">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">{item.id}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {item.department} · {item.auditor}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Completed Audits" subtitle="Recently closed audit cycles">
              <div className="space-y-sm">
                {completedAudits.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-outline-variant p-sm">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">{item.id}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {item.department} · {item.auditor}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section>
            <Card
              title="Audit Table"
              subtitle="Search and filter audit cycles"
              headerAction={
                <div className="flex flex-wrap items-center gap-sm">
                  <FilterDropdown
                    label="Department"
                    options={auditDepartments}
                    value={departmentFilter}
                    onChange={(event) => setDepartmentFilter(event.target.value)}
                  />
                  <FilterDropdown
                    label="Status"
                    options={auditStatuses}
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  />
                </div>
              }
            >
              <Table columns={columns} rows={filteredRows} emptyMessage="No audits found for selected filters." />
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

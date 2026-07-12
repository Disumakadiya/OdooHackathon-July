import { useEffect, useMemo, useState } from "react";
import { verificationConditions, verificationData, verificationStatuses } from "../../assets/verificationData";
import Card from "../../components/Card";
import FilterDropdown from "../../components/FilterDropdown";
import SearchBar from "../../components/SearchBar";
import Sidebar from "../../components/Sidebar";
import StatusBadge from "../../components/StatusBadge";
import Table from "../../components/Table";

export default function assetflow_asset_verification() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [rows, setRows] = useState(verificationData);

  useEffect(() => {
    document.title = "AssetFlow | Asset Verification";
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const keyword = query.trim().toLowerCase();
      const matchesSearch =
        !keyword || `${row.assetTag} ${row.assetName} ${row.department}`.toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === "All" || row.verificationStatus === statusFilter;
      const matchesCondition = conditionFilter === "All" || row.condition === conditionFilter;
      return matchesSearch && matchesStatus && matchesCondition;
    });
  }, [conditionFilter, query, rows, statusFilter]);

  const handleVerify = (assetTag) => {
    setRows((prevRows) => {
      return prevRows.map((row) => {
        if (row.assetTag !== assetTag) {
          return row;
        }
        return {
          ...row,
          verificationStatus: "Verified",
          remarks: "Verified in current session",
        };
      });
    });
  };

  const columns = [
    { key: "assetTag", label: "Asset Tag" },
    { key: "assetName", label: "Asset Name" },
    { key: "department", label: "Department" },
    {
      key: "condition",
      label: "Condition",
      render: (row) => <StatusBadge status={row.condition} />,
    },
    {
      key: "verificationStatus",
      label: "Verification Status",
      render: (row) => <StatusBadge status={row.verificationStatus} />,
    },
    { key: "remarks", label: "Remarks" },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <button
          className="rounded-lg bg-primary px-sm py-1 font-label-sm text-label-sm font-bold text-on-primary hover:opacity-90 disabled:cursor-not-allowed disabled:bg-secondary"
          disabled={row.verificationStatus === "Verified"}
          onClick={() => handleVerify(row.assetTag)}
        >
          {row.verificationStatus === "Verified" ? "Verified" : "Verify"}
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
                placeholder="Search Asset"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button className="inline-flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container px-md py-sm font-label-md text-label-md text-primary hover:bg-surface-container-high">
              <span className="material-symbols-outlined mr-sm text-[18px]">qr_code_scanner</span>
              Scan Asset
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-max-width space-y-xl p-lg pb-2xl">
          <section>
            <h2 className="font-headline-lg text-headline-lg text-primary">Asset Verification</h2>
            <p className="mt-xs font-label-md text-label-md text-on-surface-variant">
              Verify allocated assets with status updates and operational remarks.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-md sm:grid-cols-3">
            <Card>
              <p className="font-label-md text-label-md text-on-surface-variant">Total Records</p>
              <p className="font-headline-lg text-headline-lg text-primary">{rows.length}</p>
            </Card>
            <Card>
              <p className="font-label-md text-label-md text-on-surface-variant">Verified</p>
              <p className="font-headline-lg text-headline-lg text-secondary">
                {rows.filter((row) => row.verificationStatus === "Verified").length}
              </p>
            </Card>
            <Card>
              <p className="font-label-md text-label-md text-on-surface-variant">Flagged</p>
              <p className="font-headline-lg text-headline-lg text-error">
                {rows.filter((row) => row.verificationStatus === "Flagged").length}
              </p>
            </Card>
          </section>

          <section>
            <Card
              title="Verification Table"
              subtitle="Search, filter, and verify assets"
              headerAction={
                <div className="flex flex-wrap gap-sm">
                  <FilterDropdown
                    label="Status"
                    options={verificationStatuses}
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  />
                  <FilterDropdown
                    label="Condition"
                    options={verificationConditions}
                    value={conditionFilter}
                    onChange={(event) => setConditionFilter(event.target.value)}
                  />
                </div>
              }
            >
              <Table columns={columns} rows={filteredRows} emptyMessage="No assets found for selected criteria." />
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

import api from "./baseService";

function transformAsset(dbAsset) {
  return {
    id: `ASSET-${dbAsset.id}`,
    assetTag: dbAsset.asset_tag,
    name: dbAsset.asset_name,
    serialNumber: dbAsset.serial_number || "",
    qrCode: dbAsset.qr_code || "",
    category: dbAsset.category || dbAsset.category_name || "",
    status: dbAsset.status || "Available",
    department: dbAsset.department || "",
    location: dbAsset.location || "",
    assignedEmployee: dbAsset.assigned_employee || "Unassigned",
    lastUpdated: dbAsset.last_updated
      ? new Date(dbAsset.last_updated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    condition: dbAsset.condition || "Good",
    description: dbAsset.description || "",
    allocationHistory: [],
    maintenanceHistory: [],
    stats: { usageDays: 0, moves: 0, maintenance: 0, openIssues: 0 },
  };
}

function transformToPayload(asset) {
  return {
    assetTag: asset.assetTag,
    name: asset.name,
    serialNumber: asset.serialNumber,
    qrCode: asset.qrCode,
    category: asset.category,
    status: asset.status,
    department: asset.department,
    location: asset.location,
    assignedEmployee: asset.assignedEmployee,
    condition: asset.condition,
    description: asset.description,
  };
}

export async function fetchAssets() {
  const { data } = await api.get("/assets");
  const list = Array.isArray(data) ? data : data?.data || [];
  return list.map(transformAsset);
}

export async function createAsset(asset) {
  const payload = transformToPayload(asset);
  const { data } = await api.post("/assets", payload);
  const created = data?.data || data;
  return transformAsset(created);
}

export async function updateAsset(id, updates) {
  const numericId = id.replace("ASSET-", "");
  const payload = transformToPayload(updates);
  const { data } = await api.put(`/assets/${numericId}`, payload);
  const updated = data?.data || data;
  return transformAsset(updated);
}

export async function deleteAsset(id) {
  const numericId = id.replace("ASSET-", "");
  await api.delete(`/assets/${numericId}`);
  return { success: true };
}

export async function allocateAsset(id, allocationData) {
  const numericId = id.replace("ASSET-", "");
  const { data } = await api.post(`/assets/${numericId}/allocate`, allocationData);
  const updated = data?.data || data;
  return transformAsset(updated);
}

export async function transferAsset(id, transferData) {
  const numericId = id.replace("ASSET-", "");
  const { data } = await api.post(`/assets/${numericId}/transfer`, transferData);
  const updated = data?.data || data;
  return transformAsset(updated);
}

export async function returnAsset(id, returnData) {
  const numericId = id.replace("ASSET-", "");
  const { data } = await api.post(`/assets/${numericId}/return`, returnData);
  const updated = data?.data || data;
  return transformAsset(updated);
}

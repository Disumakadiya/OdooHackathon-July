import api from "./baseService";
import { assetVerificationData } from "../assets/assetVerificationData";

const USE_MOCK = true;

let mockAssets = [...assetVerificationData];

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchAssets() {
  if (USE_MOCK) {
    await delay();
    return [...mockAssets];
  }
  const { data } = await api.get("/assets");
  return data;
}

export async function createAsset(asset) {
  if (USE_MOCK) {
    await delay();
    const newAsset = {
      ...asset,
      id: `ASSET-${Date.now()}`,
      allocationHistory: [
        { id: 1, action: "Registered in system", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), details: "Asset registered via AssetFlow." },
      ],
      maintenanceHistory: [],
      stats: { usageDays: 0, moves: 0, maintenance: 0, openIssues: 0 },
    };
    mockAssets = [newAsset, ...mockAssets];
    return newAsset;
  }
  const { data } = await api.post("/assets", asset);
  return data;
}

export async function updateAsset(id, updates) {
  if (USE_MOCK) {
    await delay();
    mockAssets = mockAssets.map((a) => (a.id === id ? { ...a, ...updates } : a));
    return mockAssets.find((a) => a.id === id);
  }
  const { data } = await api.put(`/assets/${id}`, updates);
  return data;
}

export async function deleteAsset(id) {
  if (USE_MOCK) {
    await delay();
    mockAssets = mockAssets.filter((a) => a.id !== id);
    return { success: true };
  }
  const { data } = await api.delete(`/assets/${id}`);
  return data;
}

export async function allocateAsset(id, allocationData) {
  if (USE_MOCK) {
    await delay();
    const entry = { id: Date.now(), action: "Allocated", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), details: `Allocated to ${allocationData.assignedEmployee}.` };
    mockAssets = mockAssets.map((a) =>
      a.id === id
        ? { ...a, status: "Allocated", assignedEmployee: allocationData.assignedEmployee, lastUpdated: entry.date, allocationHistory: [entry, ...(a.allocationHistory || [])] }
        : a,
    );
    return mockAssets.find((a) => a.id === id);
  }
  const { data } = await api.post(`/assets/${id}/allocate`, allocationData);
  return data;
}

export async function transferAsset(id, transferData) {
  if (USE_MOCK) {
    await delay();
    const entry = { id: Date.now(), action: "Transferred", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), details: `Transferred to ${transferData.department} - ${transferData.location}.` };
    mockAssets = mockAssets.map((a) =>
      a.id === id
        ? { ...a, status: "Reserved", department: transferData.department || a.department, location: transferData.location || a.location, lastUpdated: entry.date, allocationHistory: [entry, ...(a.allocationHistory || [])] }
        : a,
    );
    return mockAssets.find((a) => a.id === id);
  }
  const { data } = await api.post(`/assets/${id}/transfer`, transferData);
  return data;
}

export async function returnAsset(id, returnData) {
  if (USE_MOCK) {
    await delay();
    const entry = { id: Date.now(), action: "Returned", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), details: `Asset returned. Condition: ${returnData.condition || "Good"}.` };
    mockAssets = mockAssets.map((a) =>
      a.id === id
        ? { ...a, status: "Available", assignedEmployee: "Unassigned", condition: returnData.condition || a.condition, lastUpdated: entry.date, allocationHistory: [entry, ...(a.allocationHistory || [])] }
        : a,
    );
    return mockAssets.find((a) => a.id === id);
  }
  const { data } = await api.post(`/assets/${id}/return`, returnData);
  return data;
}

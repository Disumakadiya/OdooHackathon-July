import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as assetService from "../services/assetService";
import { useToast } from "./ToastContext";

const AssetContext = createContext(null);

export function AssetProvider({ children }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const loadAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assetService.fetchAssets();
      setAssets(data);
    } catch (err) {
      setError(err.message);
      toast.showError("Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const addAsset = useCallback(async (formData) => {
    try {
      const created = await assetService.createAsset(formData);
      setAssets((prev) => [created, ...prev]);
      toast.showSuccess("Asset registered successfully");
      return created;
    } catch (err) {
      toast.showError(err.message || "Failed to register asset");
      throw err;
    }
  }, [toast]);

  const editAsset = useCallback(async (id, formData) => {
    try {
      const updated = await assetService.updateAsset(id, formData);
      setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      toast.showSuccess("Asset updated successfully");
      return updated;
    } catch (err) {
      toast.showError(err.message || "Failed to update asset");
      throw err;
    }
  }, [toast]);

  const removeAsset = useCallback(async (id) => {
    try {
      await assetService.deleteAsset(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast.showSuccess("Asset deleted successfully");
    } catch (err) {
      toast.showError(err.message || "Failed to delete asset");
      throw err;
    }
  }, [toast]);

  const allocate = useCallback(async (id, allocationData) => {
    try {
      const updated = await assetService.allocateAsset(id, allocationData);
      setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      toast.showSuccess("Asset allocated successfully");
      return updated;
    } catch (err) {
      toast.showError(err.message || "Failed to allocate asset");
      throw err;
    }
  }, [toast]);

  const transfer = useCallback(async (id, transferData) => {
    try {
      const updated = await assetService.transferAsset(id, transferData);
      setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      toast.showSuccess("Asset transferred successfully");
      return updated;
    } catch (err) {
      toast.showError(err.message || "Failed to transfer asset");
      throw err;
    }
  }, [toast]);

  const doReturn = useCallback(async (id, returnData) => {
    try {
      const updated = await assetService.returnAsset(id, returnData);
      setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      toast.showSuccess("Asset returned successfully");
      return updated;
    } catch (err) {
      toast.showError(err.message || "Failed to return asset");
      throw err;
    }
  }, [toast]);

  const summary = useMemo(() => ({
    totalCategories: new Set(assets.map((a) => a.category)).size,
    totalAssets: assets.length,
    active: assets.filter((a) => ["Available", "Allocated", "Reserved"].includes(a.status)).length,
    inactive: assets.filter((a) => ["Under Maintenance", "Lost", "Retired", "Disposed"].includes(a.status)).length,
  }), [assets]);

  const value = useMemo(() => ({
    assets,
    loading,
    error,
    summary,
    refreshAssets: loadAssets,
    addAsset,
    editAsset,
    removeAsset,
    allocate,
    transfer,
    doReturn,
  }), [assets, loading, error, summary, loadAssets, addAsset, editAsset, removeAsset, allocate, transfer, doReturn]);

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
}

export function useAssets() {
  const ctx = useContext(AssetContext);
  if (!ctx) throw new Error("useAssets must be used within AssetProvider");
  return ctx;
}

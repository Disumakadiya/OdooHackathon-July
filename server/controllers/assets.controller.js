import * as assetsService from "../services/assets.service.js";

export async function getAll(req, res, next) {
  try {
    const data = await assetsService.getAll();
    res.json({ success: true, message: "Assets retrieved successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const data = await assetsService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Asset not found" });
    res.json({ success: true, message: "Asset retrieved successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = await assetsService.create(req.body);
    res.status(201).json({ success: true, message: "Asset registered successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const data = await assetsService.update(req.params.id, req.body);
    if (!data) return res.status(404).json({ success: false, message: "Asset not found" });
    res.json({ success: true, message: "Asset updated successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const deleted = await assetsService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Asset not found" });
    res.json({ success: true, message: "Asset deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export async function allocate(req, res, next) {
  try {
    const data = await assetsService.allocate(req.params.id, req.body);
    if (!data) return res.status(404).json({ success: false, message: "Asset not found" });
    res.json({ success: true, message: "Asset allocated successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function transfer(req, res, next) {
  try {
    const data = await assetsService.transferAsset(req.params.id, req.body);
    if (!data) return res.status(404).json({ success: false, message: "Asset not found" });
    res.json({ success: true, message: "Asset transfer initiated successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function doReturn(req, res, next) {
  try {
    const data = await assetsService.returnAsset(req.params.id, req.body);
    if (!data) return res.status(404).json({ success: false, message: "Asset not found" });
    res.json({ success: true, message: "Asset returned successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const data = await assetsService.getStats();
    res.json({ success: true, message: "Asset stats retrieved successfully", data });
  } catch (err) {
    next(err);
  }
}

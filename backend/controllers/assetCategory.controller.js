import * as categoryService from "../services/assetCategory.service.js";

export async function getAll(req, res, next) {
  try {
    const data = await categoryService.getAll();
    res.json({ success: true, message: "Categories retrieved successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const data = await categoryService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category retrieved successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = await categoryService.create(req.body);
    res.status(201).json({ success: true, message: "Category created successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const data = await categoryService.update(req.params.id, req.body);
    if (!data) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category updated successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const deleted = await categoryService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
}

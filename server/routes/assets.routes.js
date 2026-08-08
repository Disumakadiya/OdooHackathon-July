import express from "express";
import * as assetController from "../controllers/asset.controller.js";

const router = express.Router();

router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAssetById);
router.post('/', assetController.createAsset);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);
router.post('/:id/allocate', assetController.allocateAsset);
router.post('/:id/transfer', assetController.transferAsset);
router.post('/:id/return', assetController.returnAsset);

export default router;

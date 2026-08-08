import { Router } from "express";
import * as assetsController from "../controllers/assets.controller.js";

const router = Router();

router.get("/", assetsController.getAll);
router.get("/stats", assetsController.getStats);
router.get("/:id", assetsController.getById);
router.post("/", assetsController.create);
router.put("/:id", assetsController.update);
router.delete("/:id", assetsController.remove);
router.post("/:id/allocate", assetsController.allocate);
router.post("/:id/transfer", assetsController.transfer);
router.post("/:id/return", assetsController.doReturn);

export default router;

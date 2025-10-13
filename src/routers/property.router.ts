import express from "express";
import uploader from "../middlewares/uploader.middleware";
import {
  createProperty,
  getProperties,
  getProperty,
  updatePropertyController,
  deletePropertyController,
  getAllFilteredProperties,
  getMyProperties,
} from "../controllers/property.controller";
import { verifyToken, tenantGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getProperties);
router.get("/filter", getAllFilteredProperties);
router.get("/me", verifyToken, tenantGuard, getMyProperties);
router.post(
  "/",
  verifyToken,
  tenantGuard,
  uploader.array("pictures", 10),
  createProperty
);
router.put("/:id", verifyToken, tenantGuard, updatePropertyController);
router.delete("/:id", verifyToken, tenantGuard, deletePropertyController);
router.get("/:id", getProperty);

export default router;
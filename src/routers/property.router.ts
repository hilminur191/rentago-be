// src/routes/property.routes.ts
import express from "express";
import uploader from "../middlewares/uploader.middleware";
import {
  createProperty,
  getProperties,
  getProperty,
  updatePropertyController,
  deletePropertyController,
  getAllFilteredProperties,
} from "../controllers/property.controller";

const router = express.Router();

router.post("/", uploader.array("pictures", 10), createProperty);
router.get("/", getProperties);
router.get("/filter", getAllFilteredProperties);
router.get("/:id", getProperty);
router.put("/:id", updatePropertyController);
router.delete("/:id", deletePropertyController);

export default router;

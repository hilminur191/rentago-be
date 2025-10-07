import { Router } from "express";
import {
  createProperty,
  getProperties,
  getProperty,
  updatePropertyController,
  deletePropertyController,
  getAllFilteredProperties,
} from "../controllers/property.controller";

const router = Router();

router.get("/", getProperties);
router.get("/filter", getAllFilteredProperties);
router.get("/:id", getProperty);
router.post("/", createProperty);
router.put("/:id", updatePropertyController);
router.delete("/:id", deletePropertyController);
export default router;
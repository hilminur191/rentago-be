import { Router } from "express";
import {
  createPeakSeasonRate,
  getAllPeakSeasonRates,
  getPeakSeasonRateById,
  updatePeakSeasonRate,
  deletePeakSeasonRate,
} from "../controllers/peakSeasonRate.controller";

const router = Router();


router.post("/", createPeakSeasonRate);
router.get("/", getAllPeakSeasonRates);
router.get("/:id", getPeakSeasonRateById);
router.put("/:id", updatePeakSeasonRate);
router.delete("/:id", deletePeakSeasonRate);

export default router;
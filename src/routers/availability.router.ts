import { Router } from "express";
import * as roomAvailabilityController from "../controllers/availability.controller";

const router = Router();

router.get("/:roomId", roomAvailabilityController.getAvailability);
router.post("/:roomId", roomAvailabilityController.createAvailability);

export default router;
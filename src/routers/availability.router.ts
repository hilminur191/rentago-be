import { Router } from "express";
import * as roomAvailabilityController from "../controllers/availability.controller";

const router = Router();

router.get("/:roomId", roomAvailabilityController.getAvailability);

export default router;

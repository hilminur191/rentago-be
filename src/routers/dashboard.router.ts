import { Router } from "express";
import {
  getTenantDashboardHandler,
  getUserDashboardHandler,
} from "../controllers/dashboard.controller";
import { verifyToken, tenantGuard, userGuard } from "../middlewares/auth.middleware";

const router = Router();

router.get("/tenant", verifyToken, tenantGuard, getTenantDashboardHandler);
router.get("/user", verifyToken, userGuard, getUserDashboardHandler);

export default router;
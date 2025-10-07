import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { verifyToken, tenantGuard, userGuard } from "../middlewares/auth.middleware";

const router = Router();

// Tenant dashboard
router.get(
  "/tenant",
  verifyToken,
  tenantGuard,
  dashboardController.getTenantDashboard
);

// User dashboard
router.get(
  "/user",
  verifyToken,
  userGuard,
  dashboardController.getUserDashboard
);

export default router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/tenant", auth_middleware_1.verifyToken, auth_middleware_1.tenantGuard, dashboard_controller_1.getTenantDashboardHandler);
router.get("/user", auth_middleware_1.verifyToken, auth_middleware_1.userGuard, dashboard_controller_1.getUserDashboardHandler);
exports.default = router;

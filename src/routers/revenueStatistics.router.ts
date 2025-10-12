import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  getYearlyRevenueStats,
  getMonthlyRevenueStats,
  getDailyRevenueStats,
} from "../controllers/revenueStatistics.controller";

const router = Router();

router.get("/yearly", verifyToken, getYearlyRevenueStats);
router.get("/monthly", verifyToken, getMonthlyRevenueStats);
router.get("/daily", verifyToken, getDailyRevenueStats);

export default router;

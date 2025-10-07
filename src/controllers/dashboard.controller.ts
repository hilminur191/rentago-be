import { Request, Response } from "express";
import * as dashboardRepository from "../repositories/dashboard.repository";

// Tenant Dashboard
export const getTenantDashboard = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id;
    const dashboard = await dashboardRepository.getTenantDashboard(tenantId);

    res.status(200).json({
      message: "Tenant dashboard fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tenant dashboard",
      error: (error as Error).message,
    });
  }
};

// User Dashboard
export const getUserDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const dashboard = await dashboardRepository.getUserDashboard(userId);

    res.status(200).json({
      message: "User dashboard fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user dashboard",
      error: (error as Error).message,
    });
  }
};

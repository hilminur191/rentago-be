import { Request, Response } from "express";
import {
  getTenantDashboard,
  getUserDashboard,
} from "../repositories/dashboard.repository";

export const getTenantDashboardHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const tenantId = (req as any).user?.id;
    if (!tenantId) {
      return res
        .status(400)
        .json({ success: false, message: "Tenant ID tidak ditemukan" });
    }

    const data = await getTenantDashboard(tenantId);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserDashboardHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID tidak ditemukan" });
    }

    const data = await getUserDashboard(userId);
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

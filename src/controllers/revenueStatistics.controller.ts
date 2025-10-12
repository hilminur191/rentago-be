import { Request, Response } from "express";
import prisma from "../lib/prisma";
import dayjs from "dayjs";


export const getYearlyRevenueStats = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.id;
    if (!tenantId) return res.status(401).json({ message: "Unauthorized" });

    const currentYear = new Date().getFullYear();

    // Ambil semua order tahun ini milik tenant
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
        room: {
          property: {
            tenantId,
          },
        },
        payment: {
          status: "CONFIRMED",
        },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
    });

    // Buat array 12 bulan
    const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalRevenue: 0,
      totalOrders: 0,
    }));

    for (const order of orders) {
      const m = new Date(order.createdAt).getMonth();
      monthlyStats[m].totalOrders++;
      monthlyStats[m].totalRevenue += order.totalPrice;
    }

    res.json({
      year: currentYear,
      data: monthlyStats,
    });
  } catch (error: any) {
    console.error("Yearly revenue stats error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getMonthlyRevenueStats = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.id;
    if (!tenantId) return res.status(401).json({ message: "Unauthorized" });

    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const month = parseInt(req.query.month as string);
    if (!month || month < 1 || month > 12) {
      return res.status(400).json({ message: "Invalid month" });
    }

    const startDate = new Date(`${year}-${String(month).padStart(2, "0")}-01`);
    const endDate = dayjs(startDate).endOf("month").toDate();

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        room: {
          property: {
            tenantId,
          },
        },
        payment: {
          status: "CONFIRMED",
        },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
    });

    const daysInMonth = dayjs(startDate).daysInMonth();
    const dailyStats = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      totalRevenue: 0,
      totalOrders: 0,
    }));

    for (const order of orders) {
      const d = new Date(order.createdAt).getDate();
      dailyStats[d - 1].totalOrders++;
      dailyStats[d - 1].totalRevenue += order.totalPrice;
    }

    res.json({
      year,
      month,
      data: dailyStats,
    });
  } catch (error: any) {
    console.error("Monthly revenue stats error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getDailyRevenueStats = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.id;
    if (!tenantId) return res.status(401).json({ message: "Unauthorized" });

    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const month = parseInt(req.query.month as string);
    const day = parseInt(req.query.day as string);

    if (!month || !day) {
      return res
        .status(400)
        .json({ message: "Month and day are required (1-12, 1-31)" });
    }

    const startDate = new Date(
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}T00:00:00`
    );
    const endDate = dayjs(startDate).endOf("day").toDate();

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        room: {
          property: {
            tenantId,
          },
        },
        payment: {
          status: "CONFIRMED",
        },
      },
      select: {
        id: true,
        totalPrice: true,
        room: {
          select: {
            property: {
              select: { name: true, id: true },
            },
          },
        },
      },
    });

    // Group per properti
    const dailyStats: Record<
      string,
      { propertyName: string; totalRevenue: number; totalOrders: number }
    > = {};

    for (const order of orders) {
      const propertyId = order.room.property.id;
      if (!dailyStats[propertyId]) {
        dailyStats[propertyId] = {
          propertyName: order.room.property.name,
          totalRevenue: 0,
          totalOrders: 0,
        };
      }
      dailyStats[propertyId].totalRevenue += order.totalPrice;
      dailyStats[propertyId].totalOrders++;
    }

    res.json({
      date: startDate,
      data: Object.values(dailyStats),
    });
  } catch (error: any) {
    console.error("Daily revenue stats error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

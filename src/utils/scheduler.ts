// Nurbani
import cron from "node-cron";
import { subHours } from "date-fns";
import prisma from "../lib/prisma";

export const startScheduler = () => {
  // Jalan tiap 5 menit
  cron.schedule("*/5 * * * *", async () => {
    try {
      const cutoff = subHours(new Date(), 1);

      // Cari order yang masih menunggu pembayaran dan dibuat lebih dari 1 jam lalu
      const staleOrders = await prisma.order.findMany({
        where: {
          status: "MENUNGGU_PEMBAYARAN",
          createdAt: { lt: cutoff },
        },
        include: { payment: true },
      });

      for (const order of staleOrders) {
        await prisma.payment.update({
          where: { orderId: order.id },
          data: { status: "REJECTED" },
        });

        await prisma.order.update({
          where: { id: order.id },
          data: { status: "DIBATALKAN" },
        });
      }

      if (staleOrders.length > 0) {
        console.log(`Auto-cancelled ${staleOrders.length} stale orders`);
      }
    } catch (err) {
      console.error("Scheduler error:", err);
    }
  });
};

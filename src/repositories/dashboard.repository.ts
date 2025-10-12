import prisma from "../lib/prisma";

export const getTenantDashboard = async (tenantId: string) => {
  try {
    // Ambil semua properti milik tenant
    const properties = await prisma.property.findMany({
      where: { tenantId },
      include: {
        rooms: { select: { id: true } },
        pictures: true,
      },
    });

    const totalProperties = properties.length;
    const totalRooms = properties.reduce(
      (acc, property) => acc + property.rooms.length,
      0
    );

    return {
      totalProperties,
      totalRooms,
      properties,
    };
  } catch (error) {
    console.error("[Dashboard Service - Tenant] Error:", error);
    throw new Error("Gagal mengambil data dashboard tenant");
  }
};

export const getUserDashboard = async (userId: string) => {
  try {
    const reservations = await prisma.order.findMany({
      where: { userId },
      include: {
        room: {
          include: { property: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      totalReservations: reservations.length,
      reservations,
    };
  } catch (error) {
    console.error("[Dashboard Service - User] Error:", error);
    throw new Error("Gagal mengambil data dashboard user");
  }
};

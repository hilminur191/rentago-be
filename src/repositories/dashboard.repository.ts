import prisma from "../lib/prisma";

// Ambil summary untuk Tenant Dashboard
export const getTenantDashboard = async (tenantId: string) => {
  const properties = await prisma.property.findMany({
    where: { tenantId },
    include: {
      rooms: { select: { id: true } },
      pictures: true,
    },
  });

  const totalProperties = properties.length;
  const totalRooms = properties.reduce((acc, p) => acc + p.rooms.length, 0);

  return {
    totalProperties,
    totalRooms,
    properties,
  };
};

// Ambil summary untuk User Dashboard
export const getUserDashboard = async (userId: string) => {
  const reservations = await prisma.order.findMany({
    where: { userId },
    include: {
      room: {
        include: { property: true },
      },
    },
  });

  return {
    totalReservations: reservations.length,
    reservations,
  };
};

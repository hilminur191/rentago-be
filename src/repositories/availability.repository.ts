import prisma from "../lib/prisma";

export const getRoomAvailabilityByDate = (roomId: string, date: string) =>
  prisma.roomAvailability.findFirst({
    where: { roomId, date: new Date(date) },
  });

export const getRoomAvailabilityInRange = (
  roomId: string,
  startDate: string,
  endDate: string
) =>
  prisma.roomAvailability
    .findMany({
      where: {
        roomId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { date: "asc" },
      include: {
        room: {
          select: {
            basePrice: true,
          },
        },
      },
    })
    .then((data) =>
      data.map((item) => ({
        ...item,
        price: item.room.basePrice,
      }))
    );

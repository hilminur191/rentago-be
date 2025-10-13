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

    export const createRoomAvailability = async (
      roomId: string,
      date: string,
      availability: number
    ) => {
      const targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) {
        throw new Error("Tanggal tidak valid");
      }

      if (availability < 0) {
        throw new Error("Jumlah availability tidak boleh negatif");
      }

      const room = await prisma.room.findUnique({
        where: { id: roomId },
        select: { id: true, quantity: true },
      });

      if (!room) {
        throw new Error("Room tidak ditemukan");
      }

      if (room.quantity && availability > room.quantity) {
        throw new Error(
          `Availability tidak boleh lebih dari jumlah kamar (${room.quantity})`
        );
      }

      const existing = await prisma.roomAvailability.findFirst({
        where: { roomId, date: targetDate },
      });

      if (existing) {

        throw new Error("Availability untuk tanggal ini sudah ada");
      }

      const newAvailability = await prisma.roomAvailability.create({
        data: {
          roomId,
          date: targetDate,
          availability,
        },
      });

      return newAvailability;
    };
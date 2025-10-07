import prisma from "../lib/prisma";

export const getRoomById = (roomId: string) =>
  prisma.room.findUniqueOrThrow({
    where: { id: roomId },
    include: {
      availability: true,
      property: true,
    },
  });

export const createRoom = (propertyId: string, data: any) =>
  prisma.room.create({
    data: { ...data, propertyId },
  });

export const updateRoom = (roomId: string, data: any) =>
  prisma.room.update({ where: { id: roomId }, data });

export const deleteRoom = (roomId: string) =>
  prisma.room.delete({ where: { id: roomId } });

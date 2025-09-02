// Nurbani
import prisma from "../lib/prisma";
import { cloudinaryUpload } from "../utils/cloudinary";

export const getOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      room: { include: { property: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const createOrder = async (
  userId: string,
  data: {
    roomId: string;
    startDate: string;
    endDate: string;
    paymentMethod: "TRANSFER" | "GATEWAY";
  }
) => {
  const { roomId, startDate, endDate, paymentMethod } = data;

  // hitung harga total sederhana (durasi * basePrice)
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) throw new Error("Room tidak ditemukan");

  const start = new Date(startDate);
  const end = new Date(endDate);
  const nights = Math.ceil((+end - +start) / (1000 * 60 * 60 * 24));
  const totalPrice = room.basePrice * nights;

  return prisma.order.create({
    data: {
      userId,
      roomId,
      startDate: start,
      endDate: end,
      totalPrice,
      status: "MENUNGGU_PEMBAYARAN",
      payment: {
        create: {
          paymentMethod,
          status: "PENDING",
        },
      },
    },
    include: { payment: true },
  });
};

export const cancelOrder = async (userId: string, orderId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order tidak ditemukan");
  if (order.userId !== userId)
    throw new Error("Tidak boleh cancel order orang lain");
  if (order.status !== "MENUNGGU_PEMBAYARAN")
    throw new Error("Order tidak bisa dibatalkan");

  return prisma.order.update({
    where: { id: orderId },
    data: { status: "DIBATALKAN" },
  });
};

export const uploadPaymentProof = async (
  userId: string,
  orderId: string,
  file: Express.Multer.File
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });
  if (!order) throw new Error("Order tidak ditemukan");
  if (order.userId !== userId)
    throw new Error("Tidak boleh upload untuk order orang lain");

  const uploadResult = await cloudinaryUpload(file);

  return prisma.payment.update({
    where: { orderId },
    data: {
      proofUrl: uploadResult.secure_url,
      status: "PENDING",
    },
  });
};

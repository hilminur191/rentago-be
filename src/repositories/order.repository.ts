// Nurbani
import prisma from "../lib/prisma";
import { OrderStatus } from "@prisma/client";

export const createOrder = async (payload: {
  userId: string;
  roomId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
}) => {
  return prisma.order.create({
    data: {
      userId: payload.userId,
      roomId: payload.roomId,
      startDate: payload.startDate,
      endDate: payload.endDate,
      totalPrice: payload.totalPrice,
      status: "MENUNGGU_PEMBAYARAN",
      payment: {
        create: {
          paymentMethod: "TRANSFER",
          status: "PENDING",
        },
      },
    },
    include: {
      payment: true,
      room: true,
      user: true,
    },
  });
};

export const findOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      payment: true,
      room: { include: { property: true } },
      user: true,
    },
  });
};

export const attachPaymentProof = async (orderId: string, proofUrl: string) => {
  return prisma.payment.update({
    where: { orderId },
    data: {
      proofUrl,
      status: "PENDING", // tenant yang konfirmasi nanti
    },
  });
};

export const updatePaymentStatus = async (
  orderId: string,
  status: "CONFIRMED" | "REJECTED"
) => {
  return prisma.payment.update({
    where: { orderId },
    data: { status },
  });
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

export const findUserOrders = async (
  userId: string,
  skip = 0,
  take = 10,
  filters?: any
) => {
  const where: any = { userId };

  if (filters?.status) where.status = filters.status;
  if (filters?.orderNumber) where.id = filters.orderNumber;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { payment: true, room: { include: { property: true } } },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total };
};

export const findTenantOrders = async (
  tenantId: string,
  skip = 0,
  take = 10,
  filters?: any
) => {
  const where: any = {
    room: {
      property: {
        tenantId,
      },
    },
  };

  if (filters?.status) where.status = filters.status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        payment: true,
        room: { include: { property: true } },
        user: true,
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total };
};

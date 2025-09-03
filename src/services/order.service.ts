// Nurbani
import * as repo from "../repositories/order.repository";
import prisma from "../lib/prisma";

export const createOrderService = async (payload: {
  userId: string;
  roomId: string;
  startDate: string;
  endDate: string;
}) => {
  const { userId, roomId, startDate, endDate } = payload;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Hitung jumlah malam
  const nights = Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) throw new Error("Room not found");

  const totalPrice = Number(room.basePrice) * nights;

  const order = await repo.createOrder({
    userId,
    roomId,
    startDate: start,
    endDate: end,
    totalPrice,
  });

  return order;
};

export const uploadPaymentProofService = async (
  orderId: string,
  buffer: Buffer,
  uploadFn: (b: Buffer) => Promise<{ secure_url: string; public_id: string }>
) => {
  const order = await repo.findOrderById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "MENUNGGU_PEMBAYARAN") {
    throw new Error("Order cannot accept payment proof on its current status");
  }

  const { secure_url } = await uploadFn(buffer);
  await repo.attachPaymentProof(orderId, secure_url);
  await repo.updateOrderStatus(orderId, "MENUNGGU_KONFIRMASI");

  return { secure_url };
};

export const tenantConfirmPaymentService = async (
  orderId: string,
  tenantId: string,
  accept: boolean,
  sendEmailFn: (to: string, subject: string, html: string) => Promise<void>
) => {
  const order = await repo.findOrderById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.room.property.tenantId !== tenantId)
    throw new Error("Unauthorized");

  if (accept) {
    await repo.updatePaymentStatus(orderId, "CONFIRMED");
    await repo.updateOrderStatus(orderId, "DIKONFIRMASI");

    await sendEmailFn(
      order.user.email,
      "Pembayaran Dikonfirmasi",
      `<p>Pembayaran untuk order ${order.id} telah dikonfirmasi.</p>`
    );
  } else {
    await repo.updatePaymentStatus(orderId, "REJECTED");
    await repo.updateOrderStatus(orderId, "MENUNGGU_PEMBAYARAN");

    await sendEmailFn(
      order.user.email,
      "Pembayaran Ditolak",
      `<p>Pembayaran untuk order ${order.id} ditolak. Silakan upload ulang bukti pembayaran.</p>`
    );
  }

  return true;
};

export const getUserOrdersService = async (
  userId: string,
  page = 1,
  perPage = 10,
  filters?: any
) => {
  const skip = (page - 1) * perPage;
  return repo.findUserOrders(userId, skip, perPage, filters);
};

export const getTenantOrdersService = async (
  tenantId: string,
  page = 1,
  perPage = 10,
  filters?: any
) => {
  const skip = (page - 1) * perPage;
  return repo.findTenantOrders(tenantId, skip, perPage, filters);
};

export const cancelOrderService = async (
  orderId: string,
  requesterId: string,
  byTenant = false
) => {
  const order = await repo.findOrderById(orderId);
  if (!order) throw new Error("Order not found");

  if (!byTenant) {
    if (order.payment?.proofUrl)
      throw new Error("Cannot cancel after payment proof uploaded");
    if (order.userId !== requesterId) throw new Error("Unauthorized");
  } else {
    if (order.payment?.proofUrl)
      throw new Error("Cannot cancel after payment proof uploaded");
    if (order.room.property.tenantId !== requesterId)
      throw new Error("Unauthorized");
  }

  await repo.updatePaymentStatus(order.id, "REJECTED");
  await repo.updateOrderStatus(order.id, "DIBATALKAN");

  return true;
};

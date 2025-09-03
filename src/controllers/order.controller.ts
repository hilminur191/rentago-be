// Nurbani
import { Request, Response, NextFunction } from "express";
import * as svc from "../services/order.service";
import { uploadStream } from "../lib/cloudinary";
import { sendEmail } from "../lib/email.service";

// Type untuk params :id
type IdParam = {
  id: string;
};

// ---------------- USER CONTROLLER ----------------

// Buat pesanan baru
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id; // dari auth.middleware
    const { roomId, startDate, endDate } = req.body;

    const order = await svc.createOrderService({
      userId,
      roomId,
      startDate,
      endDate,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// Upload bukti pembayaran (Cloudinary)
export const uploadPaymentProof = async (
  req: Request<IdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = req.params.id;
    if (!req.file) throw new Error("No file uploaded");

    const buffer = req.file.buffer;
    const result = await svc.uploadPaymentProofService(
      orderId,
      buffer,
      uploadStream
    );

    res.json({ success: true, url: result.secure_url });
  } catch (err) {
    next(err);
  }
};

// Lihat daftar pesanan user
export const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    const filters = {
      status: req.query.status,
      orderNumber: req.query.orderNumber,
    };

    const data = await svc.getUserOrdersService(userId, page, perPage, filters);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Batalkan pesanan (oleh user)
export const cancelOrder = async (
  req: Request<IdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const orderId = req.params.id;

    await svc.cancelOrderService(orderId, userId, false);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// ---------------- TENANT CONTROLLER ----------------

// Tenant lihat daftar order
export const getTenantOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenantId = req.user!.id;
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    const filters = { status: req.query.status };

    const data = await svc.getTenantOrdersService(
      tenantId,
      page,
      perPage,
      filters
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Tenant konfirmasi pembayaran
export const tenantConfirmPayment = async (
  req: Request<IdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenantId = req.user!.id;
    const orderId = req.params.id;
    const { accept } = req.body; // boolean

    await svc.tenantConfirmPaymentService(
      orderId,
      tenantId,
      Boolean(accept),
      sendEmail
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Tenant batalkan pesanan
export const tenantCancelOrder = async (
  req: Request<IdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenantId = req.user!.id;
    const orderId = req.params.id;

    await svc.cancelOrderService(orderId, tenantId, true);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

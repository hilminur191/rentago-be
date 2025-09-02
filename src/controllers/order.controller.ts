// Nurbani
import { Request, Response } from "express";
import * as orderService from "../services/order.service";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // ambil dari JWT middleware
    const orders = await order.service.getOrders(userId);
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { roomId, startDate, endDate, paymentMethod } = req.body;
    const order = await order.service.createOrder(userId, {
      roomId,
      startDate,
      endDate,
      paymentMethod,
    });
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const order = await order.service.cancelOrder(userId, id);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const uploadPaymentProof = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const file = req.file;
    if (!file) throw new Error("File tidak ditemukan");

    const order = await order.service.uploadPaymentProof(userId, id, file);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

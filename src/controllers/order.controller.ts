// Nurbani
import { Request, Response } from "express";
import * as orderService from "../services/order.service";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // ambil dari JWT middleware
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const orders = await orderService.getOrders(userId);
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { roomId, startDate, endDate, paymentMethod } = req.body;
    const order = await orderService.createOrder(userId, {
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
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Order ID is required" });
    }
    const order = await orderService.cancelOrder(userId, id);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const uploadPaymentProof = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Order ID is required" });
    }
    const file = req.file;
    if (!file) throw new Error("File tidak ditemukan");

    const order = await orderService.uploadPaymentProof(userId, id, file);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

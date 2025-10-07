import { Request, Response } from "express";
import * as roomRepository from "../repositories/room.repository";

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const room = await roomRepository.getRoomById(roomId);
    return res.json({ data: room });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;
    if (!propertyId) {
      return res.status(400).json({ error: "propertyId is required" });
    }

    const room = await roomRepository.createRoom(propertyId, req.body);
    return res
      .status(201)
      .json({ message: "Room created successfully", data: room });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }

    const room = await roomRepository.updateRoom(roomId, req.body);
    return res.json({ message: "Room updated successfully", data: room });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }

    await roomRepository.deleteRoom(roomId);
    return res.json({ message: "Room deleted successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

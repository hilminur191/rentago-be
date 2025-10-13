import { Request, Response } from "express";
import {
  getRoomAvailabilityByDate,
  getRoomAvailabilityInRange,
  createRoomAvailability,
} from "../repositories/availability.repository";
import prisma from "../lib/prisma";

export const getAvailability = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { date, startDate, endDate } = req.query;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    if (date) {
      const availability = await getRoomAvailabilityByDate(
        roomId,
        date as string
      );

      if (!availability) {
        return res.status(404).json({
          message: `No availability found for room ${roomId} on ${date}`,
        });
      }

      return res.json({
        roomId,
        date,
        availability,
      });
    }

    if (startDate && endDate) {
      const availabilities = await getRoomAvailabilityInRange(
        roomId,
        startDate as string,
        endDate as string
      );

      return res.json({
        roomId,
        startDate,
        endDate,
        availabilities,
      });
    }

    return res.status(400).json({
      message:
        "Please provide either `date` or both `startDate` and `endDate` query parameters",
    });
  } catch (error) {
    console.error("getAvailability error:", error);
    return res.status(500).json({
      message: "Failed to get room availability",
      error: (error as Error).message,
    });
  }
};

export const createAvailability = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { date, availability } = req.body;

    if (!roomId || !date || availability === undefined) {
      return res.status(400).json({
        message: "roomId, date, and availability are required",
      });
    }

    const newAvailability = await prisma.roomAvailability.create({
      data: {
        roomId,
        date: new Date(date),
        availability: Number(availability),
      },
    });

    return res.status(201).json({
      message: "Room availability created successfully",
      data: newAvailability,
    });
  } catch (error: any) {
    console.error("createAvailability error:", error);
    if (
      error.code === "P2002" ||
      error.message.includes("Unique constraint failed")
    ) {
      return res.status(409).json({
        message: "Availability for this date already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create room availability",
      error: error.message,
    });
  }
};

import { Request, Response } from "express";
import {
  getRoomAvailabilityByDate,
  getRoomAvailabilityInRange,
} from "../repositories/availability.repository";

export const getAvailability = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { date, startDate, endDate } = req.query;

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

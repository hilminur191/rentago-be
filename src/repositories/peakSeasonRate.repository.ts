import prisma from "../lib/prisma";
import {
  CreatePeakSeasonRateDTO,
  UpdatePeakSeasonRateDTO,
  PeakSeasonRateResponse,
} from "../interfaces/peakSeasonRate.types";

export const PeakSeasonRateRepository = {
  async create(data: CreatePeakSeasonRateDTO): Promise<PeakSeasonRateResponse> {
    const created = await prisma.peakSeasonRate.create({
      data,
    });
    return created;
  },

  async findAll(roomId?: string): Promise<PeakSeasonRateResponse[]> {
    return prisma.peakSeasonRate.findMany({
      where: roomId ? { roomId } : undefined,
      orderBy: { startDate: "asc" },
    });
  },

  async findById(id: string): Promise<PeakSeasonRateResponse | null> {
  const result = await prisma.peakSeasonRate.findUnique({ where: { id } });
  return result;
},


  async update(
    id: string,
    data: UpdatePeakSeasonRateDTO
  ): Promise<PeakSeasonRateResponse> {
    const updated = await prisma.peakSeasonRate.update({
      where: { id },
      data,
    });
    return updated;
  },

  async delete(id: string): Promise<void> {
    await prisma.peakSeasonRate.delete({
      where: { id },
    });
  },

  async hasOverlap(
    roomId: string,
    startDate: Date,
    endDate: Date,
    excludeId?: string
  ): Promise<boolean> {
    const overlaps = await prisma.peakSeasonRate.findFirst({
      where: {
        roomId,
        id: excludeId ? { not: excludeId } : undefined,
        AND: [{ startDate: { lte: endDate } }, { endDate: { gte: startDate } }],
      },
    });

    return !!overlaps;
  },
};

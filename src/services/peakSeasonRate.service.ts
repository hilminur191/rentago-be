// src/services/peakSeasonRate.service.ts
import { PeakSeasonRateRepository } from "../repositories/peakSeasonRate.repository";
import {
  CreatePeakSeasonRateDTO,
  UpdatePeakSeasonRateDTO,
  PeakSeasonRateResponse,
} from "../interfaces/peakSeasonRate.types";

export const PeakSeasonRateService = {
  async createPeakSeasonRate(
    data: CreatePeakSeasonRateDTO
  ): Promise<PeakSeasonRateResponse> {
    if (data.endDate < data.startDate) {
      throw new Error("End date must be after start date");
    }

    // Cek overlap tanggal untuk room yang sama
    const overlap = await PeakSeasonRateRepository.hasOverlap(
      data.roomId,
      data.startDate,
      data.endDate
    );

    if (overlap) {
      throw new Error(
        "Peak season date range overlaps with an existing peak season rate"
      );
    }

    // Simpan ke DB
    return PeakSeasonRateRepository.create(data);
  },

  async getAllPeakSeasonRates(
    roomId?: string
  ): Promise<PeakSeasonRateResponse[]> {
    return PeakSeasonRateRepository.findAll(roomId);
  },

  async getPeakSeasonRateById(id: string): Promise<PeakSeasonRateResponse> {
    const rate = await PeakSeasonRateRepository.findById(id);
    if (!rate) {
      throw new Error("Peak season rate not found");
    }
    return rate;
  },

  async updatePeakSeasonRate(
    id: string,
    data: UpdatePeakSeasonRateDTO
  ): Promise<PeakSeasonRateResponse> {
    // Validasi tanggal
    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      throw new Error("End date must be after start date");
    }

    // Ambil data existing
    const existing = await PeakSeasonRateRepository.findById(id);
    if (!existing) {
      throw new Error("Peak season rate not found");
    }

    // Cek overlap jika tanggal berubah
    const startDate = data.startDate ?? existing.startDate;
    const endDate = data.endDate ?? existing.endDate;

    const overlap = await PeakSeasonRateRepository.hasOverlap(
      existing.roomId,
      startDate,
      endDate,
      id
    );

    if (overlap) {
      throw new Error(
        "Updated date range overlaps with another peak season rate"
      );
    }

    return PeakSeasonRateRepository.update(id, data);
  },

  async deletePeakSeasonRate(id: string): Promise<void> {
    const existing = await PeakSeasonRateRepository.findById(id);
    if (!existing) {
      throw new Error("Peak season rate not found");
    }

    await PeakSeasonRateRepository.delete(id);
  },
};

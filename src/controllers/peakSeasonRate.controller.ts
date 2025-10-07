import { Request, Response } from "express";
import { PeakSeasonRateService } from "../services/peakSeasonRate.service";
import {
  CreatePeakSeasonRateDTO,
  UpdatePeakSeasonRateDTO,
} from "../interfaces/peakSeasonRate.types";

type IdParam = { id: string };

export const createPeakSeasonRate = async (req: Request, res: Response) => {
  try {
    const data: CreatePeakSeasonRateDTO = req.body;
    const newRate = await PeakSeasonRateService.createPeakSeasonRate(data);
    res.status(201).json({
      success: true,
      message: "Peak season rate created successfully",
      data: newRate,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAllPeakSeasonRates = async (req: Request, res: Response) => {
  try {
    const rates = await PeakSeasonRateService.getAllPeakSeasonRates();
    res.status(200).json({
      success: true,
      data: rates,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getPeakSeasonRateById = async (
  req: Request<IdParam>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const rate = await PeakSeasonRateService.getPeakSeasonRateById(id);
    res.status(200).json({
      success: true,
      data: rate,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const updatePeakSeasonRate = async (
  req: Request<IdParam>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const data: UpdatePeakSeasonRateDTO = req.body;
    const updated = await PeakSeasonRateService.updatePeakSeasonRate(id, data);
    res.status(200).json({
      success: true,
      message: "Peak season rate updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deletePeakSeasonRate = async (
  req: Request<IdParam>,
  res: Response
) => {
  try {
    const { id } = req.params;
    await PeakSeasonRateService.deletePeakSeasonRate(id);
    res.status(200).json({
      success: true,
      message: "Peak season rate deleted successfully",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

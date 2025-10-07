export interface CreatePeakSeasonRateDTO {
  roomId: string;
  startDate: Date;
  endDate: Date;
  adjustmentType: "PERCENTAGE" | "NOMINAL";
  adjustmentValue: number;
}

export interface UpdatePeakSeasonRateDTO {
  id: string;
  startDate?: Date;
  endDate?: Date;
  adjustmentType?: "PERCENTAGE" | "NOMINAL";
  adjustmentValue?: number;
}

export interface PeakSeasonRateResponse {
  id: string;
  roomId: string;
  startDate: Date;
  endDate: Date;
  adjustmentType: "PERCENTAGE" | "NOMINAL";
  adjustmentValue: number;
  createdAt: Date;
  updatedAt: Date;
}

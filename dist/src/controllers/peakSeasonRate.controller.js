"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePeakSeasonRate = exports.updatePeakSeasonRate = exports.getPeakSeasonRateById = exports.getAllPeakSeasonRates = exports.createPeakSeasonRate = void 0;
const peakSeasonRate_service_1 = require("../services/peakSeasonRate.service");
const createPeakSeasonRate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const newRate = yield peakSeasonRate_service_1.PeakSeasonRateService.createPeakSeasonRate(data);
        res.status(201).json({
            success: true,
            message: "Peak season rate created successfully",
            data: newRate,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
});
exports.createPeakSeasonRate = createPeakSeasonRate;
const getAllPeakSeasonRates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rates = yield peakSeasonRate_service_1.PeakSeasonRateService.getAllPeakSeasonRates();
        res.status(200).json({
            success: true,
            data: rates,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
});
exports.getAllPeakSeasonRates = getAllPeakSeasonRates;
const getPeakSeasonRateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const rate = yield peakSeasonRate_service_1.PeakSeasonRateService.getPeakSeasonRateById(id);
        res.status(200).json({
            success: true,
            data: rate,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
});
exports.getPeakSeasonRateById = getPeakSeasonRateById;
const updatePeakSeasonRate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = yield peakSeasonRate_service_1.PeakSeasonRateService.updatePeakSeasonRate(id, data);
        res.status(200).json({
            success: true,
            message: "Peak season rate updated successfully",
            data: updated,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
});
exports.updatePeakSeasonRate = updatePeakSeasonRate;
const deletePeakSeasonRate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield peakSeasonRate_service_1.PeakSeasonRateService.deletePeakSeasonRate(id);
        res.status(200).json({
            success: true,
            message: "Peak season rate deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
});
exports.deletePeakSeasonRate = deletePeakSeasonRate;

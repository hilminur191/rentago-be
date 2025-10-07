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
exports.PeakSeasonRateService = void 0;
// src/services/peakSeasonRate.service.ts
const peakSeasonRate_repository_1 = require("../repositories/peakSeasonRate.repository");
exports.PeakSeasonRateService = {
    createPeakSeasonRate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.endDate < data.startDate) {
                throw new Error("End date must be after start date");
            }
            // Cek overlap tanggal untuk room yang sama
            const overlap = yield peakSeasonRate_repository_1.PeakSeasonRateRepository.hasOverlap(data.roomId, data.startDate, data.endDate);
            if (overlap) {
                throw new Error("Peak season date range overlaps with an existing peak season rate");
            }
            // Simpan ke DB
            return peakSeasonRate_repository_1.PeakSeasonRateRepository.create(data);
        });
    },
    getAllPeakSeasonRates(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return peakSeasonRate_repository_1.PeakSeasonRateRepository.findAll(roomId);
        });
    },
    getPeakSeasonRateById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rate = yield peakSeasonRate_repository_1.PeakSeasonRateRepository.findById(id);
            if (!rate) {
                throw new Error("Peak season rate not found");
            }
            return rate;
        });
    },
    updatePeakSeasonRate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // Validasi tanggal
            if (data.startDate && data.endDate && data.endDate < data.startDate) {
                throw new Error("End date must be after start date");
            }
            // Ambil data existing
            const existing = yield peakSeasonRate_repository_1.PeakSeasonRateRepository.findById(id);
            if (!existing) {
                throw new Error("Peak season rate not found");
            }
            // Cek overlap jika tanggal berubah
            const startDate = (_a = data.startDate) !== null && _a !== void 0 ? _a : existing.startDate;
            const endDate = (_b = data.endDate) !== null && _b !== void 0 ? _b : existing.endDate;
            const overlap = yield peakSeasonRate_repository_1.PeakSeasonRateRepository.hasOverlap(existing.roomId, startDate, endDate, id);
            if (overlap) {
                throw new Error("Updated date range overlaps with another peak season rate");
            }
            return peakSeasonRate_repository_1.PeakSeasonRateRepository.update(id, data);
        });
    },
    deletePeakSeasonRate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield peakSeasonRate_repository_1.PeakSeasonRateRepository.findById(id);
            if (!existing) {
                throw new Error("Peak season rate not found");
            }
            yield peakSeasonRate_repository_1.PeakSeasonRateRepository.delete(id);
        });
    },
};

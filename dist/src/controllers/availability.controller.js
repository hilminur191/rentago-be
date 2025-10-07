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
exports.getAvailability = void 0;
const availability_repository_1 = require("../repositories/availability.repository");
const getAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        const { date, startDate, endDate } = req.query;
        if (date) {
            const availability = yield (0, availability_repository_1.getRoomAvailabilityByDate)(roomId, date);
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
            const availabilities = yield (0, availability_repository_1.getRoomAvailabilityInRange)(roomId, startDate, endDate);
            return res.json({
                roomId,
                startDate,
                endDate,
                availabilities,
            });
        }
        return res.status(400).json({
            message: "Please provide either `date` or both `startDate` and `endDate` query parameters",
        });
    }
    catch (error) {
        console.error("getAvailability error:", error);
        return res.status(500).json({
            message: "Failed to get room availability",
            error: error.message,
        });
    }
});
exports.getAvailability = getAvailability;

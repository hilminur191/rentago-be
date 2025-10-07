"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomAvailabilityInRange = exports.getRoomAvailabilityByDate = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getRoomAvailabilityByDate = (roomId, date) => prisma_1.default.roomAvailability.findFirst({
    where: { roomId, date: new Date(date) },
});
exports.getRoomAvailabilityByDate = getRoomAvailabilityByDate;
const getRoomAvailabilityInRange = (roomId, startDate, endDate) => prisma_1.default.roomAvailability
    .findMany({
    where: {
        roomId,
        date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
        },
    },
    orderBy: { date: "asc" },
    include: {
        room: {
            select: {
                basePrice: true,
            },
        },
    },
})
    .then((data) => data.map((item) => (Object.assign(Object.assign({}, item), { price: item.room.basePrice }))));
exports.getRoomAvailabilityInRange = getRoomAvailabilityInRange;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDashboard = exports.getTenantDashboard = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getTenantDashboard = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ambil semua properti milik tenant
        const properties = yield prisma_1.default.property.findMany({
            where: { tenantId },
            include: {
                rooms: { select: { id: true } },
                pictures: true,
            },
        });
        const totalProperties = properties.length;
        const totalRooms = properties.reduce((acc, property) => acc + property.rooms.length, 0);
        return {
            totalProperties,
            totalRooms,
            properties,
        };
    }
    catch (error) {
        console.error("[Dashboard Service - Tenant] Error:", error);
        throw new Error("Gagal mengambil data dashboard tenant");
    }
});
exports.getTenantDashboard = getTenantDashboard;
const getUserDashboard = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservations = yield prisma_1.default.order.findMany({
            where: { userId },
            include: {
                room: {
                    include: { property: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return {
            totalReservations: reservations.length,
            reservations,
        };
    }
    catch (error) {
        console.error("[Dashboard Service - User] Error:", error);
        throw new Error("Gagal mengambil data dashboard user");
    }
});
exports.getUserDashboard = getUserDashboard;

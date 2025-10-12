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
exports.getDailyRevenueStats = exports.getMonthlyRevenueStats = exports.getYearlyRevenueStats = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const dayjs_1 = __importDefault(require("dayjs"));
const getYearlyRevenueStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!tenantId)
            return res.status(401).json({ message: "Unauthorized" });
        const currentYear = new Date().getFullYear();
        // Ambil semua order tahun ini milik tenant
        const orders = yield prisma_1.default.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(`${currentYear}-01-01`),
                    lte: new Date(`${currentYear}-12-31`),
                },
                room: {
                    property: {
                        tenantId,
                    },
                },
                payment: {
                    status: "CONFIRMED",
                },
            },
            select: {
                totalPrice: true,
                createdAt: true,
            },
        });
        // Buat array 12 bulan
        const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            totalRevenue: 0,
            totalOrders: 0,
        }));
        for (const order of orders) {
            const m = new Date(order.createdAt).getMonth();
            monthlyStats[m].totalOrders++;
            monthlyStats[m].totalRevenue += order.totalPrice;
        }
        res.json({
            year: currentYear,
            data: monthlyStats,
        });
    }
    catch (error) {
        console.error("Yearly revenue stats error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.getYearlyRevenueStats = getYearlyRevenueStats;
const getMonthlyRevenueStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!tenantId)
            return res.status(401).json({ message: "Unauthorized" });
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month);
        if (!month || month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month" });
        }
        const startDate = new Date(`${year}-${String(month).padStart(2, "0")}-01`);
        const endDate = (0, dayjs_1.default)(startDate).endOf("month").toDate();
        const orders = yield prisma_1.default.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                room: {
                    property: {
                        tenantId,
                    },
                },
                payment: {
                    status: "CONFIRMED",
                },
            },
            select: {
                totalPrice: true,
                createdAt: true,
            },
        });
        const daysInMonth = (0, dayjs_1.default)(startDate).daysInMonth();
        const dailyStats = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            totalRevenue: 0,
            totalOrders: 0,
        }));
        for (const order of orders) {
            const d = new Date(order.createdAt).getDate();
            dailyStats[d - 1].totalOrders++;
            dailyStats[d - 1].totalRevenue += order.totalPrice;
        }
        res.json({
            year,
            month,
            data: dailyStats,
        });
    }
    catch (error) {
        console.error("Monthly revenue stats error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.getMonthlyRevenueStats = getMonthlyRevenueStats;
const getDailyRevenueStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!tenantId)
            return res.status(401).json({ message: "Unauthorized" });
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month);
        const day = parseInt(req.query.day);
        if (!month || !day) {
            return res
                .status(400)
                .json({ message: "Month and day are required (1-12, 1-31)" });
        }
        const startDate = new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00`);
        const endDate = (0, dayjs_1.default)(startDate).endOf("day").toDate();
        const orders = yield prisma_1.default.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                room: {
                    property: {
                        tenantId,
                    },
                },
                payment: {
                    status: "CONFIRMED",
                },
            },
            select: {
                id: true,
                totalPrice: true,
                room: {
                    select: {
                        property: {
                            select: { name: true, id: true },
                        },
                    },
                },
            },
        });
        // Group per properti
        const dailyStats = {};
        for (const order of orders) {
            const propertyId = order.room.property.id;
            if (!dailyStats[propertyId]) {
                dailyStats[propertyId] = {
                    propertyName: order.room.property.name,
                    totalRevenue: 0,
                    totalOrders: 0,
                };
            }
            dailyStats[propertyId].totalRevenue += order.totalPrice;
            dailyStats[propertyId].totalOrders++;
        }
        res.json({
            date: startDate,
            data: Object.values(dailyStats),
        });
    }
    catch (error) {
        console.error("Daily revenue stats error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.getDailyRevenueStats = getDailyRevenueStats;

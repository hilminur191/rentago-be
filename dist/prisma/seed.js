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
// prisma/seed.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function seedPeakSeasonRates() {
    return __awaiter(this, void 0, void 0, function* () {
        const rooms = yield prisma.room.findMany();
        if (rooms.length === 0) {
            console.warn("⚠️ Tidak ada room di database. Buat minimal 1 room sebelum melakukan seed peak season rate.");
            return;
        }
        const roomsToSeed = rooms.slice(0, 3);
        // Contoh data peak season: Natal & Tahun Baru (pakai persentase), Liburan tengah tahun (pakai nominal)
        const peakSeasonTemplates = [
            {
                startDate: new Date("2025-12-20"),
                endDate: new Date("2026-01-05"),
                adjustmentType: "PERCENTAGE",
                adjustmentValue: 20, // misal +20%
            },
            {
                startDate: new Date("2026-07-01"),
                endDate: new Date("2026-07-10"),
                adjustmentType: "NOMINAL",
                adjustmentValue: 150000, // misal tambahan harga tetap
            },
        ];
        for (const room of roomsToSeed) {
            for (const season of peakSeasonTemplates) {
                // Cek jika sudah ada season yang sama agar tidak duplikat
                const existing = yield prisma.peakSeasonRate.findFirst({
                    where: {
                        roomId: room.id,
                        startDate: season.startDate,
                        endDate: season.endDate,
                    },
                });
                if (existing) {
                    console.log(`ℹ️ Peak season rate untuk room ${room.id} (${season.startDate
                        .toISOString()
                        .slice(0, 10)}) sudah ada. Lewati.`);
                    continue;
                }
                yield prisma.peakSeasonRate.create({
                    data: {
                        roomId: room.id,
                        startDate: season.startDate,
                        endDate: season.endDate,
                        adjustmentType: season.adjustmentType,
                        adjustmentValue: season.adjustmentValue,
                    },
                });
                console.log(`✅ Peak season rate untuk room ${room.id} (${season.startDate
                    .toISOString()
                    .slice(0, 10)} - ${season.endDate
                    .toISOString()
                    .slice(0, 10)}) berhasil dibuat.`);
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🌱 Memulai proses seeding peak season rate...");
        yield seedPeakSeasonRates();
        console.log("🌿 Seeding selesai!");
    });
}
main()
    .catch((e) => {
    console.error("❌ Terjadi error saat seeding:", e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));

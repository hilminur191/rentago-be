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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const propertyId = "8a9a77ae-7667-4bf3-a0ca-922c5b8e92df";
        const userId = "a4bbac30-420f-43d3-966b-76be9646cfdb"; // Ganti dengan user yang sudah ada
        // Ambil semua room milik properti ini
        const rooms = yield prisma.room.findMany({
            where: { propertyId },
        });
        if (rooms.length === 0) {
            console.error(`❌ Tidak ditemukan room untuk propertyId: ${propertyId}`);
            return;
        }
        console.log(`✅ Ditemukan ${rooms.length} room. Membuat order...`);
        // Pilih beberapa room secara acak atau pakai index tertentu
        const room1 = rooms[0];
        const room2 = rooms[1] || rooms[0];
        // Buat beberapa order dengan payment CONFIRMED
        yield prisma.order.create({
            data: {
                userId,
                roomId: room1.id,
                startDate: new Date("2025-09-10"),
                endDate: new Date("2025-09-12"),
                totalPrice: 1500000,
                status: "DIKONFIRMASI",
                payment: {
                    create: {
                        paymentMethod: "TRANSFER",
                        proofUrl: "https://example.com/proof1.jpg",
                        status: "CONFIRMED",
                    },
                },
            },
        });
        yield prisma.order.create({
            data: {
                userId,
                roomId: room2.id,
                startDate: new Date("2025-09-22"),
                endDate: new Date("2025-09-24"),
                totalPrice: 2400000,
                status: "DIKONFIRMASI",
                payment: {
                    create: {
                        paymentMethod: "GATEWAY",
                        proofUrl: "https://example.com/proof2.jpg",
                        status: "CONFIRMED",
                    },
                },
            },
        });
        yield prisma.order.create({
            data: {
                userId,
                roomId: room1.id,
                startDate: new Date("2025-10-01"),
                endDate: new Date("2025-10-03"),
                totalPrice: 1800000,
                status: "DIKONFIRMASI",
                payment: {
                    create: {
                        paymentMethod: "TRANSFER",
                        proofUrl: "https://example.com/proof3.jpg",
                        status: "CONFIRMED",
                    },
                },
            },
        });
        console.log(`✅ Order + payment untuk properti ${propertyId} berhasil dibuat`);
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));

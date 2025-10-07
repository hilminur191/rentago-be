// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPeakSeasonRates() {
  const rooms = await prisma.room.findMany();

  if (rooms.length === 0) {
    console.warn(
      "⚠️ Tidak ada room di database. Buat minimal 1 room sebelum melakukan seed peak season rate."
    );
    return;
  }

  const roomsToSeed = rooms.slice(0, 3);

  // Contoh data peak season: Natal & Tahun Baru (pakai persentase), Liburan tengah tahun (pakai nominal)
  const peakSeasonTemplates = [
    {
      startDate: new Date("2025-12-20"),
      endDate: new Date("2026-01-05"),
      adjustmentType: "PERCENTAGE" as const,
      adjustmentValue: 20, // misal +20%
    },
    {
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-07-10"),
      adjustmentType: "NOMINAL" as const,
      adjustmentValue: 150000, // misal tambahan harga tetap
    },
  ];

  for (const room of roomsToSeed) {
    for (const season of peakSeasonTemplates) {
      // Cek jika sudah ada season yang sama agar tidak duplikat
      const existing = await prisma.peakSeasonRate.findFirst({
        where: {
          roomId: room.id,
          startDate: season.startDate,
          endDate: season.endDate,
        },
      });

      if (existing) {
        console.log(
          `ℹ️ Peak season rate untuk room ${room.id} (${season.startDate
            .toISOString()
            .slice(0, 10)}) sudah ada. Lewati.`
        );
        continue;
      }

      await prisma.peakSeasonRate.create({
        data: {
          roomId: room.id,
          startDate: season.startDate,
          endDate: season.endDate,
          adjustmentType: season.adjustmentType,
          adjustmentValue: season.adjustmentValue,
        },
      });

      console.log(
        `✅ Peak season rate untuk room ${room.id} (${season.startDate
          .toISOString()
          .slice(0, 10)} - ${season.endDate
          .toISOString()
          .slice(0, 10)}) berhasil dibuat.`
      );
    }
  }
}

async function main() {
  console.log("🌱 Memulai proses seeding peak season rate...");
  await seedPeakSeasonRates();
  console.log("🌿 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";
import { addDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  // Ambil semua room
  const rooms = await prisma.room.findMany();

  const today = new Date();
  const threeMonthsFromNow = addDays(today, 90); // 3 bulan ke depan

  for (const room of rooms) {
    const quantity = room.quantity ?? 1; // fallback ke 1 kalau null
    const availabilities = [];

    // Generate availability per hari
    for (let d = new Date(today); d <= threeMonthsFromNow; d = addDays(d, 1)) {
      availabilities.push({
        roomId: room.id,
        date: d,
        availability: quantity,
      });
    }

    // Simulasi tanggal fully booked (10% dari total)
    const totalDays = availabilities.length;
    const fullyBookedCount = Math.floor(totalDays * 0.1); // 10%
    const randomIndexes = new Set<number>();

    while (randomIndexes.size < fullyBookedCount) {
      randomIndexes.add(Math.floor(Math.random() * totalDays));
    }

    for (const index of randomIndexes) {
      availabilities[index].availability = 0;
    }

    // Insert ke DB
    await prisma.roomAvailability.createMany({
      data: availabilities,
    });

    console.log(
      `✅ Availability created for room "${room.name}" (${availabilities.length} records)`
    );
  }

  console.log("🌱 Room availability seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const propertyId = "8a9a77ae-7667-4bf3-a0ca-922c5b8e92df";
  const userId = "a4bbac30-420f-43d3-966b-76be9646cfdb"; // Ganti dengan user yang sudah ada

  // Ambil semua room milik properti ini
  const rooms = await prisma.room.findMany({
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
  await prisma.order.create({
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

  await prisma.order.create({
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

  await prisma.order.create({
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

  console.log(
    `✅ Order + payment untuk properti ${propertyId} berhasil dibuat`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import prisma from "../lib/prisma";
import { ICreatePropertyParam } from "../interfaces/property.types";

export async function createPropertyWithRooms(params: ICreatePropertyParam) {
  return prisma.$transaction(async (tx) => {
    // tentukan categoryId (harus terisi sebelum create property)
    let categoryId = params.categoryId;

    if (!categoryId && params.categoryName) {
      const newCategory = await tx.propertyCategory.create({
        data: { name: params.categoryName },
      });
      categoryId = newCategory.id;
    }

    if (!categoryId) {
      throw new Error("CategoryId or categoryName must be provided");
    }

    // buat property
    const property = await tx.property.create({
      data: {
        tenantId: params.tenantId,
        categoryId: categoryId, // di sini sudah pasti string
        name: params.name,
        description: params.description,
        address: params.address,
        city: params.city,
        province: params.province,
        picture: params.picture ?? null,
      },
    });

    // buat rooms (jika ada)
    if (params.rooms && params.rooms.length > 0) {
      await tx.room.createMany({
        data: params.rooms.map((room) => ({
          propertyId: property.id,
          name: room.name,
          description: room.description ?? null,
          basePrice: room.basePrice,
          capacity: room.capacity,
        })),
      });
    }

    // ambil hasil lengkap
    const result = await tx.property.findUnique({
      where: { id: property.id },
      include: {
        rooms: true,
        category: true,
        tenant: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return result;
  });
}

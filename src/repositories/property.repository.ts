import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import {
  ICreatePropertyParam,
  PropertyQuery,
} from "../interfaces/property.types";
import {
  mapPropertyWithMinPrice,
  buildPropertyFilters,
  paginate,
} from "../helpers/property";

export async function createPropertyWithRooms(params: ICreatePropertyParam) {
  return prisma.$transaction(async (tx) => {
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

    const property = await tx.property.create({
      data: {
        tenantId: params.tenantId,
        categoryId,
        name: params.name,
        description: params.description,
        address: params.address,
        city: params.city,
        province: params.province,
        pictures: {
          create: (params.pictures ?? []).map((url) => ({ url })),
        },
        rooms: {
          create: (params.rooms ?? []).map((room) => ({
            name: room.name,
            description: room.description ?? null,
            basePrice: room.basePrice,
            capacity: room.capacity,
            quantity: room.quantity ?? 1,
          })),
        },
      },
      include: {
        pictures: true,
        rooms: true,
        category: true,
        tenant: { select: { id: true, name: true, email: true } },
      },
    });

    return property;
  });
}

export async function getAllProperties(
  page = 1,
  limit = 9,
  filter?: { categoryId?: string; name?: string }
) {
  const { skip, take, pageNumber, pageSize } = paginate(page, limit);

  const where: Prisma.PropertyWhereInput = {
    ...(filter?.categoryId ? { categoryId: filter.categoryId } : {}),
    ...(filter?.name
      ? { name: { contains: filter.name, mode: "insensitive" } }
      : {}),
  };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      where,
      include: {
        pictures: true,
        rooms: true,
        category: true,
      },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties: properties.map(mapPropertyWithMinPrice),
    total,
    page: pageNumber,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPropertyById(propertyId: string) {
  return prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
    include: {
      pictures: true,
      category: true,
      rooms: {
        include: {
          availability: true,
        },
      },
    },
  });
}

export const updateProperty = (id: string, data: Prisma.PropertyUpdateInput) =>
  prisma.property.update({ where: { id }, data });

export const deleteProperty = (id: string) =>
  prisma.property.delete({ where: { id } });

export async function getFilteredProperties(query: PropertyQuery) {
  const { skip, take, pageNumber, pageSize } = paginate(
    query.page,
    query.limit
  );
  const filters = buildPropertyFilters(query);

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: filters,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        pictures: true,
        rooms: { select: { basePrice: true } },
        category: true,
      },
    }),
    prisma.property.count({ where: filters }),
  ]);

  return {
    properties: properties.map(mapPropertyWithMinPrice),
    total,
    page: pageNumber,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

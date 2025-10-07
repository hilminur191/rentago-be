import { Prisma } from "@prisma/client";
import { PropertyQuery } from "../interfaces/property.types";

export const mapPropertyWithMinPrice = (p: any) => {
  const prices =
    p.rooms
      ?.map((r: any) => Number(r.basePrice))
      .filter((n: number) => !isNaN(n)) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  return { ...p, minPrice };
};

export const paginate = (page: any, limit: any) => {
  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 9;
  const skip = (pageNumber - 1) * pageSize;
  const take = pageSize;

  return { skip, take, pageNumber, pageSize };
};

export const buildPropertyFilters = (
  query: PropertyQuery
): Prisma.PropertyWhereInput => {
  const { search = "", categoryId, city, province, minPrice, maxPrice } = query;

  return {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
    ...(province
      ? { province: { contains: province, mode: "insensitive" } }
      : {}),
    ...(minPrice || maxPrice
      ? {
          rooms: {
            some: {
              basePrice: {
                ...(minPrice ? { gte: Number(minPrice) } : {}),
                ...(maxPrice ? { lte: Number(maxPrice) } : {}),
              },
            },
          },
        }
      : {}),
  };
};

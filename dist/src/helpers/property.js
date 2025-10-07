"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPropertyFilters = exports.paginate = exports.mapPropertyWithMinPrice = void 0;
const mapPropertyWithMinPrice = (p) => {
    var _a;
    const prices = ((_a = p.rooms) === null || _a === void 0 ? void 0 : _a.map((r) => Number(r.basePrice)).filter((n) => !isNaN(n))) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    return Object.assign(Object.assign({}, p), { minPrice });
};
exports.mapPropertyWithMinPrice = mapPropertyWithMinPrice;
const paginate = (page, limit) => {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 9;
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;
    return { skip, take, pageNumber, pageSize };
};
exports.paginate = paginate;
const buildPropertyFilters = (query) => {
    const { search = "", categoryId, city, province, minPrice, maxPrice } = query;
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (search
        ? {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
                { city: { contains: search, mode: "insensitive" } },
            ],
        }
        : {})), (categoryId ? { categoryId } : {})), (city ? { city: { contains: city, mode: "insensitive" } } : {})), (province
        ? { province: { contains: province, mode: "insensitive" } }
        : {})), (minPrice || maxPrice
        ? {
            rooms: {
                some: {
                    basePrice: Object.assign(Object.assign({}, (minPrice ? { gte: Number(minPrice) } : {})), (maxPrice ? { lte: Number(maxPrice) } : {})),
                },
            },
        }
        : {}));
};
exports.buildPropertyFilters = buildPropertyFilters;

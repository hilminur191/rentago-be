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
exports.deleteProperty = exports.updateProperty = void 0;
exports.createPropertyWithRooms = createPropertyWithRooms;
exports.getAllProperties = getAllProperties;
exports.getPropertyById = getPropertyById;
exports.getFilteredProperties = getFilteredProperties;
const prisma_1 = __importDefault(require("../lib/prisma"));
const property_1 = require("../helpers/property");
function createPropertyWithRooms(params) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let categoryId = params.categoryId;
            if (!categoryId && params.categoryName) {
                const newCategory = yield tx.propertyCategory.create({
                    data: { name: params.categoryName },
                });
                categoryId = newCategory.id;
            }
            if (!categoryId) {
                throw new Error("CategoryId or categoryName must be provided");
            }
            const property = yield tx.property.create({
                data: {
                    tenantId: params.tenantId,
                    categoryId,
                    name: params.name,
                    description: params.description,
                    address: params.address,
                    city: params.city,
                    province: params.province,
                    pictures: {
                        create: ((_a = params.pictures) !== null && _a !== void 0 ? _a : []).map((url) => ({ url })),
                    },
                    rooms: {
                        create: ((_b = params.rooms) !== null && _b !== void 0 ? _b : []).map((room) => {
                            var _a, _b;
                            return ({
                                name: room.name,
                                description: (_a = room.description) !== null && _a !== void 0 ? _a : null,
                                basePrice: room.basePrice,
                                capacity: room.capacity,
                                quantity: (_b = room.quantity) !== null && _b !== void 0 ? _b : 1,
                            });
                        }),
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
        }));
    });
}
function getAllProperties() {
    return __awaiter(this, arguments, void 0, function* (page = 1, limit = 9, filter) {
        const { skip, take, pageNumber, pageSize } = (0, property_1.paginate)(page, limit);
        const where = Object.assign(Object.assign({}, ((filter === null || filter === void 0 ? void 0 : filter.categoryId) ? { categoryId: filter.categoryId } : {})), ((filter === null || filter === void 0 ? void 0 : filter.name)
            ? { name: { contains: filter.name, mode: "insensitive" } }
            : {}));
        const [properties, total] = yield Promise.all([
            prisma_1.default.property.findMany({
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
            prisma_1.default.property.count({ where }),
        ]);
        return {
            properties: properties.map(property_1.mapPropertyWithMinPrice),
            total,
            page: pageNumber,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    });
}
function getPropertyById(propertyId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.property.findUniqueOrThrow({
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
    });
}
const updateProperty = (id, data) => prisma_1.default.property.update({ where: { id }, data });
exports.updateProperty = updateProperty;
const deleteProperty = (id) => prisma_1.default.property.delete({ where: { id } });
exports.deleteProperty = deleteProperty;
function getFilteredProperties(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const { skip, take, pageNumber, pageSize } = (0, property_1.paginate)(query.page, query.limit);
        const filters = (0, property_1.buildPropertyFilters)(query);
        const [properties, total] = yield Promise.all([
            prisma_1.default.property.findMany({
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
            prisma_1.default.property.count({ where: filters }),
        ]);
        return {
            properties: properties.map(property_1.mapPropertyWithMinPrice),
            total,
            page: pageNumber,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    });
}

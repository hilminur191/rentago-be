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
exports.createProperty = createProperty;
exports.getProperties = getProperties;
exports.getProperty = getProperty;
exports.updatePropertyController = updatePropertyController;
exports.deletePropertyController = deletePropertyController;
exports.getAllFilteredProperties = getAllFilteredProperties;
const property_repository_1 = require("../repositories/property.repository");
function createProperty(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { tenantId, categoryId, categoryName, name, description, address, city, province, pictures, rooms, } = req.body;
            if (!tenantId)
                return res.status(400).json({ error: "tenantId is required" });
            if (!categoryId && !categoryName) {
                return res.status(400).json({ error: "Either categoryId or categoryName is required" });
            }
            if (!name)
                return res.status(400).json({ error: "name is required" });
            if (!description)
                return res.status(400).json({ error: "description is required" });
            if (!address)
                return res.status(400).json({ error: "address is required" });
            if (!city)
                return res.status(400).json({ error: "city is required" });
            if (!province)
                return res.status(400).json({ error: "province is required" });
            const newProperty = yield (0, property_repository_1.createPropertyWithRooms)(Object.assign(Object.assign(Object.assign({ tenantId }, (categoryId && { categoryId })), (categoryName && { categoryName })), { name,
                description,
                address,
                city,
                province, pictures: pictures !== null && pictures !== void 0 ? pictures : [], rooms: rooms !== null && rooms !== void 0 ? rooms : [] }));
            return res.status(201).json({
                message: "Property created successfully",
                data: newProperty,
            });
        }
        catch (error) {
            console.error("Error creating property:", error);
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
    });
}
function getProperties(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const properties = yield (0, property_repository_1.getAllProperties)();
            return res.json({ data: properties });
        }
        catch (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
    });
}
function getProperty(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id)
                return res.status(400).json({ error: "Invalid property id" });
            const property = yield (0, property_repository_1.getPropertyById)(id);
            if (!property)
                return res.status(404).json({ error: "Property not found" });
            return res.json({ data: property });
        }
        catch (error) {
            return res
                .status(500)
                .json({ error: error.message || "Internal server error" });
        }
    });
}
function updatePropertyController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: "Invalid property id" });
            }
            const updated = yield (0, property_repository_1.updateProperty)(id, req.body);
            return res.json({
                message: "Property updated successfully",
                data: updated,
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
    });
}
function deletePropertyController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: "Invalid property id" });
            }
            yield (0, property_repository_1.deleteProperty)(id);
            return res.json({ message: "Property deleted successfully" });
        }
        catch (error) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
    });
}
function getAllFilteredProperties(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { search, city, province, categoryId, minPrice, maxPrice, page, limit, } = req.query;
            const query = {
                search: search ? String(search) : undefined,
                city: city ? String(city) : undefined,
                province: province ? String(province) : undefined,
                categoryId: categoryId ? String(categoryId) : undefined,
                page: page ? String(page) : "1",
                limit: limit ? String(limit) : "9",
                minPrice: minPrice ? String(minPrice) : undefined,
                maxPrice: maxPrice ? String(maxPrice) : undefined,
            };
            const properties = yield (0, property_repository_1.getFilteredProperties)(query);
            return res.json(Object.assign({ message: "Filtered properties fetched successfully" }, properties));
        }
        catch (error) {
            console.error("Error filtering properties:", error);
            return res
                .status(500)
                .json({ error: error.message || "Internal server error" });
        }
    });
}

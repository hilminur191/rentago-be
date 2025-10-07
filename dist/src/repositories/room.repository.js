"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoom = exports.createRoom = exports.getRoomById = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getRoomById = (roomId) => prisma_1.default.room.findUniqueOrThrow({
    where: { id: roomId },
    include: {
        availability: true,
        property: true,
    },
});
exports.getRoomById = getRoomById;
const createRoom = (propertyId, data) => prisma_1.default.room.create({
    data: Object.assign(Object.assign({}, data), { propertyId }),
});
exports.createRoom = createRoom;
const updateRoom = (roomId, data) => prisma_1.default.room.update({ where: { id: roomId }, data });
exports.updateRoom = updateRoom;
const deleteRoom = (roomId) => prisma_1.default.room.delete({ where: { id: roomId } });
exports.deleteRoom = deleteRoom;

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
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profilePicture: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    });
}
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profilePicture: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    });
}
function createUser(token, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        const salt = (0, bcrypt_1.genSaltSync)(10);
        const hashed = (0, bcrypt_1.hashSync)(password, salt);
        return prisma_1.default.user.create({
            data: {
                role: decoded.role,
                name: decoded.name,
                email: decoded.email,
                password: hashed,
                isVerified: true,
            },
        });
    });
}
// export async function updateUser(
//   id: string,
//   params: IUpdateUserParam,
//   file?: Express.Multer.File
// ) {
//   if (params.password) {
//     const salt = genSaltSync(10);
//     params.password = hashSync(params.password, salt);
//   }
//   let profilePictureUrl: string | null = null;
//   if (file) {
//     const uploaded = await cloudinaryUpload(file);
//     profilePictureUrl = uploaded.secure_url;
//   } else if (
//     params.profilePicture &&
//     typeof params.profilePicture !== "string"
//   ) {
//     const uploaded = await cloudinaryUpload(params.profilePicture);
//     profilePictureUrl = uploaded.secure_url;
//   } else if (typeof params.profilePicture === "string") {
//     profilePictureUrl = params.profilePicture;
//   }
//   return prisma.user.update({
//     where: { id },
//     data: {
//       ...params,
//       profilePicture: profilePictureUrl,
//     },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       role: true,
//       profilePicture: true,
//       isVerified: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });
// }
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
    });
}

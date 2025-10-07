"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getAllUsersController = getAllUsersController;
exports.getUserByIdController = getUserByIdController;
exports.createUserController = createUserController;
exports.deleteUserController = deleteUserController;
exports.getUserDetailController = getUserDetailController;
const userRepo = __importStar(require("../repositories/user.repository"));
const prisma_1 = __importDefault(require("../lib/prisma"));
// Get all users
function getAllUsersController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield userRepo.getAllUsers();
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    });
}
// Get user by id
function getUserByIdController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userRepo.getUserById(req.params.id);
            if (!user)
                return res.status(404).json({ message: "User not found" });
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    });
}
// Create user after email verification
function createUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                return res
                    .status(400)
                    .json({ message: "Token and password are required" });
            }
            const createdUser = yield userRepo.createUser(token, password);
            return res.status(201).json(createdUser);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
}
// Update user
// export async function updateUserController(
//   req: Request<{ id: string }>,
//   res: Response
// ) {
//   try {
//     const updatedUser = await userRepo.updateUser(req.params.id, req.body);
//     return res.status(200).json(updatedUser);
//   } catch (error: any) {
//     return res.status(400).json({ message: error.message });
//   }
// }
// Delete user
function deleteUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield userRepo.deleteUser(req.params.id);
            return res.status(204).send();
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
}
// User details (pakai JWT middleware)
function getUserDetailController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    profilePicture: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!user)
                return res.status(404).json({ message: "User not found" });
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    });
}

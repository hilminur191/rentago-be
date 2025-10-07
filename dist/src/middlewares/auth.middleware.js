"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.tenantGuard = tenantGuard;
exports.userGuard = userGuard;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY || "Rentago2025";
// Middleware utama: token JWT
function verifyToken(req, res, next) {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token)
            throw new Error("Unauthorized");
        const verifyToken = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        if (!verifyToken)
            throw new Error("Invalid token");
        req.user = verifyToken;
        next();
    }
    catch (error) {
        next(error);
    }
}
// Middleware khusus role: Tenant
function tenantGuard(req, res, next) {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "TENANT") {
            throw new Error("Forbidden: Tenant only");
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
// Middleware khusus role: User
function userGuard(req, res, next) {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "USER") {
            throw new Error("Forbidden: User only");
        }
        next();
    }
    catch (error) {
        next(error);
    }
}

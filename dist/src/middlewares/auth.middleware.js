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
// ✅ Middleware utama: verifikasi JWT
function verifyToken(req, res, next) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Token not provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
}
// ✅ Middleware khusus role: Tenant
function tenantGuard(req, res, next) {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "TENANT") {
        return res.status(403).json({ error: "Forbidden: Tenant only" });
    }
    next();
}
// ✅ Middleware khusus role: User
function userGuard(req, res, next) {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "USER") {
        return res.status(403).json({ error: "Forbidden: User only" });
    }
    next();
}

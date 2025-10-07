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
exports.findUserByEmail = findUserByEmail;
exports.registerUser = registerUser;
exports.checkVerifyToken = checkVerifyToken;
exports.createUserAfterVerify = createUserAfterVerify;
exports.requestResetPassword = requestResetPassword;
exports.confirmResetPassword = confirmResetPassword;
exports.loginUser = loginUser;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("../utils/nodemailer"));
const bcrypt_2 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.findUnique({ where: { email } });
    });
}
function registerUser(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const existing = yield prisma_1.default.user.findUnique({
            where: { email: params.email },
        });
        if (existing)
            throw new Error("Email already registered");
        const token = (0, crypto_1.randomUUID)();
        const expiredAt = new Date(Date.now() + 1000 * 60 * 60);
        yield prisma_1.default.temporaryToken.create({
            data: {
                token,
                expiredAt,
                type: "VERIFY_EMAIL",
                user: {
                    create: {
                        email: params.email,
                        name: params.name || "New User",
                        role: params.role,
                        password: "",
                        isVerified: false,
                    },
                },
            },
        });
        const link = `http://localhost:3000/auth/verify-email?token=${token}`;
        yield nodemailer_1.default.sendMail({
            from: `"Rentago" <rentago.project@gmail.com>`,
            to: params.email,
            subject: "Verify your email",
            html: `
      <p>Hello ${params.name || "User"},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${link}">${link}</a>
    `,
        });
        return { message: "Verification email sent" };
    });
}
function checkVerifyToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const temp = yield prisma_1.default.temporaryToken.findUnique({ where: { token } });
        if (!temp || temp.expiredAt < new Date())
            return null;
        return temp;
    });
}
function createUserAfterVerify(token, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const tempToken = yield prisma_1.default.temporaryToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!tempToken)
            throw new Error("Invalid token");
        if (tempToken.expiredAt < new Date())
            throw new Error("Token expired");
        if (tempToken.type !== "VERIFY_EMAIL")
            throw new Error("Invalid token type");
        const salt = (0, bcrypt_1.genSaltSync)(10);
        const hashed = (0, bcrypt_1.hashSync)(password, salt);
        const user = yield prisma_1.default.user.update({
            where: { id: tempToken.userId },
            data: {
                password: hashed,
                isVerified: true,
            },
        });
        yield prisma_1.default.temporaryToken.delete({ where: { id: tempToken.id } });
        return user;
    });
}
function requestResetPassword(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("User not found");
        if (!user.password)
            throw new Error("Reset password not available for social login");
        const token = (0, crypto_1.randomUUID)();
        const expiredAt = new Date(Date.now() + 1000 * 60 * 30);
        yield prisma_1.default.temporaryToken.create({
            data: {
                token,
                expiredAt,
                type: "RESET_PASSWORD",
                userId: user.id,
            },
        });
        const link = `http://localhost:3000/auth/reset-password/confirm?token=${token}`;
        yield nodemailer_1.default.sendMail({
            from: `"Rentago" <rentago.project@gmail.com>`,
            to: email,
            subject: "Reset your password",
            html: `
      <p>Hello ${user.name || "User"},</p>
      <p>We received a request to reset your password. Click the link below to continue:</p>
      <a href="${link}">${link}</a>
      <p>This link will expire in 30 minutes. If you didn’t request this, you can ignore it.</p>
    `,
        });
        return { message: "Reset password email sent" };
    });
}
function confirmResetPassword(token, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const tempToken = yield prisma_1.default.temporaryToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!tempToken)
            throw new Error("Invalid token");
        if (tempToken.expiredAt < new Date())
            throw new Error("Token expired");
        if (tempToken.type !== "RESET_PASSWORD")
            throw new Error("Invalid token type");
        const salt = (0, bcrypt_1.genSaltSync)(10);
        const hashed = (0, bcrypt_1.hashSync)(newPassword, salt);
        const user = yield prisma_1.default.user.update({
            where: { id: tempToken.userId },
            data: { password: hashed },
        });
        yield prisma_1.default.temporaryToken.delete({ where: { id: tempToken.id } });
        return { message: "Password has been reset successfully", userId: user.id };
    });
}
function loginUser(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = params;
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("User not found");
        if (!user.isVerified) {
            throw new Error("Account not verified");
        }
        // cek password
        const isMatch = yield bcrypt_2.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }, process.env.SECRET_KEY, { expiresIn: "1d" });
        return {
            token,
            user: {
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email,
            },
        };
    });
}

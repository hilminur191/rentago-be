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
exports.loginUserController = loginUserController;
exports.registerEmailController = registerEmailController;
exports.verifyEmailTokenController = verifyEmailTokenController;
exports.setPasswordController = setPasswordController;
exports.resetPasswordController = resetPasswordController;
exports.confirmResetPasswordController = confirmResetPasswordController;
const auth_repository_1 = require("../repositories/auth.repository");
// LOGIN
function loginUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: "Email and password are required" });
            }
            const result = yield (0, auth_repository_1.loginUser)({ email, password });
            return res.status(200).json(Object.assign({ message: "Login successful" }, result));
        }
        catch (err) {
            return res
                .status(500)
                .json({ message: err.message || "Internal server error" });
        }
    });
}
// REGISTER
function registerEmailController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, role, name } = req.body;
            const result = yield (0, auth_repository_1.registerUser)({ email, role, name });
            return res.status(201).json(result);
        }
        catch (err) {
            return res
                .status(500)
                .json({ message: err.message || "Internal server error" });
        }
    });
}
// VERIFY EMAIL TOKEN
function verifyEmailTokenController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.query;
            if (!token) {
                return res.status(400).json({ message: "Token is required" });
            }
            const result = yield (0, auth_repository_1.checkVerifyToken)(token);
            if (!result)
                return res.status(400).json({ message: "Invalid or expired token" });
            return res.status(200).json({ message: "Token valid" });
        }
        catch (err) {
            return res
                .status(500)
                .json({ message: err.message || "Internal server error" });
        }
    });
}
// SET PASSWORD (verify email)
function setPasswordController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token, password } = req.body;
            const result = yield (0, auth_repository_1.createUserAfterVerify)(token, password);
            return res.status(201).json({ message: "User created", user: result });
        }
        catch (err) {
            return res
                .status(500)
                .json({ message: err.message || "Internal server error" });
        }
    });
}
// RESET PASSWORD (request link)
function resetPasswordController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
            const result = yield (0, auth_repository_1.requestResetPassword)(email);
            return res.status(200).json(result);
        }
        catch (err) {
            return res
                .status(500)
                .json({ message: err.message || "Internal server error" });
        }
    });
}
// CONFIRM RESET PASSWORD
function confirmResetPasswordController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                return res
                    .status(400)
                    .json({ message: "Token and new password are required" });
            }
            const result = yield (0, auth_repository_1.confirmResetPassword)(token, password);
            return res.status(200).json(result);
        }
        catch (err) {
            return res
                .status(500)
                .json({ message: err.message || "Internal server error" });
        }
    });
}

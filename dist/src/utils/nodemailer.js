"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailer = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "projectrentago@gmail.com",
        pass: "ixua mcki uquu zbdg",
    },
});
exports.default = mailer;

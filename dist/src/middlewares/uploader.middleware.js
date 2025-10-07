"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = uploader;
const multer_1 = __importDefault(require("multer"));
function uploader() {
    const storage = multer_1.default.memoryStorage();
    return (0, multer_1.default)({ storage });
}

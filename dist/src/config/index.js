"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FE_URL = exports.GMAIL_PASS = exports.GMAIL_EMAIL = exports.CLOUDINARY_CLOUD_NAME = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.SECRET_KEY = exports.PORT = void 0;
require("dotenv/config");
_a = process.env, exports.PORT = _a.PORT, exports.SECRET_KEY = _a.SECRET_KEY, exports.CLOUDINARY_API_KEY = _a.CLOUDINARY_API_KEY, exports.CLOUDINARY_API_SECRET = _a.CLOUDINARY_API_SECRET, exports.CLOUDINARY_CLOUD_NAME = _a.CLOUDINARY_CLOUD_NAME, exports.GMAIL_EMAIL = _a.GMAIL_EMAIL, exports.GMAIL_PASS = _a.GMAIL_PASS, exports.FE_URL = _a.FE_URL;

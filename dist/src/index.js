"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config");
// -------------------- ROUTERS --------------------
const user_router_1 = __importDefault(require("./routers/user.router"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const property_router_1 = __importDefault(require("./routers/property.router"));
const room_router_1 = __importDefault(require("./routers/room.router"));
const dashboard_router_1 = __importDefault(require("./routers/dashboard.router"));
const availability_router_1 = __importDefault(require("./routers/availability.router"));
const peakSeasonRate_router_1 = __importDefault(require("./routers/peakSeasonRate.router"));
const app = (0, express_1.default)();
const port = config_1.PORT || 8080;
// -------------------- MIDDLEWARE --------------------
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// -------------------- HEALTH CHECK --------------------
app.get("/api", (_req, res) => {
    res.send({ status: "ok", message: "API is running" });
});
// -------------------- ROUTES --------------------
app.use("/api/users", user_router_1.default);
app.use("/api/auth", auth_router_1.default);
app.use("/api/dashboard", dashboard_router_1.default);
app.use("/api/properties", property_router_1.default);
app.use("/api/filter", property_router_1.default);
app.use("/api/rooms", room_router_1.default);
app.use("/api/availability", availability_router_1.default);
app.use("/api/peak-season-rates", peakSeasonRate_router_1.default);
// -------------------- ERROR HANDLER --------------------
app.use((err, _req, res, _next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});
// -------------------- START SERVER --------------------
app.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port}`);
});
exports.default = app;

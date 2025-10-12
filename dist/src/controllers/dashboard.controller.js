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
exports.getUserDashboardHandler = exports.getTenantDashboardHandler = void 0;
const dashboard_repository_1 = require("../repositories/dashboard.repository");
const getTenantDashboardHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!tenantId) {
            return res
                .status(400)
                .json({ success: false, message: "Tenant ID tidak ditemukan" });
        }
        const data = yield (0, dashboard_repository_1.getTenantDashboard)(tenantId);
        return res.json({ success: true, data });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getTenantDashboardHandler = getTenantDashboardHandler;
const getUserDashboardHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, message: "User ID tidak ditemukan" });
        }
        const data = yield (0, dashboard_repository_1.getUserDashboard)(userId);
        return res.json({ success: true, data });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getUserDashboardHandler = getUserDashboardHandler;

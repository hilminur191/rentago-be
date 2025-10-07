"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Get all users
router.get("/", auth_middleware_1.verifyToken, user_controller_1.getAllUsersController);
// Get current user detail
router.get("/detail", auth_middleware_1.verifyToken, user_controller_1.getUserDetailController);
// Get user by ID
router.get("/:id", auth_middleware_1.verifyToken, user_controller_1.getUserByIdController);
// Create new user
router.post("/", auth_middleware_1.verifyToken, user_controller_1.createUserController);
// // Update user
// router.put("/:id", verifyToken, updateUserController);
// Delete user
router.delete("/:id", auth_middleware_1.verifyToken, user_controller_1.deleteUserController);
exports.default = router;

import { Router } from "express";
import {
  loginUserController,
  registerEmailController,
  verifyEmailTokenController,
  setPasswordController,
  resetPasswordController,
  confirmResetPasswordController,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", loginUserController);
router.post("/register", registerEmailController);
router.get("/verify-email", verifyEmailTokenController);
router.post("/set-password", setPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/reset-password/confirm", confirmResetPasswordController);

export default router;

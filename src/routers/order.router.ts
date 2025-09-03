// Nurbani
import express from "express";
import multer from "multer";
import * as ctrl from "../controllers/order.controller";
import {
  verifyToken,
  userGuard,
  tenantGuard,
} from "../middlewares/auth.middleware";

const router = express.Router();

// Setup multer untuk upload bukti bayar (max 1MB, hanya jpg/png)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only .jpg and .png allowed"));
    }
    cb(null, true);
  },
});

// ---------------- USER ROUTES ----------------
router.post("/", verifyToken, userGuard, ctrl.createOrder);
router.post(
  "/:id/payment-proof",
  verifyToken,
  userGuard,
  upload.single("file"),
  ctrl.uploadPaymentProof
);
router.get("/", verifyToken, userGuard, ctrl.getUserOrders);
router.patch("/:id/cancel", verifyToken, userGuard, ctrl.cancelOrder);

// ---------------- TENANT ROUTES ----------------
router.get("/tenant/list", verifyToken, tenantGuard, ctrl.getTenantOrders);
router.patch(
  "/:id/confirm",
  verifyToken,
  tenantGuard,
  ctrl.tenantConfirmPayment
);
router.patch(
  "/:id/cancel-tenant",
  verifyToken,
  tenantGuard,
  ctrl.tenantCancelOrder
);

export default router;

// Nurbani
import { Router } from "express";
import * as orderController from "../controllers/orderController";
import upload from "../middlewares/upload";

const router = Router();

router.get("/", orderController.getOrders); // GET /orders
router.post("/", orderController.createOrder); // POST /orders
router.post("/:id/cancel", orderController.cancelOrder); // POST /orders/:id/cancel
router.post(
  "/:id/payment-proof",
  upload.single("file"),
  orderController.uploadPaymentProof
);

export default router;

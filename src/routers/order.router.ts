// Nurbani
import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import upload from "../middlewares/upload";

const router = Router();

router.get("/", order.controller.getOrders); // GET /orders
router.post("/", order.controller.createOrder); // POST /orders
router.post("/:id/cancel", order.controller.cancelOrder); // POST /orders/:id/cancel
router.post(
  "/:id/payment-proof",
  upload.single("file"),
  order.controller.uploadPaymentProof
);

export default router;

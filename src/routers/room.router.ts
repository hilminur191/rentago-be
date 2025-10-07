import { Router } from "express";
import {
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller";

const router = Router();

router.get("/:roomId", getRoomById);
router.post("/:propertyId", createRoom);
router.put("/:roomId", updateRoom);
router.delete("/:roomId", deleteRoom);

export default router;

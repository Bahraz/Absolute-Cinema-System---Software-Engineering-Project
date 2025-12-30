import { Router } from "express";
import { reservationController } from "@controllers/reservation.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { adminOnly } from "@middlewares/admin.middleware";

const router = Router();

router.use(authMiddleware);

// USER
router.get("/my", reservationController.getMy);
router.post("/", reservationController.create);
router.delete("/:id", reservationController.cancel);

// ADMIN
router.get("/", adminOnly, reservationController.getAll);

export default router;

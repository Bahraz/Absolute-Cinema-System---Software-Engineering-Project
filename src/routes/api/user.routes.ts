import { Router } from "express";
import { userController } from "@controllers/user.controller";
import { reservationController } from "@controllers/reservation.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { userOnly } from "@middlewares/user.middleware";

const router = Router();

router.use(authMiddleware, userOnly);

router.get("/profile", userController.getProfile);
router.patch("/profile", userController.updateProfile);
router.patch("/password", userController.updatePassword);

router.get("/screenings", userController.getScreenings);

router.get("/reservation", reservationController.getMyReservation);

router.post("/reservation", reservationController.create);

router.delete("/reservations/:id", reservationController.cancel);

router.get(
  "/reservations/screenings/:screeningId/seats",
  reservationController.getAvailableSeats
);

router.get(
  "/reservations/screenings/:screeningId/price",
  reservationController.getPrice
);

export default router;

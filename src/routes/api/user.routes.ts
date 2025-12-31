import { Router } from "express";
import { userController } from "@controllers/user.controller";
import { reservationController } from "@controllers/reservation.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { userOnly } from "@middlewares/user.middleware";

const router = Router();

/* ================= GLOBAL MIDDLEWARE ================= */
router.use(authMiddleware, userOnly);

/* ================= USER PROFILE ================= */
router.get("/profile", userController.getProfile);
router.patch("/profile", userController.updateProfile);
router.patch("/password", userController.updatePassword);

/* ================= SCREENINGS ================= */
router.get("/screenings", userController.getScreenings);

/* ================= RESERVATIONS ================= */

// moje rezerwacje
router.get("/reservation", reservationController.getMyReservation);

// utwórz rezerwację
router.post("/reservation", reservationController.create);

// anuluj rezerwację
router.delete("/reservations/:id", reservationController.cancel);

// wolne miejsca
router.get(
  "/reservations/screenings/:screeningId/seats",
  reservationController.getAvailableSeats
);

// cena
router.get(
  "/reservations/screenings/:screeningId/price",
  reservationController.getPrice
);

export default router;

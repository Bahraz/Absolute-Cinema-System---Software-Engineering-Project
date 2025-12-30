import { Router } from "express";
import { userController } from "@controllers/user.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { userOnly } from "@middlewares/user.middleware";
import { reservationController } from "@controllers/reservation.controller";

const router = Router();

router.use(authMiddleware, userOnly);

router.get("/profile", userController.getProfile);
router.get("/screenings", userController.getScreenings);
// router.get("/reservations", userController.getMyReservations);
// router.post("/reservations", userController.createReservation);

// moje rezerwacje
router.get("/reservation", (req, res) =>
  reservationController.getMyReservation(req, res)
);

// utwórz rezerwację
router.post("/reservation", (req, res) =>
  reservationController.create(req, res)
);

// anuluj rezerwację
router.delete("/reservations/:id", (req, res) =>
  reservationController.cancel(req, res)
);

router.get("/reservations/screenings/:screeningId/seats", (req, res) =>
  reservationController.getAvailableSeats(req, res)
);

router.get(
  "/reservations/screenings/:screeningId/price",
  reservationController.getPrice
);

router.patch("/profile", (req, res) => userController.updateProfile(req, res));

router.patch("/password", (req, res) =>
  userController.updatePassword(req, res)
);

export default router;

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
// router.delete("/reservations/:id", userController.cancelReservation);

// moje rezerwacje
router.get("/reservation", (req, res) => reservationController.getMy(req, res));

// utwórz rezerwację
router.post("/reservation", (req, res) =>
  reservationController.create(req, res)
);

// anuluj rezerwację
router.delete("/reservation/:id", (req, res) =>
  reservationController.cancel(req, res)
);

router.get("/reservations/screenings/:screeningId/seats", (req, res) =>
  reservationController.getAvailableSeats(req, res)
);

export default router;

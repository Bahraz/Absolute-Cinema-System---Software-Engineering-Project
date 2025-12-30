import { Router } from "express";
import { authMiddleware } from "@middlewares/auth.middleware";
import { userOnly } from "@middlewares/user.middleware";
import { reservationController } from "@controllers/reservation.controller";
import { screeningController } from "@controllers/screening.controller";
import { userController } from "@controllers/user.controller";

const router = Router();

router.use(authMiddleware, userOnly);

// router.get("/dashboard", (req, res) => {
//   res.render("user/dashboard", { user: req.user });
// });

router.get("/dashboard", (req, res) => screeningController.userPanel(req, res));

router.get("/reservation/new", (req, res) =>
  reservationController.userPanel(req, res)
);

router.get("/my-reservations", (req,res) => reservationController.myReservationPanel(req,res));

router.get("/my-profile", (req,res) => userController.myProfilePanel(req,res));

export default router;

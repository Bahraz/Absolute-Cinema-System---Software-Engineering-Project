import { Router } from "express";
import { authMiddleware } from "@middlewares/auth.middleware";
import { userOnly } from "@middlewares/user.middleware";
import { viewController } from "@controllers/view.controller";
const router = Router();

router.use(authMiddleware, userOnly);

router.get("/dashboard", (req, res, next) =>
  viewController.userDashboard(req, res, next)
);

router.get("/reservation/new", (req, res, next) =>
  viewController.userReservationPanel(req, res, next)
);

router.get("/my-reservations", (req, res, next) =>
  viewController.userMyReservations(req, res, next)
);

router.get("/my-profile", (req, res, next) =>
  viewController.userProfile(req, res, next)
);

export default router;

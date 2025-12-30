import { Router } from "express";
import { authMiddleware } from "@middlewares/auth.middleware";
import { adminOnly } from "@middlewares/admin.middleware";
import { actorsController } from "@controllers/actor.controller";
import { genreController } from "@controllers/genre.controller";
import { movieController } from "@controllers/movie.controller";
import { hallController } from "@controllers/hall.controller";
import { screeningController } from "@controllers/screening.controller";
import { reservationController } from "@controllers/reservation.controller";
import { employeesController } from "@controllers/employees.controller";
import { userController } from "@controllers/user.controller";


const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard", { user: req.user });
});

router.get("/actors", (req, res) => actorsController.panel(req, res));
router.get("/genres", (req, res) => genreController.panel(req, res));
router.get("/movies", authMiddleware, (req, res) =>
  movieController.panel(req, res)
);
router.get("/movies/:id", authMiddleware, (req, res) =>
  movieController.panelDetails(req, res)
);

router.get("/halls", authMiddleware, (req, res) =>
  hallController.panel(req, res)
);
router.get("/halls/:id", (req, res) => hallController.details(req, res));

router.get("/screenings", (req, res) => screeningController.panel(req, res));

router.get("/reservations", (req, res) =>
  reservationController.panel(req, res)
);

router.get("/employees", (req, res) =>
  employeesController.panel(req, res)
);

router.get("/users", (req, res) =>
  userController.panel(req, res)
);

export default router;

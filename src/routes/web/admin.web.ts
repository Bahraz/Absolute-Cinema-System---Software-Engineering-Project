import { Router } from "express";
import { authMiddleware } from "@middlewares/auth.middleware";
import { adminOnly } from "@middlewares/admin.middleware";
import { viewController } from "@controllers/view.controller";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard", { user: req.user });
});

router.get("/actors", (req, res, next) =>
  viewController.adminActors(req, res, next)
);

router.get("/employees", (req, res, next) =>
  viewController.adminEmployees(req, res, next)
);

router.get("/genres", (req, res, next) =>
  viewController.adminGenres(req, res, next)
);

router.get("/halls", (req, res, next) =>
  viewController.adminHalls(req, res, next)
);

router.get("/halls/:id", (req, res, next) =>
  viewController.adminHallDetails(req, res, next)
);

router.get("/movies", (req, res, next) =>
  viewController.adminMovies(req, res, next)
);

router.get("/movies/:id", (req, res, next) =>
  viewController.adminMovieDetails(req, res, next)
);

router.get("/reservations", (req, res, next) =>
  viewController.adminReservations(req, res, next)
);

router.get("/screenings", (req, res, next) =>
  viewController.adminScreenings(req, res, next)
);

router.get("/users", (req, res, next) =>
  viewController.adminUsers(req, res, next)
);

export default router;

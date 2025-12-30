import { Router } from "express";
import { adminController } from "@controllers/admin.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { actorsController } from "@controllers/actor.controller";
import { genreController } from "@controllers/genre.controller";
import { genreRepository } from "@repositories/genre.repository";
import { movieController } from "@controllers/movie.controller";
import { hallController } from "@controllers/hall.controller";
import { seatController } from "@controllers/seat.controller";
import { screeningController } from "@controllers/screening.controller";
import { paymentController } from "@controllers/payment.controller";
import { ticketController } from "@controllers/ticket.controller";
import { reservationController } from "@controllers/reservation.controller";
import { employeesController } from "@controllers/employees.controller";
import { userController } from "@controllers/user.controller";
import { adminOnly } from "@middlewares/admin.middleware";

const router = Router();
router.use(authMiddleware, adminOnly);

router.get("/dashboard", (req, res) =>
  adminController.dashboardStats(req, res)
);

/* ===== ACTORS API ===== */
router.get("/actors/all", (req, res) => actorsController.getAll(req, res));
router.post("/actors", (req, res) => actorsController.create(req, res));
router.patch("/actors/:id", (req, res) => actorsController.update(req, res));
router.delete("/actors/:id", (req, res) => actorsController.delete(req, res));

/* ===== GENRES API ===== */
router.get("/genres/all", (req, res) => genreController.show(req, res));

router.post("/genres", (req, res) => genreController.create(req, res));

router.patch("/genres/:id", (req, res) => genreController.update(req, res));

router.delete("/genres/:id", (req, res) => genreController.delete(req, res));

/* ================= MOVIES API ================= */

router.get("/movies/all", (req, res) => movieController.show(req, res));

router.get("/movies/:id", (req, res) => movieController.details(req, res));

router.post("/movies", (req, res) => movieController.create(req, res));

router.patch("/movies/:id", (req, res) => movieController.update(req, res));

router.delete("/movies/:id", (req, res) => movieController.delete(req, res));

/* ================= MOVIE ACTORS ================= */

router.post("/movies/:movieId/actors/:actorId", (req, res) =>
  movieController.addActor(req, res)
);

router.delete("/movies/:movieId/actors/:actorId", (req, res) =>
  movieController.removeActor(req, res)
);

/* ================= MOVIE GENRES ================= */

router.post("/movies/:movieId/genres/:genreId", (req, res) =>
  movieController.addGenre(req, res)
);

router.delete("/movies/:movieId/genres/:genreId", (req, res) =>
  movieController.removeGenre(req, res)
);

router.get("/halls/:id", (req, res) => hallController.details(req, res));

router.post("/halls", (req, res) => hallController.create(req, res));

router.delete("/halls/:id", (req, res) => hallController.delete(req, res));
/* ================= SEATS API ================= */

router.get("/seats/hall/:hallId", (req, res) =>
  seatController.findByHall(req, res)
);

router.post("/seats", (req, res) => seatController.create(req, res));

router.delete("/seats/:id", (req, res) => seatController.delete(req, res));

/* ================= SCREENINGS API ================= */
router.get("/screenings", (req, res) => screeningController.show(req, res));

router.post("/screenings", (req, res) => screeningController.create(req, res));

router.patch("/screenings/:id", (req, res) =>
  screeningController.update(req, res)
);

router.delete("/screenings/:id", (req, res) =>
  screeningController.delete(req, res)
);

/* ===== RESERVATIONS ===== */
router.get("/reservations", (req, res) =>
  reservationController.getAll(req, res)
);
router.patch("/reservations/:id", (req, res) =>
  reservationController.update(req, res)
);

router.delete("/reservations/:id", (req, res) =>
  reservationController.cancel(req, res)
);

/* ===== PAYMENTS ===== */
router.patch("/payments/:id/status", (req, res) =>
  paymentController.updateStatus(req, res)
);

router.delete("/payments/:id", (req, res) =>
  paymentController.delete(req, res)
);

/* ===== TICKETS ===== */
router.patch("/tickets/:id/activate", (req, res) =>
  ticketController.activate(req, res)
);

router.patch("/tickets/:id/expire", (req, res) =>
  ticketController.expire(req, res)
);

router.delete("/tickets/:id", (req, res) => ticketController.delete(req, res));
export default router;

router.get(
  "/reservations/screenings/:screeningId/seats",
  authMiddleware,
  (req, res) => reservationController.getAvailableSeats(req, res)
);

/* ===== EMPLOYEES ===== */
router.get("/employees", (req, res) => adminController.getEmployees(req, res));
router.post("/employees", (req, res) => adminController.addEmployee(req, res));
router.patch("/employees/:id", (req, res) =>
  adminController.updateEmployeeRole(req, res)
);
router.delete("/employees/:id", (req, res) =>
  adminController.removeEmployee(req, res)
);

/* ===== USERS ===== */
router.get("/users", (req, res) => userController.getAll(req, res));
router.patch("/users/:id", (req, res) => userController.update(req, res));
router.patch("/users/:id/password", (req, res) =>
  adminController.resetUserPassword(req, res)
);
router.patch("/users/:id/toggle-active", (req, res) =>
  userController.toggleActive(req, res)
);

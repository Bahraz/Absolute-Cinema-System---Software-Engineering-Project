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

const router = Router();

router.get("/dashboard", (req, res) =>
  adminController.dashboardStats(req, res)
);

router.get("/employees", (req, res) => adminController.getEmployees(req, res));
router.post("/employees", (req, res) => adminController.addEmployee(req, res));
router.patch("/employees/:id", (req, res) =>
  adminController.updateEmployeeRole(req, res)
);
router.delete("/employees/:id", (req, res) =>
  adminController.removeEmployee(req, res)
);

// ACTORS VIEW
router.get("/actors", authMiddleware, (req, res) =>
  actorsController.panel(req, res)
);

// API ACTORS
router.get("/actors/all", authMiddleware, (req, res) =>
  actorsController.getAll(req, res)
);
router.post("/actors", authMiddleware, (req, res) =>
  actorsController.create(req, res)
);
router.patch("/actors/:id", authMiddleware, (req, res) =>
  actorsController.update(req, res)
);
router.delete("/actors/:id", authMiddleware, (req, res) =>
  actorsController.delete(req, res)
);

/* ===== GENRES VIEW ===== */
router.get("/genres", async (req, res) => {
  const genres = await genreRepository.findAll();
  res.render("admin/genres", { genres });
});

/* ===== GENRES API ===== */
router.get("/genres/all", (req, res) => genreController.show(req, res));

router.post("/genres", (req, res) => genreController.create(req, res));

router.patch("/genres/:id", (req, res) => genreController.update(req, res));

router.delete("/genres/:id", (req, res) => genreController.delete(req, res));

/* ================= MOVIES VIEW ================= */

router.get("/movies", authMiddleware, (req, res) =>
  movieController.panel(req, res)
);

/* ================= MOVIES API ================= */

router.get("/movies/all", authMiddleware, (req, res) =>
  movieController.show(req, res)
);

router.get("/movies/:id", authMiddleware, (req, res) =>
  movieController.details(req, res)
);

router.post("/movies", authMiddleware, (req, res) =>
  movieController.create(req, res)
);

router.patch("/movies/:id", authMiddleware, (req, res) =>
  movieController.update(req, res)
);

router.delete("/movies/:id", authMiddleware, (req, res) =>
  movieController.delete(req, res)
);

/* ================= MOVIE ACTORS ================= */

router.post("/movies/:movieId/actors/:actorId", authMiddleware, (req, res) =>
  movieController.addActor(req, res)
);

router.delete("/movies/:movieId/actors/:actorId", authMiddleware, (req, res) =>
  movieController.removeActor(req, res)
);

/* ================= MOVIE GENRES ================= */

router.post("/movies/:movieId/genres/:genreId", authMiddleware, (req, res) =>
  movieController.addGenre(req, res)
);

router.delete("/movies/:movieId/genres/:genreId", authMiddleware, (req, res) =>
  movieController.removeGenre(req, res)
);

/* ================= HALLS VIEW ================= */

// lista sal
router.get("/halls", authMiddleware, (req, res) =>
  hallController.panel(req, res)
);

// szczegóły sali + miejsca
router.get("/halls/:id", authMiddleware, (req, res) =>
  hallController.details(req, res)
);

router.post("/halls", authMiddleware, (req, res) =>
  hallController.create(req, res)
);

router.delete("/halls/:id", authMiddleware, (req,res) => hallController.delete(req,res));
/* ================= SEATS API ================= */

router.get("/seats/hall/:hallId", authMiddleware, (req, res) =>
  seatController.findByHall(req, res)
);

router.post("/seats", authMiddleware, (req, res) =>
  seatController.create(req, res)
);

router.delete("/seats/:id", authMiddleware, (req, res) =>
  seatController.delete(req, res)
);

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

router.get("/reservations/screenings/:screeningId/seats", (req, res) =>
  reservationController.getAvailableSeats(req, res)
);

/* ===== EMPLOYEES ===== */
router.get("/employees", (req, res) => adminController.getEmployees(req, res));
router.post("employees", (req, res) => adminController.addEmployee(req, res));
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
  userController.updatePassword(req, res)
);
router.patch("/users/:id/toggle-active", (req, res) =>
  userController.toggleActive(req, res)
);

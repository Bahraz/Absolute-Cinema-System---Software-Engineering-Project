import { Router } from "express";

import { adminController } from "@controllers/admin.controller";
import { actorsController } from "@controllers/actor.controller";
import { genreController } from "@controllers/genre.controller";
import { movieController } from "@controllers/movie.controller";
import { hallController } from "@controllers/hall.controller";
import { seatController } from "@controllers/seat.controller";
import { screeningController } from "@controllers/screening.controller";
import { paymentController } from "@controllers/payment.controller";
import { ticketController } from "@controllers/ticket.controller";
import { reservationController } from "@controllers/reservation.controller";
import { userController } from "@controllers/user.controller";

import { authMiddleware } from "@middlewares/auth.middleware";
import { adminOnly } from "@middlewares/admin.middleware";
import { employeesController } from "@controllers/employees.controller";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/dashboard", adminController.dashboardStats);

router.get("/actors/all", actorsController.getAll);
router.post("/actors", actorsController.create);
router.patch("/actors/:id", actorsController.update);
router.delete("/actors/:id", actorsController.delete);

router.get("/genres/all", genreController.show);
router.post("/genres", genreController.create);
router.patch("/genres/:id", genreController.update);
router.delete("/genres/:id", genreController.delete);

router.get("/movies/all", movieController.show);
router.get("/movies/:id", movieController.details);
router.post("/movies", movieController.create);
router.patch("/movies/:id", movieController.update);
router.delete("/movies/:id", movieController.delete);

router.post("/movies/:movieId/actors/:actorId", movieController.addActor);
router.delete("/movies/:movieId/actors/:actorId", movieController.removeActor);

router.post("/movies/:movieId/genres/:genreId", movieController.addGenre);
router.delete("/movies/:movieId/genres/:genreId", movieController.removeGenre);

router.post("/halls", hallController.create);
router.delete("/halls/:id", hallController.delete);

router.get("/seats/hall/:hallId", seatController.findByHall);
router.post("/seats", seatController.create);
router.delete("/seats/:id", seatController.delete);

router.get("/screenings", screeningController.show);
router.post("/screenings", screeningController.create);
router.patch("/screenings/:id", screeningController.update);
router.delete("/screenings/:id", screeningController.delete);

router.get("/reservations", reservationController.getAll);
router.patch("/reservations/:id", reservationController.update);
router.delete("/reservations/:id", reservationController.cancel);

router.get(
  "/reservations/screenings/:screeningId/seats",
  reservationController.getAvailableSeats
);

router.patch("/payments/:id/status", paymentController.updateStatus);
router.delete("/payments/:id", paymentController.delete);

router.patch("/tickets/:id/activate", ticketController.activate);
router.patch("/tickets/:id/expire", ticketController.expire);
router.delete("/tickets/:id", ticketController.delete);

router.get("/users", userController.getAll);
router.patch("/users/:id", userController.update);
router.patch("/users/:id/password", adminController.resetUserPassword);
router.patch("/users/:id/toggle-active", userController.toggleActive);

router.post("/employees", employeesController.create);
router.patch("/employees/:id", employeesController.update);
router.delete("/employees/:id", employeesController.delete);

export default router;

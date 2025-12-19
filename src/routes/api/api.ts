import express, { Router } from "express";

import { router as userRoutes } from "@routes/api/modules/usersRoutes";
import { router as actorsRoutes } from "@routes/api/modules/actorsRoutes";
import { router as genresRoutes } from "@routes/api/modules/genresRoutes";
import { router as rolesRoutes } from "@routes/api/modules/rolesRoutes";
import { router as userRoleRoutes } from "@routes/api/modules/userRoleRoutes";
import { router as hallsRoutes } from "@routes/api/modules/hallsRoutes";
import { router as moviesRoutes } from "@routes/api/modules/moviesRoutes";
import { router as paymentsRoutes } from "@routes/api/modules/paymentsRoutes";
import { router as reservationsRoutes } from "@routes/api/modules/reservationsRoutes";
import { router as seatsRoutes } from "@routes/api/modules/seatsRoutes";
import { router as seatsTypesRouter } from "@routes/api/modules/seatsTypesRoutes";
import { router as reservationsSeatsRoutes } from "@routes/api/modules/reservationsSeatsRoutes";
import { router as screeningsRoutes } from "@routes/api/modules/screeningsRoutes";
import { router as seatsLocksRoutes } from "@routes/api/modules/seatsLocksRoutes";
import { router as ticketsRoutes } from "@routes/api/modules/ticketsRoutes";
import { router as moviesGenresRoutes } from "@routes/api/modules/moviesGenresRoutes";
import { router as moviesActorsRoutes } from "@routes/api/modules/moviesActorsRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/actors", actorsRoutes);
router.use("/genres", genresRoutes);
router.use("/halls", hallsRoutes);
router.use("/movies", moviesRoutes);
router.use("/movies-genres", moviesGenresRoutes);
router.use("/movies-actors", moviesActorsRoutes);
router.use("/payments", paymentsRoutes);
router.use("/reservations", reservationsRoutes);
router.use("/seats", seatsRoutes);
router.use("/seats-type", seatsTypesRouter);
router.use("/reservations-seats", reservationsSeatsRoutes);
router.use("/screenings", screeningsRoutes);
router.use("/seats-locks", seatsLocksRoutes);
router.use("/tickets", ticketsRoutes);
router.use("/roles", rolesRoutes);
router.use("/user-roles", userRoleRoutes);

export { router };

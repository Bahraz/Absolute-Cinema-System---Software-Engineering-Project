import express, { Router } from "express";

import { router as actorsRoutes } from "@routes/api/modules/actorsRoutes";
import { router as moviesRoutes } from "@routes/api/modules/moviesRoutes";
import { router as genresRoutes } from "@routes/api/modules/genresRoutes";
import { router as hallsRoutes } from "@routes/api/modules/hallsRoutes";
import { router as employeesRoutes } from "@routes/api/modules/employeesRoutes";
import { router as usersRoutes } from "@routes/api/modules/usersRoutes";
import { router as screeningsRoutes } from "@routes/api/modules/screeningsRoutes";
import { router as seatsRoutes } from "@routes/api/modules/seatsRoutes";
import { router as ticketsRoutes } from "@routes/api/modules/ticketsRoutes";
import { router as paymentsRoutes } from "@routes/api/modules/paymentsRoutes";
import { router as reservationsRoutes } from "@routes/api/modules/reservationsRoutes";

const router = express.Router();

router.use("/actor", actorsRoutes);
router.use("/movie", moviesRoutes);
router.use("/genre", genresRoutes);
router.use("/hall", hallsRoutes);
router.use("/employees", employeesRoutes);
router.use("/users", usersRoutes);
router.use("/screening", screeningsRoutes);
router.use("/seat", seatsRoutes);
router.use("/ticket", ticketsRoutes);
router.use("/payment", paymentsRoutes);
router.use("/reservation", reservationsRoutes);




export { router };

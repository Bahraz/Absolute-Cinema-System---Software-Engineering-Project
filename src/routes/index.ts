import { Router } from "express";

// API
import authApiRoutes from "./api/auth.routes";
import userApiRoutes from "./api/user.routes";
import adminApiRoutes from "./api/admin.routes";
import movieApiRoutes from "./api/movies.routes";
import screeningApiRoutes from "./api/screenings.routes";
import reservationApiRoutes from "./api/reservations.routes";
import employeeApiRoutes from "./api/employees.routes";

// WEB
import authWebRoutes from "./web/auth.web";
import userWebRoutes from "./web/user.web";
import adminWebRoutes from "./web/admin.web";

const router = Router();

/* ================= API ================= */
router.use("/api/auth", authApiRoutes);
router.use("/api/user", userApiRoutes);
router.use("/api/admin", adminApiRoutes);
router.use("/api/movies", movieApiRoutes);
router.use("/api/screenings", screeningApiRoutes);
router.use("/api/reservations", reservationApiRoutes);
router.use("/api/employees", employeeApiRoutes);

/* ================= WEB ================= */
router.use("/", authWebRoutes);
router.use("/user", userWebRoutes);
router.use("/admin", adminWebRoutes);

export default router;

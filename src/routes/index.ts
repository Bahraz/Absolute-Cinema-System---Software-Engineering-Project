import { Router } from "express";

import authApiRoutes from "./api/auth.routes";
import userApiRoutes from "./api/user.routes";
import adminApiRoutes from "./api/admin.routes";

import authWebRoutes from "./web/auth.web";
import userWebRoutes from "./web/user.web";
import adminWebRoutes from "./web/admin.web";

const router = Router();

router.use("/api/auth", authApiRoutes);
router.use("/api/user", userApiRoutes);
router.use("/api/admin", adminApiRoutes);

router.use("/", authWebRoutes);
router.use("/user", userWebRoutes);
router.use("/admin", adminWebRoutes);

export default router;

import { Router } from "express";
import { employeesController } from "@controllers/employees.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { adminOnly } from "@middlewares/admin.middleware";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/", employeesController.show);

router.post("/", employeesController.create);

router.put("/:id", employeesController.update);

router.delete("/:id", employeesController.delete);

export default router;

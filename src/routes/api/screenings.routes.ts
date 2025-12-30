import { Router } from "express";
import { screeningController } from "@controllers/screening.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { adminOnly } from "@middlewares/admin.middleware";

const router = Router();


router.get("/", screeningController.show);
router.get("/:id", screeningController.findOne);


router.use(authMiddleware, adminOnly);

router.post("/", screeningController.create);
router.put("/:id", screeningController.update);
router.delete("/:id", screeningController.delete);

export default router;

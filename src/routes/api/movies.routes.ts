import { Router } from "express";
import { movieController } from "@controllers/movie.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { adminOnly } from "@middlewares/admin.middleware";

const router = Router();

router.get("/", movieController.show);
router.get("/:id", movieController.details);

router.use(authMiddleware, adminOnly);

router.post("/", movieController.create);
router.put("/:id", movieController.update);
router.delete("/:id", movieController.delete);

router.post("/:movieId/actors/:actorId", movieController.addActor);
router.delete("/:movieId/actors/:actorId", movieController.removeActor);

router.post("/:movieId/genres/:genreId", movieController.addGenre);
router.delete("/:movieId/genres/:genreId", movieController.removeGenre);

export default router;

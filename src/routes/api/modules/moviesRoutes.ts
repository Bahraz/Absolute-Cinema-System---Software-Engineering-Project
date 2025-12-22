import express from "express";
import { movieController } from "@controllers/movie";

const router = express.Router();

router.get("/show", (req, res) => movieController.show(req, res));
router.post("/create", (req, res) => movieController.create(req, res));
router.patch("/update/:id", (req, res) => movieController.update(req, res));
router.delete("/delete/:id", (req, res) => movieController.delete(req, res));
router.get("/:id", movieController.movieDetails);
router.post("/:movieId/actors", movieController.addActorMovie);
router.post("/:movieId/genres", movieController.addGenreMovie);

router.delete("/:movieId/actors/:actorId", movieController.removeActorMovie);
router.delete("/:movieId/genres/:genreId", movieController.removeGenreMovie);

router.get("/:movieId/actors", movieController.getActorsByMovie);
router.get("/:movieId/genres", movieController.getGenresByMovie);

export { router };
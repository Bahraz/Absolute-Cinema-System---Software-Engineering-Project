import express from "express";
import { moviesActorsController } from "@controllers/moviesActorsController";

const router = express.Router();
router.post("/add", (req, res) => moviesActorsController.add(req, res));
router.get("/for-movie/:movie_id", (req, res) => moviesActorsController.getActorsForMovie(req, res));
router.get("/for-actor/:actor_id", (req, res) => moviesActorsController.getMoviesForActor(req, res));

//poprawka - sprawdzenie
router.delete("/delete", (req, res) => moviesActorsController.delete(req, res));

export { router };

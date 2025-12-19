import express from "express";
import { moviesGenresController } from "@controllers/moviesGenresController";

const router = express.Router();
router.post("/add", (req, res) => moviesGenresController.add(req, res));
router.get("/for-movie/:movie_id", (req, res) => moviesGenresController.getGenresForMovie(req, res));
router.get("/for-genre/:genre_id", (req, res) => moviesGenresController.getMoviesForGenre(req, res));

//poprawka - sprawdzenie
router.delete("/delete", (req, res) => moviesGenresController.delete(req, res));

export { router };

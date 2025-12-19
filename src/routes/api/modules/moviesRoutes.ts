import express from "express";
import { moviesController } from "@controllers/moviesController";

const router = express.Router();

router.get("/show", (req, res) => moviesController.getAll(req, res));
router.get("/show-one/:movie_id", (req, res) => moviesController.getOne(req, res));
router.post("/add", (req, res) => moviesController.create(req, res));
router.post("/add-actor", (req, res) => moviesController.addActor(req, res));
router.post("/add-genre", (req, res) => moviesController.addGenre(req, res));

//poprawka - sprawdzenie
router.put("/update/:movie_id", (req, res) => moviesController.update(req, res));
router.delete("/delete/:movie_id", (req, res) => moviesController.delete(req, res));

export { router };

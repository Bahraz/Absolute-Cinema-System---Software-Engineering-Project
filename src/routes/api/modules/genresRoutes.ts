import express from "express";
import { genresController } from "@controllers/genresController";

const router = express.Router();

router.get("/show", (req, res) => genresController.show(req, res));
router.post("/add", (req, res) => genresController.add(req, res));

//poprawka - sprawdzenie
router.put("/update/:id", (req, res) => genresController.update(req, res));
router.delete("/delete/:id", (req, res) => genresController.delete(req, res));

export { router };

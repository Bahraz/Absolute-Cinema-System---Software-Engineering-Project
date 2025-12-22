import express from "express";
import { genreController } from "@controllers/genre";

const router = express.Router();

router.get("/show", (req, res) => genreController.show(req, res));
router.post("/create", (req, res) => genreController.create(req, res));
router.patch("/update/:id", (req, res) => genreController.update(req, res));
router.delete("/delete/:id", (req, res) => genreController.delete(req, res));

export { router };
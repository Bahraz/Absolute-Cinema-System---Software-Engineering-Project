import express from "express";
import { seatsController } from "@controllers/seatsController";

const router = express.Router();

router.get("/show", (req, res) => seatsController.getAll(req, res));
router.get("/show/:id", (req, res) => seatsController.getOne(req, res));
router.post("/create", (req, res) => seatsController.create(req, res));

//poprawka - sprawdzenie
router.put("/update/:id", (req, res) => seatsController.update(req, res));
router.delete("/delete/:id", (req, res) => seatsController.delete(req, res));

export { router };

import express from "express";
import { seatsTypesController } from "@controllers/seatsTypesController";

const router = express.Router();

router.get("/show", (req, res) => seatsTypesController.getAll(req, res));
router.get("/show/:id", (req, res) => seatsTypesController.getOne(req, res));
router.post("/create", (req, res) => seatsTypesController.create(req, res));

//poprawka - sprawdzenie
router.put("/update/:id", (req, res) => seatsTypesController.update(req, res));
router.delete("/delete/:id", (req, res) => seatsTypesController.delete(req, res));

export { router };
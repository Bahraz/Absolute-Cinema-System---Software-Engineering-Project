import express from "express";
import { seatsLocksController } from "@controllers/seatsLocksController";

const router = express.Router();

router.get("/show", (req, res) => seatsLocksController.getAll(req, res));
router.get("/show/:screening_id", (req, res) => seatsLocksController.getByScreening(req, res));

//poprawka - sprawdzenie

export { router };

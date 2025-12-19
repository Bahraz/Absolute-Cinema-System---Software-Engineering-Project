import express from "express";
import { ticketsController } from "@controllers/ticketsController";

const router = express.Router();

router.get("/show", (req, res) => ticketsController.getAll(req, res));
//poprawka - sprawdzenie

export { router };

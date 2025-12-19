import express from "express";
import { reservationsSeatsController } from "@controllers/reservationsSeatsController";

const router = express.Router();

router.get("/show/:reservation_id", (req, res) => reservationsSeatsController.getByReservation(req, res));
router.post("/add", (req, res) => reservationsSeatsController.add(req, res));
router.delete("/delete/:reservation_id", (req, res) => reservationsSeatsController.remove(req, res));
router.delete("/deleteAll/:reservation_id", (req, res) => reservationsSeatsController.deleteAllForReservation(req, res));

export { router };

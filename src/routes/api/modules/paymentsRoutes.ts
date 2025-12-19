import express from "express";
import { paymentsController } from "@controllers/paymentsController";

const router = express.Router();

router.get("/show", (req, res) => paymentsController.getAll(req, res));
router.get("/show-one/:payment_id", (req, res) => paymentsController.getOne(req, res));
router.get("/reservation/:reservation_id", (req, res) => paymentsController.getByReservation(req, res));
router.post("/add", (req, res) => paymentsController.create(req, res));

//poprawka - sprawdzenie
router.put("/update-status/:payment_id", (req, res) => paymentsController.updateStatus(req, res));
router.delete("/delete/:payment_id", (req, res) => paymentsController.delete(req, res));

export { router };

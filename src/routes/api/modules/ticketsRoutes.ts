import express from "express";
import { ticketController } from "@controllers/ticket";

const router = express.Router();

router.get("/show", (req, res) => ticketController.show(req, res));
router.get("/:id", (req, res) => ticketController.findById(req, res));
router.post("/create", (req, res) => ticketController.create(req, res));
router.patch("/update/:id", (req, res) => ticketController.update(req, res));
router.delete("/delete/:id", (req, res) => ticketController.delete(req, res));

export { router };

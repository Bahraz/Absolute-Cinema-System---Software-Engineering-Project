import express from "express";
import { paymentController } from "@controllers/payment";

const router = express.Router();

router.get("/", (req, res) => paymentController.show(req, res));
router.get("/:id", (req, res) => paymentController.findById(req, res));
router.post("/create", (req, res) => paymentController.create(req, res));
router.patch("/update/:id", (req, res) => paymentController.update(req, res));
router.delete("/delete/:id", (req, res) => paymentController.delete(req, res));

export { router };
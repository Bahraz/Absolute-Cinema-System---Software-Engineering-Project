import express from "express";
import { screeningController } from "@controllers/screening";

const router = express.Router();

router.get("/show", (req, res) => screeningController.show(req, res));
router.post("/create", (req, res) => screeningController.create(req, res));
router.patch("/update/:id", (req, res) => screeningController.update(req, res));
router.delete("/delete/:id", (req, res) => screeningController.delete(req, res));

export { router };

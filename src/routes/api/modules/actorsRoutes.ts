import express from "express";
import { actorController } from "@controllers/actor";

const router = express.Router();

router.get("/show", (req, res) => actorController.show(req, res));
router.post("/create", (req, res) => actorController.create(req, res));
router.patch("/update/:id", (req, res) => actorController.update(req, res));
router.delete("/delete/:id", (req, res) => actorController.delete(req, res));

export { router };

import express from "express";
import { hallController } from "@controllers/hall";

const router = express.Router();

router.get("/show", (req, res) => hallController.show(req, res));
router.post("/create", (req, res) => hallController.create(req, res));
router.patch("/update/:id", (req, res) => hallController.update(req, res));
router.delete("/delete/:id", (req, res) => hallController.delete(req, res));

export { router };

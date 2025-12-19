import express from "express";
import { hallsController } from "@controllers/hallsController";

const router = express.Router();

router.get("/show", (req, res) => hallsController.show(req, res));
router.post("/add", (req, res) => hallsController.add(req, res));

//poprawka - sprawdzenie
router.put("/update/:id", (req, res) => hallsController.update(req, res));
router.delete("/delete/:id", (req, res) => hallsController.delete(req, res));

export { router };

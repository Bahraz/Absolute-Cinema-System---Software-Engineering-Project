import express from "express";
import { actorsController } from "@controllers/actorsController";

const router = express.Router();

router.get("/show", (req, res) => actorsController.show(req, res));
router.post("/add", (req, res) => actorsController.add(req, res));

//poprawka - sprawdzenie
router.put("/update/:id", (req, res) => actorsController.update(req, res));
router.delete("/delete/:id", (req, res) => actorsController.delete(req, res));

export { router };

import express from "express";
import { screeningsController } from "@controllers/screeningsController";

const router = express.Router();

router.get("/show", (req, res) => screeningsController.getAll(req, res));
router.get("/show/:id", (req, res) => screeningsController.getOne(req, res));    
router.post("/add", (req, res) => screeningsController.create(req, res));

//poprawka - sprawdzenie
router.put("/update/:id", (req, res) => screeningsController.update(req, res));
router.delete("/delete/:id", (req, res) => screeningsController.delete(req, res));
export { router };

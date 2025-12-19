import express from "express";
import { rolesController } from "@controllers/rolesController";

const router = express.Router();

router.get("/show", (req, res) => rolesController.getAll(req, res));
router.get("/show/:id", (req, res) => rolesController.getOne(req, res));    
router.post("/add", (req, res) => rolesController.create(req, res));

//poprawka - sprawdzenie
router.put("/update/:id", (req, res) => rolesController.update(req, res));
router.delete("/delete/:id", (req, res) => rolesController.delete(req, res));

export { router };

import express from "express";
import { userController } from '@controllers/userController';


const router = express.Router();

router.get("/show", (req, res) => userController.getAll(req, res));

//poprawka - sprawdzenie
router.get("/show/:id", (req, res) => userController.getOne(req, res));
router.post("/register", (req, res) => userController.create(req, res));

//poprawka - sprawdzenie
router.put("/edit/:id", (req, res) => userController.update(req, res));
router.delete("/delete/:id", (req, res) => userController.delete(req, res));
router.post("/login/:id", (req, res) => userController.login(req, res));
router.get("/profile/:user_id", (req, res) => userController.getRoles(req, res));

export { router };
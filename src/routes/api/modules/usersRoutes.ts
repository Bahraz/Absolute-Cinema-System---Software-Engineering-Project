import express from "express";
import { userController } from "@controllers/user";

const router = express.Router();

router.get("/show", (req, res) => userController.show(req, res));
router.post("/create", (req, res) => userController.create(req, res));
router.patch("/update/:id", (req, res) => userController.update(req, res));
router.delete("/delete/:id", (req, res) => userController.delete(req, res));

//#TODO: Rejestracja, logowanie, zmiana hasła, edycja profilu

export { router };
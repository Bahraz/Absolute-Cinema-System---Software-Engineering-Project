import express from "express";
import { usersRolesController } from "@controllers/usersRolesController";

const router = express.Router();

router.get("/show", (req, res) => usersRolesController.getAll(req, res));
router.get("/by-user/:idUser", (req, res) => usersRolesController.getByUser(req, res));
router.get("/by-role/:idRole", (req, res) => usersRolesController.getByRole(req, res));    
router.post("/add/", (req, res) => usersRolesController.assign(req, res));
router.delete("/remove/:id", (req, res) => usersRolesController.remove(req, res));

export { router };

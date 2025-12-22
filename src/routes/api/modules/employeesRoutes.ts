import express from "express";
import { employeesController } from "@controllers/employees";

const router = express.Router();

router.get("/show", (req, res) => employeesController.show(req, res));
router.post("/create", (req, res) => employeesController.create(req, res));
router.patch("/update/:id", (req, res) => employeesController.update(req, res));
router.delete("/delete/:id", (req, res) => employeesController.delete(req, res));

export { router };

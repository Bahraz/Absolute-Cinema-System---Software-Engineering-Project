import express from "express";
import { reservationsController } from "@controllers/reservationsController";

const router = express.Router();

router.get("/show", (req, res) => reservationsController.getAll(req, res));
router.get("/show-one/:reservation_id", (req, res) => reservationsController.getOne(req, res));
router.get("/user/:user_id", (req, res) => reservationsController.getByUser(req, res));
router.post("/add", (req, res) => reservationsController.create(req, res));
router.put("/cancel/:id", (req, res) => reservationsController.cancel(req, res));
router.put("/mark-as-paid/:id", (req, res) => reservationsController.markAsPaid(req, res));
router.put("/expire/:id", (req, res) => reservationsController.expire(req, res));
router.delete("/delete/:id", (req, res) => reservationsController.delete(req, res));

export { router };

import express from "express";
import { viewController } from "@controllers/viewController";

const router = express.Router();

router.get("/", (req, res) => viewController.home(req, res));

// Admin View
router.get("/admin", (req, res) => viewController.admin(req, res));
router.get("/admin/actors", (req, res) => viewController.view(req, res));

// User View
router.get("/user", (req, res) => viewController.user(req, res));

export { router };

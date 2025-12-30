import { Router } from "express";
import { viewController } from "@controllers/view.controller";

const router = Router();

router.get("/", (req, res) => viewController.home(req, res));
router.get("/login", (req, res) => viewController.login(req, res));
router.get("/register", (req, res) => viewController.register(req, res));

export default router;

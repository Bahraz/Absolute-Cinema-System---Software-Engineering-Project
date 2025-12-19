import express from "express";
import { router as view } from "@routes/web/web";
import { router as api } from "@routes/api/api";

const router = express.Router();

router.use("/api", api);

router.use("/", view);

export { router };

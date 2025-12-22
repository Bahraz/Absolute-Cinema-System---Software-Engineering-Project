import express from "express";
import { reservationsController } from "@controllers/reservation";

const router = express.Router();

router.get("/show", (req, res) => reservationsController.show(req, res));
router.get("/show/:id", reservationsController.showOne);
router.post("/create", (req, res) => reservationsController.create(req, res));
router.patch("/update/:id", (req, res) =>
  reservationsController.update(req, res)
);
router.delete("/delete/:id", (req, res) =>
  reservationsController.delete(req, res)
);
router.get("/available-seats/:screeningId", (req, res) =>
  reservationsController.getAvailableSeats(req, res)
);

export { router };

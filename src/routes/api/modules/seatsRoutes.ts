import express from "express";
import { reservationsController } from "@controllers/reservation";

const router = express.Router();

// =======================
// LISTA + JEDNA REZERWACJA
// =======================
router.get("/show", (req, res) => reservationsController.show(req, res));

router.get("/show/:id", (req, res) => reservationsController.showOne(req, res));

// =======================
// WOLNE MIEJSCA (KLUCZOWE)
// =======================
router.get("/available-seats/:screeningId", (req, res) =>
  reservationsController.getAvailableSeats(req, res)
);

// =======================
// CREATE / UPDATE / DELETE
// =======================
router.post("/create", (req, res) => reservationsController.create(req, res));

router.patch("/update/:id", (req, res) =>
  reservationsController.update(req, res)
);

router.delete("/delete/:id", (req, res) =>
  reservationsController.delete(req, res)
);

export { router };

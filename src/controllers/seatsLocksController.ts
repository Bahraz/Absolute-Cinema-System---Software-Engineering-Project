import type { Request, Response } from "express";
import { SeatLock } from "@models/seatLockModel";
import { Screening } from "@models/screeningModel";

export class SeatsLocksController {
  async getAll(req: Request, res: Response) {
    try {
      const locks = await SeatLock.find().populate("seat_id user_id screening_id").sort({ created_at: -1 });
      res.json(locks);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania blokad miejsc" });
    }
  }
  // === GET ACTIVE LOCKS FOR SCREENING ===
async getByScreening(req: Request, res: Response) {
  console.log("Fetching active locks for screening");
  try {
    const { screening_id } = req.params;

    const locks = await SeatLock.find({ screening_id, status: "ACTIVE" })
      .populate("seat_id", "hall_id row_label seat_number seat_type_id")
      .populate("user_id", "name surname");

    res.json(locks);
  } catch (err) {
    res.status(500).json({ error: "Błąd pobierania zablokowanych miejsc" });
  }
}


  // === LOCK A SEAT ===
  async lockSeat(req: Request, res: Response) {
    try {
      const { screening_id, seat_id, user_id, lock_duration_minutes } = req.body;

      // Sprawdzenie seansu
      const screening = await Screening.findById(screening_id);
      if (!screening) return res.status(404).json({ error: "Seans nie istnieje" });

      const expires_at = new Date(Date.now() + (lock_duration_minutes || 10) * 60 * 1000);

      const seatLock = new SeatLock({
        screening_id,
        seat_id,
        user_id,
        status: "ACTIVE",
        expires_at,
      });

      await seatLock.save();
      res.status(201).json(seatLock);
    } catch (err: any) {
      // Konflikt (miejsce już zablokowane)
      if (err.code === 11000) {
        return res.status(409).json({ error: "Miejsce jest już zablokowane" });
      }
      res.status(500).json({ error: "Błąd blokowania miejsca" });
    }
  }

  // === RELEASE SEAT ===
  async releaseSeat(req: Request, res: Response) {
    try {
      const { screening_id, seat_id, user_id } = req.body;

      const lock = await SeatLock.findOneAndUpdate(
        { screening_id, seat_id, user_id, status: "ACTIVE" },
        { status: "RELEASED" },
        { new: true }
      );

      if (!lock) return res.status(404).json({ error: "Nie znaleziono aktywnej blokady dla tego miejsca" });

      res.json({ message: "Miejsce zwolnione", lock });
    } catch (err) {
      res.status(500).json({ error: "Błąd zwalniania miejsca" });
    }
  }

  // === EXPIRE LOCKS (CRON / manual) ===
  async expireLocks(req: Request, res: Response) {
    try {
      const now = new Date();
      const result = await SeatLock.updateMany(
        { status: "ACTIVE", expires_at: { $lt: now } },
        { status: "EXPIRED" }
      );

      res.json({ message: "Blokady wygasły", modifiedCount: result.modifiedCount });
    } catch (err) {
      res.status(500).json({ error: "Błąd wygaszania blokad" });
    }
  }

  // === DELETE LOCK (opcjonalnie) ===
  async deleteLock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await SeatLock.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Nie znaleziono blokady" });

      res.json({ message: "Blokada usunięta" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania blokady" });
    }
  }
}

export const seatsLocksController = new SeatsLocksController();

import type { Request, Response } from "express";
import { Seat } from "@models/seatModel";
import { Hall } from "@models/hallModel";

export class SeatsController {
  // === GET ALL SEATS ===
  async getAll(req: Request, res: Response) {
    try {
      const seats = await Seat.find()
        .populate("hall_id", "name")
        .populate("seat_type_id", "name price")
        .sort({ hall_id: 1, row_label: 1, seat_number: 1 });

      res.json(seats);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania miejsc" });
    }
  }

  // === GET ONE SEAT ===
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const seat = await Seat.findById(id)
        .populate("hall_id", "name")
        .populate("seat_type_id", "name price");

      if (!seat) return res.status(404).json({ error: "Miejsce nie istnieje" });

      res.json(seat);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania miejsca" });
    }
  }

  // === CREATE SEAT ===
  async create(req: Request, res: Response) {
    try {
      const { hall_id, row_label, seat_number, seat_type_id } = req.body;

      // Sprawdzenie czy sala istnieje
      const hall = await Hall.findById(hall_id);
      if (!hall) return res.status(404).json({ error: "Sala nie istnieje" });

      const seat = new Seat({ hall_id, row_label, seat_number, seat_type_id });
      await seat.save();

      res.status(201).json(seat);
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Miejsce o takim numerze w tym rzędzie już istnieje w tej sali" });
      }
      res.status(500).json({ error: "Błąd tworzenia miejsca" });
    }
  }

  // === UPDATE SEAT ===
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { hall_id, row_label, seat_number, seat_type_id } = req.body;

      const updated = await Seat.findByIdAndUpdate(
        id,
        { hall_id, row_label, seat_number, seat_type_id },
        { new: true, runValidators: true }
      );

      if (!updated) return res.status(404).json({ error: "Miejsce nie istnieje" });

      res.json(updated);
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Miejsce o takim numerze w tym rzędzie już istnieje w tej sali" });
      }
      res.status(500).json({ error: "Błąd aktualizacji miejsca" });
    }
  }

  // === DELETE SEAT ===
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await Seat.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Miejsce nie istnieje" });

      res.json({ message: "Miejsce zostało usunięte" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania miejsca" });
    }
  }
}

export const seatsController = new SeatsController();

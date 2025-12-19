import type { Request, Response } from "express";
import { SeatType } from "@models/seatTypeModel";

export class SeatsTypesController {
  // === GET ALL SEAT TYPES ===
  async getAll(req: Request, res: Response) {
    try {
      const seatTypes = await SeatType.find().sort({ name: 1 });
      res.json(seatTypes);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania typów miejsc" });
    }
  }

  // === GET ONE SEAT TYPE ===
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const seatType = await SeatType.findById(id);
      if (!seatType) return res.status(404).json({ error: "Typ miejsca nie istnieje" });

      res.json(seatType);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania typu miejsca" });
    }
  }

  // === CREATE SEAT TYPE ===
  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: "Nazwa typu miejsca jest wymagana" });

      const existing = await SeatType.findOne({ name });
      if (existing) return res.status(409).json({ error: "Typ miejsca o tej nazwie już istnieje" });

      const seatType = new SeatType({ name });
      await seatType.save();

      res.status(201).json(seatType);
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Typ miejsca o tej nazwie już istnieje" });
      }
      res.status(500).json({ error: "Błąd tworzenia typu miejsca" });
    }
  }

  // === UPDATE SEAT TYPE ===
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: "Nazwa typu miejsca jest wymagana" });

      const existing = await SeatType.findOne({ name, _id: { $ne: id } });
      if (existing) return res.status(409).json({ error: "Typ miejsca o tej nazwie już istnieje" });

      const updated = await SeatType.findByIdAndUpdate(id, { name }, { new: true });
      if (!updated) return res.status(404).json({ error: "Typ miejsca nie istnieje" });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Błąd aktualizacji typu miejsca" });
    }
  }

  // === DELETE SEAT TYPE ===
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await SeatType.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Typ miejsca nie istnieje" });

      res.json({ message: "Typ miejsca został usunięty" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania typu miejsca" });
    }
  }
}

export const seatsTypesController = new SeatsTypesController();

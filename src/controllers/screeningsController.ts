import type { Request, Response } from "express";
import { Screening } from "@models/screeningModel";
import { Movie } from "@models/movieModel";
import { Hall } from "@models/hallModel";

export class ScreeningsController {
  // === GET ALL ===
  async getAll(req: Request, res: Response) {
    try {
      const screenings = await Screening.find()
        .populate("movie_id", "title duration release_year")
        .populate("hall_id", "name")
        .sort({ start_at: 1 });
      res.json(screenings);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania seansów" });
    }
  }

  // === GET ONE ===
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const screening = await Screening.findById(id)
        .populate("movie_id", "title duration release_year")
        .populate("hall_id", "name");

      if (!screening) return res.status(404).json({ error: "Seans nie istnieje" });

      res.json(screening);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania seansu" });
    }
  }

  // === CREATE SCREENING ===
  async create(req: Request, res: Response) {
    try {
      const { movie_id, hall_id, start_at, base_price } = req.body;

      // Sprawdź czy film istnieje
      const movie = await Movie.findById(movie_id);
      if (!movie) return res.status(404).json({ error: "Film nie istnieje" });

      // Sprawdź czy sala istnieje
      const hall = await Hall.findById(hall_id);
      if (!hall) return res.status(404).json({ error: "Sala nie istnieje" });

      const screening = new Screening({
        movie_id,
        hall_id,
        start_at,
        base_price,
      });

      await screening.save();
      res.status(201).json(screening);
    } catch (err: any) {
      // Obsługa unikalnego indeksu (duplikat)
      if (err.code === 11000) {
        return res.status(409).json({ error: "Seans w tej sali o tej godzinie już istnieje" });
      }
      res.status(500).json({ error: "Błąd tworzenia seansu" });
    }
  }

  // === UPDATE SCREENING ===
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { movie_id, hall_id, start_at, base_price } = req.body;

      const updated = await Screening.findByIdAndUpdate(
        id,
        { movie_id, hall_id, start_at, base_price },
        { new: true, runValidators: true }
      );

      if (!updated) return res.status(404).json({ error: "Seans nie istnieje" });

      res.json(updated);
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Seans w tej sali o tej godzinie już istnieje" });
      }
      res.status(500).json({ error: "Błąd aktualizacji seansu" });
    }
  }

  // === DELETE SCREENING ===
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await Screening.findByIdAndDelete(id);

      if (!deleted) return res.status(404).json({ error: "Seans nie istnieje" });

      res.json({ message: "Seans został usunięty" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania seansu" });
    }
  }
}

export const screeningsController = new ScreeningsController();

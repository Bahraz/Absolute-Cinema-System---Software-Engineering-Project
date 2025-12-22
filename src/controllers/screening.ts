import type { Request, Response } from "express";
import { Screening } from "@models/screening";
import { Reservation } from "@models/reservation";

export class ScreeningController {
  // 1️⃣ Lista seansów
  async index(req: Request, res: Response) {
    try {
      const screenings = await Screening.find()
        .populate("movie_id")
        .populate("hall_id")
        .sort({ start_at: 1 });

      res.status(200).json(screenings);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania seansów",
        details: err,
      });
    }
  }

  // 2️⃣ Pobierz jeden seans po ID
  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const screening = await Screening.findById(id)
        .populate("movie_id")
        .populate("hall_id");

      if (!screening) {
        return res.status(404).json({ error: "Seans nie istnieje" });
      }

      res.status(200).json(screening);
    } catch (err) {
      res.status(400).json({
        error: "Nieprawidłowe ID seansu",
        details: err,
      });
    }
  }

  // 3️⃣ Dodaj seans
  async create(req: Request, res: Response) {
    try {
      const { movie_id, hall_id, start_at } = req.body;

      if (!movie_id || !hall_id || !start_at) {
        return res.status(400).json({
          error: "movie_id, hall_id i start_at są wymagane",
        });
      }

      const screening = new Screening({
        movie_id,
        hall_id,
        start_at: new Date(start_at),
      });

      const savedScreening = await screening.save();

      res.status(201).json(savedScreening);
    } catch (err) {
      res.status(500).json({
        error: "Błąd dodawania seansu",
        details: err,
      });
    }
  }

  // 4️⃣ Edytuj seans
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { movie_id, hall_id, start_at } = req.body;

      const screening = await Screening.findById(id);

      if (!screening) {
        return res.status(404).json({ error: "Seans nie istnieje" });
      }

      if (movie_id) screening.movie_id = movie_id;
      if (hall_id) screening.hall_id = hall_id;
      if (start_at) screening.start_at = new Date(start_at);

      const updatedScreening = await screening.save();

      res.status(200).json(updatedScreening);
    } catch (err) {
      res.status(500).json({
        error: "Błąd aktualizacji seansu",
        details: err,
      });
    }
  }

  // 5️⃣ Usuń seans
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await Screening.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Seans nie istnieje" });
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({
        error: "Błąd usuwania seansu",
        details: err,
      });
    }
  }
}
export const screeningController = new ScreeningController();

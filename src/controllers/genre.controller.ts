import type { Request, Response } from "express";
import { genreRepository } from "@repositories/genre.repository";

export class GenreController {
  /* ================= VIEW ================= */
  async panel(req: Request, res: Response) {
    try {
      const genres = await genreRepository.findAll();
      res.render("admin/genres", { genres });
    } catch (err) {
      res.status(500).render("admin/genres", {
        genres: [],
        error: "Błąd pobierania gatunków",
      });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const genres = await genreRepository.findAll();
      res.status(200).json(genres);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania gatunków",
        details: err instanceof Error ? err.message : err,
      });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const genre = await genreRepository.findById(id);

      if (!genre) {
        return res.status(404).json({
          error: "Nie znaleziono gatunku",
        });
      }

      res.status(200).json(genre);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania gatunku",
        details: err instanceof Error ? err.message : err,
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Nazwa gatunku jest wymagana",
        });
      }

      const existingGenre = await genreRepository.findByName(name);
      if (existingGenre) {
        return res.status(409).json({
          error: "Taki gatunek już istnieje",
        });
      }

      const genre = await genreRepository.create({ name });
      res.status(201).json(genre);
    } catch (err) {
      res.status(500).json({
        error: "Błąd dodawania gatunku",
        details: err instanceof Error ? err.message : err,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Nazwa gatunku nie może być pusta",
        });
      }

      const updatedGenre = await genreRepository.update(id, { name });

      if (!updatedGenre) {
        return res.status(404).json({
          error: "Nie znaleziono gatunku",
        });
      }

      res.status(200).json(updatedGenre);
    } catch (err) {
      res.status(500).json({
        error: "Błąd edycji gatunku",
        details: err instanceof Error ? err.message : err,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedGenre = await genreRepository.delete(id);

      if (!deletedGenre) {
        return res.status(404).json({
          error: "Nie znaleziono gatunku",
        });
      }

      res.status(200).json({
        message: "Gatunek został usunięty",
      });
    } catch (err) {
      res.status(500).json({
        error: "Błąd usuwania gatunku",
        details: err instanceof Error ? err.message : err,
      });
    }
  }
}

export const genreController = new GenreController();

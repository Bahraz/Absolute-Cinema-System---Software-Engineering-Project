import type { Request, Response } from "express";
import { Genre } from "@models/genreModel";

export class GenresController {
  // GET /genres
  async show(req: Request, res: Response) {
    try {
      const genres = await Genre.find({}, "name");
      res.status(200).json(genres);
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // POST /genres
  async add(req: Request, res: Response) {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Pole 'name' jest wymagane" });
    }

    try {
      const genre = new Genre({ name: name.trim() });
      await genre.save();

      res.status(201).json(genre);
    } catch (err: unknown) {
      res.status(422).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // PUT /genres/:id
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Pole 'name' jest wymagane" });
    }

    try {
      const updated = await Genre.findByIdAndUpdate(
        id,
        { name: name.trim() },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Gatunek nie został znaleziony" });
      }

      res.status(200).json({
        message: "Gatunek zaktualizowany pomyślnie",
        genre: updated,
      });
    } catch (err: unknown) {
      res.status(422).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // DELETE /genres/:id
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deleted = await Genre.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Gatunek nie został znaleziony" });
      }

      res.status(200).json({ message: "Gatunek usunięto pomyślnie" });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
}

export const genresController = new GenresController();

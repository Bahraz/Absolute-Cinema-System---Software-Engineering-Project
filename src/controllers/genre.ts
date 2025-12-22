import type { Request, Response } from "express";
import { Genre } from "@models/genre";

export class GenreController {
  // 1. Lista gatunków
  async show(req: Request, res: Response) {
    try {
      const genres = await Genre.find();
      res.status(200).json(genres);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania gatunków",
        details: err,
      });
    }
  }

  // 2. Dodaj gatunek
  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Podaj nazwę gatunku",
        });
      }

      const newGenre = new Genre({ name });
      const savedGenre = await newGenre.save();

      res.status(201).json(savedGenre);
    } catch (err) {
      res.status(500).json({
        error: "Błąd dodawania gatunku",
        details: err,
      });
    }
  }

  // 3. Edytuj gatunek
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Nazwa gatunku nie może być pusta",
        });
      }

      const updatedGenre = await Genre.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true }
      );

      if (!updatedGenre) {
        return res.status(404).json({
          error: "Nie znaleziono gatunku",
        });
      }

      res.status(200).json(updatedGenre);
    } catch (err) {
      res.status(500).json({
        error: "Błąd edycji gatunku",
        details: err,
      });
    }
  }

  // 4. Usuń gatunek
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedGenre = await Genre.findByIdAndDelete(id);

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
        details: err,
      });
    }
  }
}

export const genreController = new GenreController();

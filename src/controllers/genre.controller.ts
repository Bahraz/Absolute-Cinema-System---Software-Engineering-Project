import type { Request, Response, NextFunction } from "express";
import { genreService } from "@services/genre.service";
import { HttpError } from "@utils/httpError";

export class GenreController {
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const genres = await genreService.findAll();
      res.json(genres);
    } catch (err) {
      next(err);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const genre = await genreService.findById(id);

      if (!genre) {
        throw new HttpError(404, "Nie znaleziono gatunku", "GENRE_NOT_FOUND");
      }

      res.json(genre);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      if (!name) {
        throw new HttpError(
          400,
          "Nazwa gatunku jest wymagana",
          "MISSING_FIELDS"
        );
      }

      const genre = await genreService.create({ name });
      res.status(201).json(genre);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        throw new HttpError(
          400,
          "Nazwa gatunku nie może być pusta",
          "MISSING_FIELDS"
        );
      }

      const updatedGenre = await genreService.update(id, { name });
      res.json(updatedGenre);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await genreService.delete(id);

      res.json({
        message: "Gatunek został usunięty",
      });
    } catch (err) {
      next(err);
    }
  }
}

export const genreController = new GenreController();

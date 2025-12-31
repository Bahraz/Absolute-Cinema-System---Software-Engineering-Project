import type { Request, Response, NextFunction } from "express";
import { screeningService } from "@services/screening.service";
import { HttpError } from "@utils/httpError";

export class ScreeningController {
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const screenings = await screeningService.getAll();
      res.json(screenings);
    } catch (err) {
      next(err);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const screening = await screeningService.getById(req.params.id);

      if (!screening) {
        throw new HttpError(
          404,
          "Nie znaleziono seansu",
          "SCREENING_NOT_FOUND"
        );
      }

      res.json(screening);
    } catch (err) {
      next(err);
    }
  }

async create(req: Request, res: Response, next: NextFunction) {
  try {
    const { movie_id, hall_id, start_at } = req.body;

    if (!movie_id || !hall_id || !start_at) {
      throw new HttpError(400, "Brak danych", "MISSING_FIELDS");
    }

    const screening = await screeningService.createScreening({
      movie_id,
      hall_id,
      start_at, // ⬅️ STRING
    });

    res.status(201).json(screening);
  } catch (err) {
    next(err);
  }
}

async update(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await screeningService.updateScreening(req.params.id, {
      movie_id: req.body.movie_id,
      hall_id: req.body.hall_id,
      start_at: req.body.start_at, // ⬅️ STRING
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await screeningService.deleteScreening(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export const screeningController = new ScreeningController();

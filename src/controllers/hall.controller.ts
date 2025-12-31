import type { Request, Response, NextFunction } from "express";
import { hallService } from "@services/hall.service";
import { HttpError } from "@utils/httpError";

export class HallController {
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const halls = await hallService.findAll();
      res.json(halls);
    } catch (err) {
      next(err);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const hall = await hallService.findById(req.params.id);

      if (!hall) {
        throw new HttpError(404, "Nie znaleziono sali", "HALL_NOT_FOUND");
      }

      res.json(hall);
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
          "Nazwa sali jest wymagana",
          "MISSING_FIELDS"
        );
      }

      const hall = await hallService.create({ name });
      res.status(201).json(hall);
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
          "Nazwa sali nie może być pusta",
          "MISSING_FIELDS"
        );
      }

      const updatedHall = await hallService.update(id, { name });
      res.json(updatedHall);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await hallService.delete(id);

      res.json({
        message: "Sala została usunięta",
      });
    } catch (err) {
      next(err);
    }
  }
}

export const hallController = new HallController();

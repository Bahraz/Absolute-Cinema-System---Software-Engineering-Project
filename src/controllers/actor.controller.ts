import { Request, Response, NextFunction } from "express";
import { actorService } from "@services/actor.service";
import { HttpError } from "@utils/httpError";

class ActorsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const actors = await actorService.findAll();
      res.json(actors);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, surname } = req.body;

      if (!name || !surname) {
        throw new HttpError(400, "Brak danych", "MISSING_FIELDS");
      }

      const actor = await actorService.create({ name, surname });
      res.status(201).json(actor);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, surname } = req.body;

      const actor = await actorService.update(req.params.id, {
        name,
        surname,
      });

      if (!actor) {
        throw new HttpError(404, "Nie znaleziono aktora", "ACTOR_NOT_FOUND");
      }

      res.json(actor);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = await actorService.delete(req.params.id);

      if (!actor) {
        throw new HttpError(404, "Nie znaleziono aktora", "ACTOR_NOT_FOUND");
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

export const actorsController = new ActorsController();

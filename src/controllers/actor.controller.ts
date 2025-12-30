import { Request, Response } from "express";
import { actorRepository } from "@repositories/actor.repository";

class ActorsController {
  /* ================= VIEW ================= */
  async panel(req: Request, res: Response) {
    const actors = await actorRepository.findAll();
    res.render("admin/actors", { actors });
  }

  /* ================= API ================= */
  async getAll(req: Request, res: Response) {
    const actors = await actorRepository.findAll();
    res.json(actors);
  }

  async create(req: Request, res: Response) {
    const { name, surname } = req.body;

    if (!name || !surname) {
      return res.status(400).json({ error: "Brak danych" });
    }

    const actor = await actorRepository.create({ name, surname });
    res.status(201).json(actor);
  }

  async update(req: Request, res: Response) {
    const { name, surname } = req.body;

    const actor = await actorRepository.update(req.params.id, {
      name,
      surname,
    });

    if (!actor) {
      return res.status(404).json({ error: "Nie znaleziono aktora" });
    }

    res.json(actor);
  }

  async delete(req: Request, res: Response) {
    const actor = await actorRepository.delete(req.params.id);

    if (!actor) {
      return res.status(404).json({ error: "Nie znaleziono aktora" });
    }

    res.status(204).end();
  }
}

export const actorsController = new ActorsController();

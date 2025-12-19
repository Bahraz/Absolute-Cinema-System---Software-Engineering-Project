import type { Request, Response } from "express";
import { Actor } from "@models/actorModel";

export class ActorsController {
  // GET /actors
  async show(req: Request, res: Response) {
    try {
      const actors = await Actor.find({}, "name surname");
      res.status(200).json(actors);
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // POST /actors
  async add(req: Request, res: Response) {
    const { name, surname } = req.body;

    if (!name?.trim() || !surname?.trim()) {
      return res.status(400).json({ error: "Wymagane pola: name, surname" });
    }

    try {
      const actor = new Actor({ name: name.trim(), surname: surname.trim() });
      await actor.save();

      res.status(201).json(actor);
    } catch (err: unknown) {
      res.status(422).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // DELETE /actors/:id
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deleted = await Actor.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Aktor nie został znaleziony" });
      }

      res.status(200).json({ message: "Aktor usunięty pomyślnie" });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // PUT /actors/:id
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, surname } = req.body;

    if (!name?.trim() || !surname?.trim()) {
      return res.status(400).json({ error: "Wymagane pola: name, surname" });
    }

    try {
      const updated = await Actor.findByIdAndUpdate(
        id,
        { name: name.trim(), surname: surname.trim() },
        { new: true } // zwraca zaktualizowany dokument
      );

      if (!updated) {
        return res.status(404).json({ error: "Aktor nie został znaleziony" });
      }

      res.status(200).json({
        message: "Aktor zaktualizowany pomyślnie",
        actor: updated,
      });
    } catch (err: unknown) {
      res.status(422).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
}

export const actorsController = new ActorsController();
